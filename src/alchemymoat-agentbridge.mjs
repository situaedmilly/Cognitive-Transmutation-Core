import { createHash } from "node:crypto";
import { reconcileAgentBridgeWitness } from "./agentbridge-witness.mjs";

const digest = value => "sha256:" + createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function deriveAlchemyThought(addressTree, previousWitness = null) {
  const witness = reconcileAgentBridgeWitness(addressTree, previousWitness);
  const live = Object.values(witness.endpoints).filter(e => e.state === "OBSERVED_LIVE");
  const unresolved = Object.values(witness.endpoints).filter(e => !e.resolved);
  const hypothesis =
    live.length === 0 ? "NO_LIVE_AGENTBRIDGE_ENDPOINT_OBSERVED" :
    unresolved.length ? "PARTIAL_AGENTBRIDGE_REALITY" :
    "AGENTBRIDGE_REALITY_READY_FOR_COGNITIVE_ROUTING";

  const thought = {
    thought_type: "ALCHEMYMOAT_AGENTBRIDGE_THOUGHT",
    witness_hash: witness.witness_hash,
    state: witness.state,
    hypothesis,
    live_endpoint_ids: live.map(e => e.agentbridge_id),
    unresolved_endpoint_ids: unresolved.map(e => e.agentbridge_id),
    next_surface: unresolved.length ? "ADDRESSSELF_RECONCILIATION" : "ACTIONWORKSELF_WORKFLOWRUN"
  };
  return Object.freeze({
    ...thought,
    thought_id: digest(thought)
  });
}

export function evolveAlchemyMoat(previousThought, addressTree) {
  return deriveAlchemyThought(addressTree, previousThought ? { witness_hash: previousThought.witness_hash } : null);
}
