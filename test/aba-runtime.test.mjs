import assert from "node:assert/strict";
import test from "node:test";
import { createABA } from "../src/aba-runtime.mjs";

test("ABA receives, queues, processes, emits, and records a turn", async () => {
  const aba = createABA({
    cognition: {
      classify: async () => ({ intent: "TEST", tool_required: true }),
      plan: async () => ({
        steps: ["invoke test.echo"],
        tool_calls: [{ name: "test.echo", input: { value: "matter" } }]
      }),
      respond: async ({ tool_results }) => "ABA:" + tool_results[0].output.value
    }
  });

  aba.registerTool({
    name: "test.echo",
    address: "tool://test.echo",
    input_schema: { type: "object" },
    execute: async input => ({ value: input.value })
  });

  const input = aba.receiveInput("hello");
  assert.equal(input.state, "QUEUED");
  const result = await aba.processNext();
  assert.equal(result.input.state, "RECORDED");
  assert.equal(result.output.state, "RECORDED");
  assert.equal(result.output.content, "ABA:matter");
  assert.equal(result.receipt.type, "TURN");
});

test("ABA context policy enforces a bounded working context", () => {
  const aba = createABA({
    context_policy: { max_messages: 2, max_estimated_tokens: 20, reserve_output_tokens: 4, max_message_chars: 100 }
  });
  aba.receiveInput("one");
  aba.receiveInput("two");
  aba.receiveInput("three");
  const context = aba.buildContext();
  assert.ok(context.messages.length <= 2);
  assert.ok(context.estimated_tokens <= 16);
});

test("ABA tools are addressable and their identity is explicit", () => {
  const aba = createABA();
  const tool = aba.registerTool({
    name: "filesystem.read",
    address: "action://filesystem.read",
    description: "Read an authorized file",
    input_schema: { type: "object" },
    execute: async () => "ok"
  });
  assert.equal(tool.address, "action://filesystem.read");
  assert.equal(aba.listTools()[0].name, "filesystem.read");
});
