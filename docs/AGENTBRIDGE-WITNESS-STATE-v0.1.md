# AGENTBRIDGE Witness State v0.1

Cognitive-Transmutation-Core derives a witness snapshot from the canonical AddressSelf tree.

Flow:

`AddressSelf → ActionWorkSelf → Cognitive-Transmutation-Core`

- AddressSelf owns endpoint topology and evidence-backed state.
- ActionWorkSelf resolves those canonical nodes before producing execution targets.
- Cognitive-Transmutation-Core derives a witness snapshot from the same nodes.
- A witness is `READY` only when both canonical AGENTBRIDGE nodes resolve.
- The witness carries a content hash and the previous witness hash, making state evolution explicit.

No liveness is invented and no execution authority is granted by the witness.
