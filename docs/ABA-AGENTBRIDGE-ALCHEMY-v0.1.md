# ABA — AgentBridgeAlchemy Runtime v0.1

## Status

IMPLEMENTED FOUNDATION.

ABA is the runtime identity for AgentBridgeAlchemy. It does not require Ollama, Hugging Face, a hosted model API, or GitHub Actions for its queue, context, tool, lifecycle, or receipt protocol.

## Runtime boundary

VERBAL MATTER → INPUT → QUEUE → COGNITIVE PHASES → ADDRESSABLE TOOLS → OUTPUT → RECEIPT

A session turn is a runtime event with identity, lineage, state, and evidence.

## Processing protocol

ABA exposes explicit phases:

1. INGEST — bind received matter to an input message and content hash.
2. CONTEXT — construct a bounded working context with an explicit budget.
3. CLASSIFY — determine intent and whether tools are required.
4. PLAN — produce executable steps and requested tool calls.
5. TOOL_GATE — compare requested tools against the registered tool surface.
6. EXECUTE — invoke tools by canonical address/name and retain invocation evidence.
7. SYNTHESIZE — construct the response from input, context, plan, and tool results.
8. RECORD — emit a turn receipt and preserve lineage.

The protocol is explicit and observable. It does not claim equivalence with proprietary internal implementations.

## Queue lifecycle

RECEIVED → QUEUED → ADMITTED → PROCESSING → OUTPUT_READY → EMITTED → RECORDED

Failure is terminal for the affected turn and produces a TURN_FAILED receipt.

## Context-window foundation

ABA defines maximum message count, estimated token budget, reserved output budget, and maximum message characters. The default estimator is deterministic and replaceable. It is not claimed to be tokenizer-equivalent to any external assistant.

## Addressable tools

A tool is registered as name + address + input_schema + authority + executor. The address is preserved through invocation and completion events, distinguishing declaration from execution.

## SELFMOAT

DECLARATION ≠ ADMISSION ≠ EXECUTION ≠ OBSERVATION ≠ EFFECT

A registration does not prove execution. A receipt does not itself prove external effect.

## No outside cognitive dependency

Queue, context, lifecycle, receipts, tool registry, and processing protocol are local runtime primitives. External model providers may be adapters in another layer; they are not required by this foundation.

## Persistence boundary

exportState() serializes runtime state. A filesystem/daemon adapter can persist and replay that state without changing the ABA protocol.

## Extension surfaces

Persistent queue adapter; event-log replay; explicit authority policy; streaming output frames; context compaction; tool permission scopes; cancellation/interruption; session fork/branch lineage; local executor binding.
