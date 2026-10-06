import { createHash } from "node:crypto";

export const AGENTBRIDGE_WITNESS = Object.freeze({
  AGENTBRIDGE01: Object.freeze({
    agentbridge_id: "AGENTBRIDGE01",
    address_node_id: "ADDR-192-168-12-112-3000-mcpAGENTBRIDGE01",
    expected_address: "http://192.168.12.112:3000/mcpAGENTBRIDGE01"
  }),
  AGENTBRIDGE02: Object.freeze({
    agentbridge_id: "AGENTBRIDGE02",
    address_node_id: "ADDR-192-168-12-112-11434-v1-modelAGENTBRIDGE02",
    expected_address: "http://192.168.12.112:11434/v1/modelAGENTBRIDGE02"
  })
});

const hash = value => "sha256:" + createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function reconcileAgentBridgeWitness(addressTree, previous = null) {
  const nodes = [addressTree.root, ...(addressTree.nodes ?? [])];
  const endpoints = {};
  for (const [id, binding] of Object.entries(AGENTBRIDGE_WITNESS)) {
    const node = nodes.find(n => n.node_id === binding.address_node_id || n.address === binding.expected_address);
    endpoints[id] = {
      ...binding,
      resolved: Boolean(node),
      address: node?.address ?? binding.expected_address,
      state: node?.status ?? "UNRESOLVED",
      evidence: node?.evidence ?? null
    };
  }
  const state = Object.values(endpoints).every(e => e.resolved) ? "READY" : "DEGRADED";
  const snapshot = {
    witness_version: "v0.1",
    state,
    source_schema: addressTree.schema,
    endpoints,
    previous_witness_hash: previous?.witness_hash ?? null
  };
  return Object.freeze({ ...snapshot, witness_hash: hash(snapshot) });
}
