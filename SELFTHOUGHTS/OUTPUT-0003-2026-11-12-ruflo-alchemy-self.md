# RUFLO ALCHEMY SELF — Ecosystem Breakdown
**Date:** 2026-11-12  
**Baseline:** `ruvnet/ruflo@dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1` — Ruflo 3.76.0  
**Governing boundary:** OAM-BLES-001 v0.1

## Thesis

RUFLO ALCHEMY SELF is the transformation of Ruflo from a capable multi-agent orchestration framework into a governed execution realization inside OURSELF.

Ruflo can coordinate agents. OURSELF determines whether an agent is real, identifiable, authorized, admissible, executable, and evidentially continuous.

Ruflo is a substrate to be examined, decomposed, adapted, and governed—not the constitutional root of the ecosystem.

## 1. What Ruflo actually contributes

At the pinned 3.76.0 baseline, Ruflo is an orchestration and agent-development environment with a CLI/MCP surface, agent and swarm coordination, routing, hooks, background workers, memory/knowledge systems, model-provider integration, plugins, and federation. The 3.76.0 release adds an opt-in nearest-centroid agent router; it does not make that router the default. The upstream documentation also describes separate installation surfaces: a lighter Claude Code plugin path and a fuller CLI initialization path that installs project configuration, hooks, MCP registration, and runtime assets.

These are useful capabilities. They are not proof of OURSELF identity, authority, or effect.

## 2. The ALCHEMY translation

| Ruflo capability | OURSELF interpretation | Disposition |
|---|---|---|
| Agent definitions / agent types | Agent morphology templates | Retain as descriptive input; bind to OURSELF identity |
| `agent_spawn` / agent management | Agent record and realization request | Wrap; registration is not proof of a live process |
| Swarm topology / queen / workers | Coordination topology | Retain as non-constitutional scheduling |
| Router / centroid routing | Task-to-realization selection | Wrap with policy, scope, and explainable routing evidence |
| Hooks | Event observation and transition triggers | Rebuild as typed, bounded adapters; hooks cannot self-authorize |
| Daemon / background workers | Runtime service and work scheduling | OS-supervised; OURSELFD governs lifecycle admissibility |
| Memory / AgentDB / RAG / graph | Retrieval and candidate memory | Treat as untrusted or provisional until evidence admission |
| SONA / learning loops | Adaptation and policy-candidate generation | Quarantine from authority; learning cannot silently change permissions |
| Workflows / autopilot | Proposed transition plans and repeated tasks | Require explicit policy, limits, expiry, and stop conditions |
| Federation | Cross-machine messages and claims | Require peer identity, signed provenance, replay protection, and local admission |
| MCP tools / plugins | Capability adapters | Allowlist by identity, operation, scope, and version |
| Verification / witness features | Potential evidence inputs | Independently evaluate; upstream witness output is not automatically OURSELF-admitted evidence |

## 3. The five organism layers

### A. Constitutional identity — OURSELF

Owns the canonical agent identity, jurisdiction, capability grants, lifecycle policy, and admissible state transitions. Ruflo does not mint or inherit this authority.

### B. Cognitive realization — MODELSELF / METASELFTELLIGENCE

Models and agent prompts perform reasoning, planning, classification, and proposal generation. Claude, GPT, Ollama/Qwen, and other providers are cognitive realization surfaces. A model response is not an authority token.

### C. Coordination realization — RUFLO

Ruflo coordinates task decomposition, worker assignment, routing, shared context, workflow progression, and inter-agent messaging. Its outputs become typed proposals or execution requests at the OURSELF boundary.

### D. Platform process realization — launchd / systemd

The operating system starts, supervises, restarts, and stops processes. macOS uses launchd; Debian-based Raspberry Pi systems use systemd. Ruflo's own daemon/autostart behavior must be distinguished from an OS-managed service. Neither a running daemon nor a spawned agent proves constitutional activation.

### E. Lifecycle governance and witness — OURSELFD + MODELSELFWITNESS

