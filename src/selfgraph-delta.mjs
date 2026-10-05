import { createHash } from "node:crypto";

const canonical = value => JSON.stringify(value);
export function hashSelfgraphDelta(delta) {
  return "sha256:" + createHash("sha256").update(canonical(delta), "utf8").digest("hex");
}
export function validateSelfgraphDelta(delta) {
  if (!delta || delta.delta_type !== "SELFGRAPH_DELTA") return false;
  if (!Array.isArray(delta.nodes) || !Array.isArray(delta.edges)) return false;
  if (typeof delta.causal_receipt !== "string" || !/^sha256:[0-9a-f]{64}$/.test(delta.causal_receipt)) return false;
  return true;
}
