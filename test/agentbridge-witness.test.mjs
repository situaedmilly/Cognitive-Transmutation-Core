import assert from "node:assert/strict";
import test from "node:test";
import { reconcileAgentBridgeWitness } from "../src/agentbridge-witness.mjs";

const tree = {
  schema: "ADDRESSSELF-ENDPOINT-TREE-v0.2",
  root: { node_id: "ROOT", address: "192.168.12.112" },
  nodes: [
    { node_id: "ADDR-192-168-12-112-3000-mcpAGENTBRIDGE01", address: "http://192.168.12.112:3000/mcpAGENTBRIDGE01", status: "NOT_DECLARED_LIVE" },
    { node_id: "ADDR-192-168-12-112-11434-v1-modelAGENTBRIDGE02", address: "http://192.168.12.112:11434/v1/modelAGENTBRIDGE02", status: "OBSERVED_LIVE", evidence: { http_status: 200 } }
  ]
};

test("witness reaches READY when both canonical nodes resolve", () => {
  const w = reconcileAgentBridgeWitness(tree);
  assert.equal(w.state, "READY");
  assert.equal(w.endpoints.AGENTBRIDGE01.state, "NOT_DECLARED_LIVE");
  assert.equal(w.endpoints.AGENTBRIDGE02.state, "OBSERVED_LIVE");
  assert.match(w.witness_hash, /^sha256:/);
});

test("witness snapshot changes when canonical state changes", () => {
  const a = reconcileAgentBridgeWitness(tree);
  const next = JSON.parse(JSON.stringify(tree));
  next.nodes[0].status = "OBSERVED_LIVE";
  const b = reconcileAgentBridgeWitness(next, a);
  assert.notEqual(a.witness_hash, b.witness_hash);
  assert.equal(b.previous_witness_hash, a.witness_hash);
});
