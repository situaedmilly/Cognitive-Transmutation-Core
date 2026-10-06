# ABA Alchemy Engine v0.2

Authorized engineering dimensions: durable, interruptible, replayable, streamable, permissioned, forkable, locally executable.

The journal is the alchemical substrate. INPUT, QUEUE, COGNITION, EXECUTOR, OUTPUT, and SESSION operations all become lineage-bearing events.

- Durable: exportDurableState serializes queue, outputs, journal, sessions, permissions, and context policy.
- Interruptible: an admitted/processing message can enter INTERRUPTED; cognitive phases re-check the interruption boundary.
- Replayable: replay(n) exposes journal history through a selected event boundary.
- Streamable: output becomes ordered frames with stream identity and final marker, followed by EMITTED and RECORDED events.
- Permissioned: admission, processing, interruption, executor registration/invocation, streaming, and session fork are independently gated.
- Forkable: a session fork copies context while recording parent session and branch point.
- Locally executable: executors are direct runtime functions; no hosted model provider is required by this engine.

SELFMOAT remains: DECLARATION != ADMISSION != EXECUTION != OBSERVATION != EFFECT.

The next recovery layer is a filesystem-backed append-only journal and boot-time rehydration. The engine contract already exposes the durable state needed for that adapter.