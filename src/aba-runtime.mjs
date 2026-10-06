import { createHash, randomUUID } from "node:crypto";

export const ABA_VERSION = "v0.1";
export const QUEUE_STATES = ["RECEIVED","QUEUED","ADMITTED","PROCESSING","OUTPUT_READY","EMITTED","RECORDED","FAILED"];
export const COGNITIVE_PHASES = ["INGEST","CONTEXT","CLASSIFY","PLAN","TOOL_GATE","EXECUTE","SYNTHESIZE","RECORD"];
export const DEFAULT_CONTEXT_POLICY = Object.freeze({max_messages:64,max_estimated_tokens:8192,reserve_output_tokens:2048,max_message_chars:24000});

const now = () => new Date().toISOString();
const canonical = value => JSON.stringify(value, Object.keys(value).sort());
const hash = value => createHash("sha256").update(canonical(value)).digest("hex");
const estimateTokens = text => Math.ceil(String(text ?? "").length / 4);
const clone = value => JSON.parse(JSON.stringify(value));

export function createABA(config = {}) {
  const state = {
    aba_id: config.aba_id ?? "ABA-LOCAL",
    version: ABA_VERSION,
    authority: config.authority ?? "OURSELF",
    created_at: now(),
    input_queue: [],
    output_queue: [],
    receipts: [],
    events: [],
    tools: new Map(),
    context: [],
    context_policy: {...DEFAULT_CONTEXT_POLICY,...(config.context_policy ?? {})},
    turn_sequence: 0,
    processing: false,
    cognition: config.cognition ?? null,
    responder: config.responder ?? null
  };

  function event(type, payload = {}) {
    const record = {event_id:randomUUID(),sequence:state.events.length+1,type,timestamp:now(),...clone(payload)};
    record.event_hash = hash(record);
    state.events.push(record);
    return clone(record);
  }

  function receipt(type, payload = {}) {
    const record = {receipt_id:randomUUID(),aba_id:state.aba_id,type,timestamp:now(),...clone(payload)};
    record.receipt_hash = hash(record);
    state.receipts.push(record);
    return clone(record);
  }

  function transition(item, next, extra = {}) {
    const previous = item.state;
    item.state = next;
    item.updated_at = now();
    Object.assign(item, clone(extra));
    event("QUEUE_STATE",{message_id:item.message_id,previous,next,queue:item.queue,extra});
  }

  function receiveInput(input, meta = {}) {
    const text = typeof input === "string" ? input : JSON.stringify(input);
    const message = {
      message_id:randomUUID(), sequence:state.turn_sequence+1, queue:"INPUT", state:"RECEIVED",
      source:meta.source ?? "OURSELF", authority:meta.authority ?? state.authority,
      content_type:meta.content_type ?? "text/plain", content:text,
      metadata:clone(meta.metadata ?? {}), lineage:clone(meta.lineage ?? []),
      created_at:now(), updated_at:now()
    };
    state.turn_sequence += 1;
    state.input_queue.push(message);
    transition(message,"QUEUED");
    event("INPUT_RECEIVED",{message});
    return clone(message);
  }

  function registerTool(definition) {
    if (!definition?.name || !definition?.address || typeof definition.execute !== "function") throw new Error("INVALID_TOOL_DEFINITION");
    if (state.tools.has(definition.name)) throw new Error("TOOL_ALREADY_REGISTERED");
    const tool = {
      name:definition.name, address:definition.address, description:definition.description ?? "",
      input_schema:clone(definition.input_schema ?? {}), authority:definition.authority ?? "EXPLICIT",
      execute:definition.execute
    };
    state.tools.set(tool.name,tool);
    event("TOOL_REGISTERED",{name:tool.name,address:tool.address,authority:tool.authority});
    return {name:tool.name,address:tool.address,description:tool.description,input_schema:clone(tool.input_schema),authority:tool.authority};
  }

  function listTools() {
    return [...state.tools.values()].map(({execute,...tool}) => clone(tool));
  }

  async function executeTool(name,input,meta={}) {
    const tool=state.tools.get(name);
    if (!tool) throw new Error("TOOL_NOT_FOUND");
    const invocation={invocation_id:randomUUID(),tool:name,address:tool.address,input:clone(input),requested_by:meta.requested_by ?? state.authority,timestamp:now()};
    event("TOOL_INVOKED",invocation);
    try {
      const output=await tool.execute(clone(input),{invocation:clone(invocation),aba:publicRuntime()});
      const result={...invocation,status:"SUCCEEDED",output:clone(output),completed_at:now()};
      event("TOOL_COMPLETED",result);
      return result;
    } catch(error) {
      const result={...invocation,status:"FAILED",error:String(error?.message ?? error),completed_at:now()};
      event("TOOL_FAILED",result);
      throw Object.assign(new Error(result.error),{receipt:result});
    }
  }

  function buildContext() {
    const policy=state.context_policy;
    const budget=Math.max(0,policy.max_estimated_tokens-policy.reserve_output_tokens);
    const selected=[]; let tokens=0;
    for(let i=state.context.length-1;i>=0;i-=1) {
      const item=state.context[i];
      const content=String(item.content ?? "").slice(0,policy.max_message_chars);
      const cost=estimateTokens(content);
      if(selected.length>=policy.max_messages || tokens+cost>budget) break;
      selected.unshift({...clone(item),content}); tokens+=cost;
    }
    return {messages:selected,estimated_tokens:tokens,budget_tokens:budget,policy:clone(policy)};
  }

  function appendContext(role,content,metadata={}) {
    state.context.push({context_id:randomUUID(),role,content:String(content),metadata:clone(metadata),timestamp:now()});
  }

  async function processNext() {
    if(state.processing) throw new Error("ABA_ALREADY_PROCESSING");
    const message=state.input_queue.find(item=>item.state==="QUEUED");
    if(!message) return null;
    state.processing=true;
    transition(message,"ADMITTED");
    transition(message,"PROCESSING");
    const phases=[];
    const phase=(name,data={}) => {
      const record={phase:name,timestamp:now(),...clone(data)};
      phases.push(record);
      event("COGNITIVE_PHASE",{message_id:message.message_id,...record});
      return record;
    };

    try {
      phase("INGEST",{source:message.source,content_hash:hash(message.content)});
      appendContext("user",message.content,{message_id:message.message_id,source:message.source});
      const context=buildContext();
      phase("CONTEXT",{message_count:context.messages.length,estimated_tokens:context.estimated_tokens,budget_tokens:context.budget_tokens});

      const classification=state.cognition?.classify
        ? await state.cognition.classify({input:clone(message),context:clone(context)})
        : {intent:"UNCLASSIFIED",tool_required:false};
      phase("CLASSIFY",classification);

      const plan=state.cognition?.plan
        ? await state.cognition.plan({input:clone(message),context:clone(context),classification:clone(classification),tools:listTools()})
        : {steps:[],tool_calls:[]};
      phase("PLAN",plan);

      phase("TOOL_GATE",{requested_tools:(plan.tool_calls ?? []).map(x=>x.name),available_tools:listTools().map(x=>x.name)});
      const toolResults=[];
      for(const call of plan.tool_calls ?? []) toolResults.push(await executeTool(call.name,call.input ?? {},{requested_by:message.message_id}));
      phase("EXECUTE",{tool_results:toolResults.map(result=>({invocation_id:result.invocation_id,tool:result.tool,address:result.address,status:result.status}))});

      const response=state.responder
        ? await state.responder({input:clone(message),context:clone(context),classification:clone(classification),plan:clone(plan),tool_results:clone(toolResults)})
        : state.cognition?.respond
          ? await state.cognition.respond({input:clone(message),context:clone(context),classification:clone(classification),plan:clone(plan),tool_results:clone(toolResults)})
          : "ABA_COGNITION_ENGINE_NOT_BOUND";

      phase("SYNTHESIZE",{response_hash:hash(response)});
      const output={
        message_id:randomUUID(),parent_message_id:message.message_id,sequence:state.turn_sequence+1,
        queue:"OUTPUT",state:"OUTPUT_READY",source:state.aba_id,authority:state.authority,
        content_type:"text/plain",content:String(response),
        metadata:{aba_version:ABA_VERSION,phases,context_estimated_tokens:context.estimated_tokens},
        lineage:[message.message_id],created_at:now(),updated_at:now()
      };
      state.turn_sequence+=1;
      state.output_queue.push(output);
      appendContext("assistant",output.content,{message_id:output.message_id});
      transition(message,"OUTPUT_READY",{output_message_id:output.message_id});
      transition(output,"EMITTED");
      phase("RECORD",{output_message_id:output.message_id});
      const r=receipt("TURN",{input_message_id:message.message_id,output_message_id:output.message_id,phase_count:phases.length,tool_invocations:toolResults.map(x=>x.invocation_id)});
      transition(message,"RECORDED",{receipt_id:r.receipt_id});
      transition(output,"RECORDED",{receipt_id:r.receipt_id});
      return {input:clone(message),output:clone(output),receipt:r,phases};
    } catch(error) {
      transition(message,"FAILED",{error:String(error?.message ?? error)});
      const r=receipt("TURN_FAILED",{input_message_id:message.message_id,error:String(error?.message ?? error)});
      message.receipt_id=r.receipt_id;
      throw Object.assign(error,{receipt:r});
    } finally {
      state.processing=false;
    }
  }

  function snapshot() {
    return {aba_id:state.aba_id,version:state.version,authority:state.authority,input_queue:clone(state.input_queue),output_queue:clone(state.output_queue),receipts:clone(state.receipts),events:clone(state.events),context:clone(state.context),context_policy:clone(state.context_policy),turn_sequence:state.turn_sequence,processing:state.processing,tools:listTools()};
  }

  function exportState() { return JSON.stringify(snapshot(),null,2); }

  function publicRuntime() {
    return {id:state.aba_id,version:ABA_VERSION,receiveInput,registerTool,listTools,executeTool,buildContext,processNext,snapshot,exportState};
  }

  return publicRuntime();
}
