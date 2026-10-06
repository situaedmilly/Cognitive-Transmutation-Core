import assert from "node:assert/strict";
import test from "node:test";
import { createABAAchemy } from "../src/aba-alchemymoat.mjs";

const tree = {
  root: { id: "ADDR-ROOT", address: "192.168.12.112" },
  nodes: [
    { id: "ADDR-192-168-12-112-3000-mcpAGENTBRIDGE01", address: "http://192.168.12.112:3000/mcpAGENTBRIDGE01", status: "NOT_DECLARED_LIVE" },
    { id: "ADDR-192-168-12-112-11434-v1-modelAGENTBRIDGE02", address: "http://192.168.12.112:11434/v1/modelAGENTBRIDGE02", status: "OBSERVED_LIVE", evidence: { http_status: 200 } }
  ]
};

test("ABA Alchemy binds cognition to AddressSelf-derived AgentBridge reality", async () => {
  const aba = createABAAchemy({
    addressTree: tree,
    cognition: {
      classify: async () => ({ intent: "REALITY", tool_required: true }),
      plan: async () => ({ tool_calls: [{ name: "agentbridge.reality", input: {} }] }),
      respond: async ({ tool_results }) => tool_results[0].output.hypothesis
    }
  });

  const input = aba.receiveInput("What is AgentBridge reality?");
  assert.equal(input.state, "QUEUED");
  const result = await aba.processNext();
  assert.equal(result.output.state, "RECORDED");
  assert.equal(result.output.content, "AGENTBRIDGE_REALITY_READY_FOR_COGNITIVE_ROUTING");
  assert.equal(result.receipt.type, "TURN");
});
