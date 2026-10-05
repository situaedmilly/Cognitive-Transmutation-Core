import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createSelfThought } from "../src/selfthought.mjs";
import { executeReverself } from "../src/reverself.mjs";
import { hashSelfgraphDelta, validateSelfgraphDelta } from "../src/selfgraph-delta.mjs";

const effectHash = effect =>
  "sha256:" + createHash("sha256").update(JSON.stringify(effect), "utf8").digest("hex");

const thought = createSelfThought({
  thought: "REVERSE SELF: bind the resolved peer and admit the transition.",
  originInstanceId: "INSTANCE-A",
  originSessionId: "SESSION-A",
  originActimanirunId: "ACTIMANIRUN-ORIGIN",
  originRealityId: "REALITY-001",
  receiverManifest: [{ peer_id: "INSTANCE-B", session_id: "SESSION-B" }],
  matterManifest: [{ instance_id: "MATTER-17" }],
  realityManifest: [{ reality_id: "REALITY-001" }],
  gate: { id: "GATE-SELFGRAPH-001", required: true }
});

test("REVERSELF reaches SELFGRAPH_DELTA through explicit gates", () => {
  const result = executeReverself({
    thought,
    receiverId: "INSTANCE-B",
    peerRecord: { peer_id: "INSTANCE-B", status: "ADMITTED" },
    actimanirunId: "ACTIMANIRUN-001"
  });
  assert.equal(result.resolution.status, "RESOLVED");
  assert.equal(result.binding.admission, "PEER_ADMITTED");
  assert.equal(result.thought.status, "SELFSHIFTED");
  assert.equal(result.effect.external_effect, false);
  assert.equal(result.receipt.result, "SELFSHIFT_EXECUTED_AND_EFFECT_OBSERVED");
  assert.equal(result.receipt.effect_hash, effectHash(result.effect));
  assert.equal(validateSelfgraphDelta(result.delta), true);
  assert.equal(result.delta.causal_receipt, result.receipt.effect_hash);
  assert.match(hashSelfgraphDelta(result.delta), /^sha256:[0-9a-f]{64}$/);
});

test("REVERSELF blocks non-admitted peers", () => {
  assert.throws(() => executeReverself({
    thought,
    receiverId: "INSTANCE-B",
    peerRecord: { peer_id: "INSTANCE-B", status: "PROPOSED" },
    actimanirunId: "ACTIMANIRUN-002"
  }), /not admitted/);
});

test("REVERSELF never infers a receiver", () => {
  assert.throws(() => executeReverself({
    thought,
    receiverId: "INSTANCE-C",
    peerRecord: { peer_id: "INSTANCE-C", status: "ADMITTED" },
    actimanirunId: "ACTIMANIRUN-003"
  }), /NOT_FOUND|Cannot bind unresolved receiver/);
});
