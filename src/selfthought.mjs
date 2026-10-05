import { createHash, randomUUID, randomBytes } from "node:crypto";

const hashBytes = bytes => createHash("sha256").update(bytes).digest("hex");
function requireString(value, field) { if (typeof value !== "string" || value.length === 0) throw new TypeError(field + " must be a non-empty string"); }
export function hashThoughtBytes(thought) { return "sha256:" + hashBytes(Buffer.from(thought, "utf8")); }
export function createSelfThought(input) {
  for (const field of ["originInstanceId","originSessionId","originActimanirunId","originRealityId"]) requireString(input[field], field);
  requireString(input.thought, "thought");
  return Object.freeze({ thought_id: input.thoughtId ?? "THOUGHT-" + randomUUID(), thought_birth_id: input.thoughtBirthId ?? "BIRTH-" + randomUUID(), nonce: input.nonce ?? randomBytes(24).toString("hex"), origin_instance_id: input.originInstanceId, origin_session_id: input.originSessionId, origin_actimanirun_id: input.originActimanirunId, origin_reality_id: input.originRealityId, thought_bytes: input.thought, thought_encoding: "utf-8", thought_hash: hashThoughtBytes(input.thought), matter_manifest: input.matterManifest ?? [], reality_manifest: input.realityManifest ?? [], receiver_manifest: input.receiverManifest ?? [], created_at: input.createdAt ?? new Date().toISOString(), causal_parent: input.causalParent ?? null, relation: input.relation ?? "SIGNAL", gate: input.gate ?? { id: "UNSPECIFIED", required: false }, status: "HASHED" });
}
export function verifyThoughtBytes(artifact) { requireString(artifact.thought_bytes, "thought_bytes"); return hashThoughtBytes(artifact.thought_bytes) === artifact.thought_hash; }
export function advanceThought(artifact, transition) { const allowed = { HASHED:["RESOLVED"], RESOLVED:["EMITTED"], EMITTED:["RECEIVED"], RECEIVED:["UNDERSTOOD"], UNDERSTOOD:["GATE_BLOCKED","GATE_PASSED"], GATE_PASSED:["SELFSHIFTED"] }; if (!allowed[artifact.status]?.includes(transition)) throw new Error("Invalid SELFTHOUGHT transition: " + artifact.status + " -> " + transition); return Object.freeze({ ...artifact, status: transition }); }
