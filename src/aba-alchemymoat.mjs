import { createABA } from "./aba-runtime.mjs";
import { deriveAlchemyThought } from "./alchemymoat-agentbridge.mjs";

export function createABAAchemy({ addressTree, cognition, responder, context_policy } = {}) {
  if (!addressTree) throw new Error("ADDRESS_TREE_REQUIRED");

  const aba = createABA({
    aba_id: "ABA-AGENTBRIDGE-ALCHEMY",
    authority: "OURSELF",
    cognition,
    responder,
    context_policy
  });

  aba.registerTool({
    name: "agentbridge.reality",
    address: "agentbridge://reality",
    description: "Derive the current bounded AgentBridge witness/thought from AddressSelf topology.",
    input_schema: { type: "object" },
    authority: "OURSELF",
    execute: async () => deriveAlchemyThought(addressTree)
  });

  aba.registerTool({
    name: "agentbridge.address",
    address: "agentbridge://address",
    description: "Expose the supplied AddressSelf topology as a read surface.",
    input_schema: { type: "object" },
    authority: "OURSELF",
    execute: async () => ({
      root: addressTree.root,
      node_count: Array.isArray(addressTree.nodes) ? addressTree.nodes.length : 0,
      nodes: addressTree.nodes ?? []
    })
  });

  return aba;
}
