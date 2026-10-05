# REVERSELF -> SELFGRAPHDELTA v0.1

## Objective

Close the first causal loop after SELFTHOUGHT without collapsing message, admission, actuation, effect, receipt, or graph state.

## Required sequence

SELFTHOUGHT
-> SELFCOMM
-> RECEIVER_RESOLUTION
-> PEER_BINDING
-> PEER_ADMITTED
-> ACTIMANIRUN
-> SELFSHIFT
-> EFFECTSELF
-> RECEIPTSELF
-> SELFGRAPH_DELTA

## Runtime invariants

- THOUGHT_ID != BIRTH_ID
- REALITY_ID != INSTANCE_ID != SESSION_ID != ACTIMANIRUN_ID
- receiver declaration does not equal receiver resolution
- receiver resolution does not equal peer admission
- peer admission does not equal actuation
- actuation does not equal effect
- effect does not equal receipt
- receipt does not equal graph mutation
- graph delta must carry causal receipt binding
- external_effect remains false for this v0.1 deterministic witness

## v0.1 scope

The implementation is a deterministic local transition engine. It does not claim physical SELFCOMM network transport, resident SELFPI execution, or external side effects.

Those are separate witness surfaces.