OURSELFD observes process identity and state, evaluates permitted lifecycle transitions, requests bounded changes through platform adapters, and reconciles observed effects. MODELSELFWITNESS or another independent witness evaluates whether the claimed effect actually occurred. The witness must not merely repeat the executor's assertion.

**Invariant:** The operating system owns process supervision. OURSELFD owns constitutional lifecycle governance.

## 4. Agent morphology: separate the species

Do not collapse these objects into one “agent” record:

1. **AGENT_RECORD** — a durable description and canonical identity reference.
2. **EXECUTION_REALIZATION** — a selected model, toolchain, policy-bounded runtime, and adapter configuration capable of performing work.
3. **PROCESS_INSTANCE** — an actual OS process with PID/process metadata, host, executable identity, and observed start/stop state.
4. **EXECUTION_SESSION** — a bounded period of work with its own request lineage, context, expiry, and outcome.
5. **AGENT_MEMBERSHIP** — an admitted relation between an agent identity and a swarm, project, host, or jurisdiction.

An upstream `agent_spawn` call may register or create an agent record; that alone does not establish that a process exists. Likewise, restoring session or memory stores reconstructs data, not a continuously living organism. Each claim needs its own evidence.

## 5. Boot, launch, activation, and recovery

These are distinct transitions:

`HOST_BOOT → OS_SERVICE_START → PROCESS_OBSERVED → IDENTITY_ATTESTED → AUTHORITY_ADMITTED → AGENT_ACTIVATED → SESSION_OPENED → WORK_REQUEST_ADMITTED`

- **Boot:** the host and operating system enter service.
- **Launch:** launchd/systemd starts a configured process.
- **Observation:** OURSELFD confirms the process and its executable/host identity.
- **Attestation:** the observed instance is bound to a verifiable identity and provenance.
- **Admission:** policy authorizes that identity for a defined jurisdiction and capability set.
- **Activation:** OURSELF commits the admissible lifecycle transition.
- **Session opening:** a bounded execution session is created.
- **Work admission:** a specific request is accepted under that session's scope.

A daemon starting on demand is not equivalent to an agent being activated. A process surviving restart is not continuity of authority. Recovery must re-attest identity, reconcile prior state, invalidate stale sessions where required, and obtain fresh admission.

## 6. The execution contract

Every Ruflo-originated action must cross a typed OURSELF gate:

`PROPOSED → IDENTIFIED → AUTHORITY_CHECKED → ADMITTED → ATTEMPTED → EFFECT_OBSERVED → EVIDENCE_EVALUATED → STATE_COMMITTED`

Minimum request envelope:

- `request_id`, `agent_id`, `realization_id`, `process_instance_id`, `session_id`
- `requester_identity`, `target_identity`, `jurisdiction`
- `capability`, `operation`, `scope`, `constraints`
- `issued_at`, `expires_at`, `nonce`, `payload_digest`
- `authorization_reference`, `policy_version`

Minimum receipt distinctions:

- request received;
- identity authenticated;
- authority admitted or denied;
- operation attempted;
- effect independently observed or not observed;
- evidence admitted or rejected;
- state committed or left unchanged.

An executor receipt is not proof of effect. A successful tool response is not proof of downstream state. A model's narrative is not a witness.

## 7. SELFMOAT boundaries

Ruflo must not independently:
- grant itself authority or expand its own capability set;
- execute arbitrary shell or root operations outside an admitted adapter;
- convert a plan, hook, memory item, or agent message into authorization;
- promote learned patterns into policy without governed review;
- treat swarm consensus as OURSELF constitutional consent;
- claim process continuity from restored memory;
- accept federation messages without peer authentication, freshness, scope, and replay controls.

Deterministic mock execution is the first implementation target. It validates the contract without touching real host state. Real actuators remain disabled until identity, admission, bounded execution, observation, and recovery tests pass.

## 8. The target ecosystem graph

