import { createHash } from "node:crypto";
import { advanceThought, verifyThoughtBytes } from "./selfthought.mjs";

const sha256 = value => createHash("sha256").update(value, "utf8").digest("hex");
const canonical = value => JSON.stringify(value);

function requireString(value, field) {
  if (typeof value !== "string" || value.length === 0) throw new TypeError(field + " must be a non-empty string");
}

export function resolveReceiver(thought, receiverId) {
  requireString(receiverId, "receiverId");
  if (!verifyThoughtBytes(thought)) throw new Error("SELFTHOUGHT byte integrity failed");
  const receiver = thought.receiver_manifest.find(item => item?.peer_id === receiverId);
  if (!receiver) return { status: "NOT_FOUND", receiver_id: receiverId };
  return { status: "RESOLVED", receiver_id: receiverId, session_id: receiver.session_id ?? null };
}

export function bindPeer(resolution, peerRecord) {
  if (resolution.status !== "RESOLVED") throw new Error("Cannot bind unresolved receiver");
  if (!peerRecord || peerRecord.peer_id !== resolution.receiver_id) throw new Error("Peer binding mismatch");
  return Object.freeze({ ...resolution, peer_binding: peerRecord.peer_id, peer_status: peerRecord.status ?? "UNKNOWN" });
}

export function admitPeer(binding) {
  if (binding.peer_status !== "ADMITTED") throw new Error("Peer is not admitted");
  return Object.freeze({ ...binding, admission: "PEER_ADMITTED" });
}

export function executeReverself({ thought, receiverId, peerRecord, actimanirunId }) {
  requireString(actimanirunId, "actimanirunId");
  if (!verifyThoughtBytes(thought)) throw new Error("SELFTHOUGHT byte integrity failed");

  const resolution = resolveReceiver(thought, receiverId);
  const bound = bindPeer(resolution, peerRecord);
  const admitted = admitPeer(bound);

  let current = thought;
  for (const transition of ["RESOLVED", "EMITTED", "RECEIVED", "UNDERSTOOD"]) {
    if (current.status === transition) continue;
    current = advanceThought(current, transition);
  }
  current = advanceThought(current, "GATE_PASSED");
  current = advanceThought(current, "SELFSHIFTED");

  const effect = {
    effect_type: "SELFSHIFT_EFFECT",
    thought_id: current.thought_id,
    thought_hash: current.thought_hash,
    receiver_id: receiverId,
    peer_binding: admitted.peer_binding,
    actimanirun_id: actimanirunId,
    transition: "SELFSHIFTED",
    external_effect: false
  };
  const effect_bytes = canonical(effect);
  const effect_hash = "sha256:" + sha256(effect_bytes);

  const receipt = {
    receipt_type: "REVERSELF_RECEIPT",
    result: "SELFSHIFT_EXECUTED_AND_EFFECT_OBSERVED",
    thought_id: current.thought_id,
    thought_hash: current.thought_hash,
    actimanirun_id: actimanirunId,
    peer_admission: admitted.admission,
    effect_hash,
    external_effect: false
  };

  const delta = {
    delta_type: "SELFGRAPH_DELTA",
    nodes: [
      { node_type: "THOUGHT", id: current.thought_id },
      { node_type: "PEER", id: receiverId },
      { node_type: "ACTIMANIRUN", id: actimanirunId }
    ],
    edges: [
      { edge_type: "EMITTED_TO", from: current.thought_id, to: receiverId },
      { edge_type: "ADMITTED_PEER", from: current.thought_id, to: receiverId },
      { edge_type: "ACTIMANIRUN", from: receiverId, to: actimanirunId },
      { edge_type: "SELFSHIFTED", from: current.thought_id, to: actimanirunId }
    ],
    causal_receipt: effect_hash
  };

  return Object.freeze({ thought: current, resolution, binding: admitted, effect, receipt, delta });
}
