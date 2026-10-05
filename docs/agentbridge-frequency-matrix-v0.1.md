# AgentBridge Frequency Matrix v0.1

This document is an engineering reference, not a claim that one prior conversation established four canonical names. The recent AgentBridge work establishes three generations/surfaces:

1. localhost approval bridge
2. provider-neutral bridge kernel
3. processor / SELFCOMM transport corridor

For runtime engineering, those surfaces are decomposed into four observable crossing frequencies:

## F1 — COGNITIVE

Purpose: thought/message formation and interpretation.

Path:
SELFTHOUGHT -> CAPTURE/HASH -> CONTEXTUALIZE -> RESOLVE -> EMIT -> RECEIVE -> UNDERSTAND -> GATE

Authority rule:
MODELSELF is not authority. Cognition may propose, never self-authorize.

## F2 — CODE / LOCAL ACTUATION

Purpose: resident execution on the local execution substrate.

Path:
ACTIONSELF -> OURSELF ACTION RUNNER -> ACTUATIONSELF -> EFFECTSELF -> RECEIPTSELF

Authority rule:
GitHub is not execution authority. A repository artifact is not a runtime witness. Local execution must originate on the resident OURSELF runtime.

## F3 — NETWORK / SELFCOMM

Purpose: peer-to-peer message/event transport.

Path:
SELFCOMM -> CommunicationFabric -> TransportAdapter -> peer endpoint -> delivery evidence

Transport candidates:
STDIO = LOCAL EXECUTION MEMBRANE
STREAMABLE HTTP = NETWORK EXECUTION MEMBRANE
SSE = LEGACY / COMPATIBILITY TRANSPORT

Transport != authority.

## F4 — CUSTODY / SIGNAL / HOST EDGE

Purpose: repository persistence, recontact, MCP host integration, and external signal transport.

Path:
GitHub custody -> recontact signal -> AgentBridge -> OURSELF approval -> resident execution

MCP host edge:
registry/projection -> MCP listTools() -> tool discovered -> MCP call -> AgentBridge/runtime -> actuation -> receipt

Webhook/recontact is a bell, not shell execution.

### Frequency invariant

A crossing between frequencies is an explicit membrane:

COGNITIVE != CODE != NETWORK != CUSTODY

No frequency may silently inherit another frequency's authority.

The causal sequence remains:

POINTERSELFTHIRDEYE -> RESOLVER -> ADDRESSSELF -> IDENTITYSELF -> ADMISSIONSELF -> AUTHORITYSELF -> CAPABILITYSELF -> ACTUATIONSELF -> EFFECTSELF -> RECEIPTSELF

For SELFTHOUGHT, the parallel causal path is:

SELFTHOUGHT -> SELFCOMM -> RECEIVER RESOLUTION -> PEER BINDING -> PEER_ADMITTED -> ACTIMANIRUN -> SELFSHIFT -> RECEIPT -> SELFGRAPH_DELTA