```text
                 OURSELF CONSTITUTION
                          |
                    SELFMOAT GATE
                          |
       +------------------+------------------+
       |                  |                  |
  MODELSELF          RUFLO REALIZATION   SELFCOMM / FEDERATION
  cognition          coordination        typed peer messages
       |                  |                  |
       +---------- PROPOSAL / REQUEST -------+
                          |
                 OURSELFD LIFECYCLE
                          |
             launchd / systemd ADAPTERS
                          |
                PROCESS / TOOL ACTUATION
                          |
                 INDEPENDENT OBSERVATION
                          |
                 MODELSELFWITNESS
                          |
              EVIDENCE + STATE COMMIT
                          |
                   SELFGRAPH MEMORY
```

Ruflo is one execution realization within this graph. It is not the graph's root, not the gate, and not the witness.

## 9. Morphology implementation gates

| Gate | Deliverable | Pass condition |
|---|---|---|
| R0 — Baseline pin | Exact source revision and dependency inventory | Reproducible checkout; no floating `latest` in the governed path |
| R1 — Surface map | CLI, MCP, hooks, daemon, agent, swarm, memory, plugin, federation inventory | Every entry classified as read-only, proposal, or actuation |
| R2 — Identity split | Five morphology objects and identifiers | Record, realization, process, session, membership cannot be conflated |
| R3 — Lifecycle adapter | launchd/systemd observe and deterministic-mock transition adapters | No direct constitutional authority in Ruflo |
| R4 — Admission membrane | SELFMOAT request validator | Unauthorized, expired, replayed, out-of-scope requests denied |
| R5 — Effect witness | Independent observation and receipt reconciliation | Attempt and effect are separate; evidence binds to request and process |
| R6 — Recovery continuity | restart, crash, stale session, revocation, replay tests | Recovery re-attests and reconciles; no silent authority inheritance |
| R7 — Controlled realization | One narrowly scoped non-destructive operation | End-to-end proof from request through admitted effect and evidence |

## 10. Immediate implementation posture

Start with a read-only source audit of the pinned Ruflo revision and the existing OURSELF lifecycle contract. Build the morphology and adapter contracts around deterministic mocks. Do not install, initialize, upgrade, or launch Ruflo on the Mac or Pi as part of this architecture breakdown. Do not change launchd/systemd services, credentials, GitHub protected branches, or production infrastructure.

The 3.76.0 upstream release notes describe the opt-in centroid router as an experimental routing enhancement; its reported split-test accuracy is upstream-reported and is not an OURSELF acceptance result. The upstream repository also documents substantial orchestration, memory, plugin, and federation surfaces. Those features should be audited at the pinned commit before adoption, rather than assumed from moving documentation.

## Governing conclusion

**RUFLO ALCHEMY SELF = ORCHESTRATION CAPABILITY TRANSMUTED INTO OURSELF-ADMISSIBLE REALIZATION.**

Ruflo supplies coordination machinery. MODELSELF supplies cognition. launchd/systemd supply process supervision. OURSELFD governs lifecycle. SELFMOAT enforces authority boundaries. MODELSELFWITNESS evaluates effects. SELFGRAPH preserves admitted history.

`NO AUTHORITY → NO EFFECT.`  
`NO OBSERVED EFFECT → NO EFFECT CLAIM.`  
`NO ADMITTED EVIDENCE → NO STATE PROMOTION.`

## Source references

- [Ruflo v3.76.0 release notes](https://github.com/ruvnet/ruflo/releases) — pinned release and opt-in centroid router.
- [Ruflo repository](https://github.com/ruvnet/ruflo) — current upstream architecture and feature surfaces.
- [Ruflo documentation index](https://github.com/ruvnet/ruflo/wiki) — agent, MCP, memory, hooks, worker, and coordination documentation.
- [Ruflo quick start](https://github.com/ruvnet/ruflo/wiki/Quick-Start) — documented initialization, daemon, swarm, agent, and memory workflow.
