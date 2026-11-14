# RUFLO ALCHEMY SELF — R1 Surface Audit and R2 Morphology Contract
**Date:** 2026-11-14  
**Upstream repository:** `ruvnet/ruflo`  
**Pinned commit:** `dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1`  
**Root package:** `claude-flow@3.76.0`  
**OURSELF branch:** `selfgraph/gate/GATE-0002/branch/SELFGRAPH-BRANCH-0002`  
**Scope:** Read-only upstream source inspection; OURSELF design artifact only.

## Executive result

Two milestones were advanced:

- **R1 — Surface map:** inventory pass 1 completed for the major executable, coordination, memory, MCP, hook, security, and plugin surfaces. This is not yet an exhaustive audit of all 10,602 tree entries or all 1,998 CLI package entries.
- **R2 — Morphology contract:** the five OURSELF-native object types, lifecycle states, required relations, and admission rules are now specified as a canonical schema proposal.

No Ruflo code was installed, executed, patched, or launched. No Mac, Raspberry Pi, launchd, systemd, Cloudflare, credential, or production state was changed.

## 1. Reproducible source identity

GitHub's recursive tree endpoint returned commit SHA `dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1` and 10,602 tree entries. Root `package.json` identifies package `claude-flow` version `3.76.0`, ESM, with CLI binary `bin/cli.js`. The CLI package itself is version `3.76.0`.

Important package-level version distinction: the repository root declares a dependency on `@claude-flow/mcp@3.1.6`, while the source workspace package manifest at `v3/@claude-flow/mcp/package.json` identifies version `3.1.7`. This discrepancy must be reconciled against the lockfile and publish/build graph before any package installation or binary claim. Do not assume all package manifests resolve to identical runtime versions.

### Major path counts at the pinned commit

| Source area | Tree entries | Classification |
|---|---:|---|
| `v3/@claude-flow/cli/` | 1,998 | CLI, command surface, agent catalog, router, integrations |
| `v3/@claude-flow/swarm/` | 117 | Agent/task domain, spawn commands, coordination, consensus |
| `v3/@claude-flow/hooks/` | 53 | Event hooks, executor, daemons, workers |
| `v3/@claude-flow/mcp/` | 313 | MCP server, transports, tool registry, sessions |
| `v3/@claude-flow/memory/` | 162 | Agent memory, AgentDB adapters, persistence, retrieval |
| `plugins/` | 3,001 | Plugin ecosystem and integration surface |
| `ruflo/` | 723 | Separate package/bridge surface, including MCP bridge |
| `v3/@claude-flow/security/` | 91 | Security package |
| `v3/@claude-flow/plugin-agent-federation/` | 85 | Federation package |

Counts are path-prefix counts in the recursive Git tree; they overlap only if one prefix is nested under another (the listed prefixes are treated as separate top-level/package roots). They are not counts of executable source files.

## 2. R1 — surface classification

| Surface | Pinned source evidence | R1 classification | OURSELF treatment |
|---|---|---|---|
| Root CLI / package scripts | `package.json`, `v3/@claude-flow/cli/package.json`, `bin/cli.js` | Executable entrypoint, install/postinstall/build/test/publish scripts | Treat CLI as an untrusted command client. Review every invoked command and postinstall path before install. |
| Swarm domain | `swarm/src/domain/entities/agent.ts`, `application/commands/spawn-agent.command.ts` | Agent record, status and task coordination | Proposal/record layer only. Never equate the package's `active` status with OS process existence or OURSELF activation. |
| Spawn command | `spawn-agent.command.ts` | Creates an `Agent`, optionally calls `agent.start()`, persists through repository | The observed method changes an in-memory domain status and saves the entity; this code path does not itself spawn an OS process. It is not a process launcher. |
| Agent entity | `domain/entities/agent.ts` | UUID, role, domain, capabilities, status, parent, metadata, task counters | Source for candidate AgentRecord fields, not a trusted identity or capability grant. |
| MCP server | `mcp/src/server.ts` | Server, tool registry, session manager, task manager, transport, rate limiting | External tool ingress. OURSELF must require identity authentication and a mandatory authorizer at every actuator boundary. |
| MCP tool registry | `mcp/src/tool-registry.ts` | Schema validation, optional authorizer, handler dispatch, execution events | Schema validation is not authorization. Authorizer is optional unless configuration requires it and an authorizer is supplied. OURSELF adapter must make it mandatory and fail closed. |
| HTTP transport | `mcp/src/transport/http.ts` | HTTP, bearer-token gate when enabled, rate limit, CORS, Host/Origin guard when unauthenticated | Transport authentication is separate from OURSELF capability admission. No exposed transport without mandatory authentication. |
| WebSocket transport | `mcp/src/transport/websocket.ts` | WebSocket transport, token/Host/Origin checks, connection management | Same rule: channel admission does not authorize individual operations. |
| Hook registry/executor | `hooks/src/registry/index.ts`, `hooks/src/executor/index.ts` | Event registration, priority ordering, sequential handler execution, timeout/error aggregation | Hook events are triggers/proposals, never authority. Hook side effects require a separate SELFMOAT request. |
| Hook daemons/workers | `hooks/src/daemons/index.ts`, `hooks/src/workers/*` | Background execution and event processing | Runtime surface; lifecycle remains OURSELFD-governed and OS-supervised. |
| Agent memory | `memory/src/agent-memory-scope.ts` | Project/local/user filesystem scopes; path sanitization for agent names | Retrieval/storage only. Namespace isolation is not authority, provenance, or evidence admission. |
| AgentDB lock guard | `memory/src/agentdb-lock-guard.ts` | Local stale-lock inspection and constrained recovery | Useful storage concurrency behavior; not a distributed lock, identity authority, or state-witness mechanism. |
| Federation / claims | `swarm/src/consensus/*`, `claims/*`, `plugin-agent-federation/*` | Peer coordination and federated claims/events | Untrusted inbound peer assertions until identity, freshness, signature, jurisdiction, and local policy admission pass. |
| Ruflo MCP bridge | `ruflo/src/mcp-bridge/index.js`, `mcp-stdio-kernel.js` | Express bridge, child-process MCP backends, tool groups, optional request-signing path | High-risk adapter boundary. Audit backend command construction, tool dispatch, auth middleware, environment inheritance, and token lifecycle before use. |
| Plugin ecosystem | `plugins/*` | Optional and third-party capability surface | Deny by default; each plugin gets explicit version, source, capability manifest, scope, and independent admission. |
| Ruvocal application | `ruflo/src/ruvocal/*` | Separate app and integration surface | Not automatically part of local agent runtime. Treat as an independently deployed application and audit separately. |

### Source-level observations that change the design

1. **Spawn is not process creation.** `SpawnAgentCommandHandler` creates a domain `Agent`, optionally calls its `start()` method, and saves it. `Agent.start()` sets the entity status to `active`; it does not launch an OS process. Therefore `startedAutomatically` means domain-state transition in this code path, not proof of a running process.
2. **Capabilities are descriptive in the Agent aggregate.** The entity stores a set of strings and exposes `hasCapability()`. The inspected path does not establish that those strings are signed grants, bound to a principal, time-limited, or enforced by an independent authority.
3. **MCP tool authorization is optional by configuration.** `MCPServer` throws if `requireToolAuthorization` is true and no authorizer is supplied; `ToolRegistry.execute()` invokes an authorizer only if one exists. This is a critical integration seam: OURSELF must set mandatory authorization and deny on missing/failed authorizer.
4. **Transport controls are useful but not constitutional admission.** HTTP transport includes rate limiting, token authentication when configured, and Host/Origin checks for unauthenticated mode. The server's base defaults do not themselves make every deployment authenticated. A safe loopback transport is still not an OURSELF operation grant.
5. **Hooks are executable callbacks.** Hook handlers run in priority order and can update context metadata, abort processing, or emit events. Their outputs cannot be promoted to authority or state evidence without a separate policy decision.
6. **Memory is filesystem- and backend-oriented.** Agent memory supports project/local/user scopes. This gives useful isolation conventions but does not prove authorship, integrity, temporal standing, or permission to mutate runtime state.
7. **The bridge can start child processes.** The inspected bridge imports `spawn` from `child_process`, creates stdio MCP backend clients, and forwards tool calls. It removes `MCP_AUTH_TOKEN` from child backend environments, which is a positive secret-separation measure. It does not replace the need for a complete per-tool capability boundary.
8. **The bridge has configurable tool groups.** Agents, memory, devtools, security, browser, neural, and provider groups can be enabled/disabled. Group toggles are coarse exposure controls, not per-principal operation authorization.
9. **The bridge kernel's request-signing path is conditional.** The inspected stdio kernel signs requests only when `RVF_KERNEL_SECRET` is configured; the fallback kernel ID/secret behavior must not be mistaken for an authenticated identity. Require explicit secret provisioning, key ownership, rotation, replay controls, and server-side verification before relying on this path.
10. **Security packages do not confer constitutional authority.** Aidefence, URL guards, rate limiting, token checks, and validation reduce particular attack classes. They do not prove the caller is an OURSELF-authorized actor or that a claimed downstream effect occurred.

## 3. R1 disposition matrix

| Category | Disposition | Required condition |
|---|---|---|
| Read-only inventory, status, list, inspect | Candidate ALLOW | Read-only operation allowlist, authenticated identity, scoped output |
| Agent/task creation or coordination | WRAP | Request envelope, SELFMOAT admission, bounded resource/time limits |
| Hooks and workflows | WRAP / QUARANTINE | No authority inherited from event or workflow definition; each side effect separately admitted |
| MCP tools | WRAP | Mandatory tool authorizer; exact tool/version/capability mapping |
| Filesystem, shell, browser, Git, network tools | QUARANTINE pending adapter audit | Explicit path/host/command allowlists, sandbox, bounded inputs, observable effects |
| Memory write/delete/transfer | WRAP | Namespace, provenance, owner, retention, source digest, explicit write authority |
| Federation and claims | QUARANTINE | Peer attestation, signature, nonce/freshness, replay protection, jurisdictional admission |
| Daemons and workers | WRAP | OS supervisor, executable identity, signed config, OURSELFD lifecycle state |
| Plugins | DENY BY DEFAULT | Pin, inspect, SBOM/dependency review, capability manifest, isolated execution |

## 4. R1 open audit items

The pass-1 inventory does not close the entire R1 milestone. Still required before R1 can be marked fully complete:

- enumerate every CLI command and tool registration, mapping handler → underlying effect;
- audit shell/process execution helpers, file read/write/delete paths, browser actions, GitHub tools, and provider-key propagation;
- inspect every plugin manifest and executable entrypoint; classify the 3,001 plugin tree entries;
- inspect federation trust, signing, nonce, peer authorization, and replay behavior end-to-end;
- reconcile root/workspace/lockfile versions and build/publish outputs;
- inspect postinstall and package lifecycle scripts;
- map actual process supervision and daemon restart paths separately from agent-domain status.

No source changes are authorized or implied by this report.

## 5. R2 — canonical OURSELF morphology contract

The five objects are independent records with stable IDs and explicit foreign-key relations. The following is the proposed OURSELF schema, not a claim that Ruflo already implements it.

### 5.1 AGENT_RECORD

Represents a durable conceptual agent identity.

Required fields:
- `agent_id`: OURSELF-issued immutable identifier;
- `identity_version`: schema/identity version;
- `display_name`, `role`, `domain`;
- `declared_capabilities[]`: descriptive only; never grants;
- `owner_identity`: accountable principal;
- `created_at`, `record_digest`;
- `status`: `DRAFT | IDENTIFIED | ATTESTED | RETIRED`.

Constraints:
- ID is not proof of identity.
- Role/domain/declared capabilities are claims.
- No runtime secret or provider credential is stored in this record.

### 5.2 EXECUTION_REALIZATION

Describes a realizable cognitive/toolchain configuration.

Required fields:
- `realization_id`, `agent_id`;
- `provider_id`, `model_id`, `model_version`;
- `ruflo_commit_sha`, `package_lock_digest`;
- `toolchain_digest`, `adapter_set_digest`;
- `policy_profile_id`, `capability_profile_id`;
- `runtime_target`, `created_at`, `realization_digest`;
- `status`: `PROPOSED | VALIDATED | ADMITTED | REVOKED | RETIRED`.

Constraints:
- Model/provider identity is not agent authority.
- A validated realization is not an activated process.
- Any change to source revision, dependencies, tools, or model configuration creates a new realization version/digest.

### 5.3 PROCESS_INSTANCE

Represents an independently observed operating-system process.

Required fields:
- `process_instance_id`, `realization_id`, `agent_id`;
- `host_identity_id`, `host_attestation_ref`;
- `pid`, `pid_namespace` (where applicable), `process_start_time`;
- `executable_path`, `executable_digest`, `argv_digest`;
- `service_manager` (`launchd | systemd | container | direct | other`);
- `service_unit_id`, `parent_process_id`;
- `observed_at`, `observer_identity`, `observation_digest`;
- `status`: `DECLARED | OBSERVED | ATTESTED | RUNNING | EXITED | UNKNOWN | REVOKED`.

Constraints:
- PID alone is not identity; PID reuse is possible.
- `RUNNING` requires fresh host-side observation and process binding.
- A process cannot self-attest its own executable digest or host authority.
- Process observation does not authorize tools or operations.

### 5.4 EXECUTION_SESSION

Represents one bounded work interval.

Required fields:
- `session_id`, `agent_id`, `realization_id`, `process_instance_id`;
- `requester_identity`, `jurisdiction`;
- `admitted_capabilities[]`, `scope`, `constraints`;
- `issued_at`, `expires_at`, `nonce`;
- `authorization_ref`, `policy_version`;
- `status`: `REQUESTED | ADMITTED | ACTIVE | SUSPENDED | EXPIRED | REVOKED | CLOSED`;
- `close_reason`, `session_digest`.

Constraints:
- Sessions are short-lived and non-transferable by default.
- Reconnect/restart requires reconciliation and fresh admission.
- Expiry/revocation invalidates outstanding requests and derived actuation tokens.

### 5.5 AGENT_MEMBERSHIP

Represents a governed relation between an agent and an execution context.

Required fields:
- `membership_id`, `agent_id`;
- `container_identity` (swarm/project/host/jurisdiction);
- `membership_role`;
- `granted_by`, `authorization_ref`;
- `scope`, `issued_at`, `expires_at`;
- `status`: `PROPOSED | ADMITTED | SUSPENDED | REVOKED | EXPIRED`;
- `membership_digest`.

Constraints:
- Swarm registration is not OURSELF membership.
- Peer consensus cannot create local membership authority.
- Membership never implies unrestricted capability inheritance.

## 6. Relationship constraints

- Every `EXECUTION_REALIZATION.agent_id` references one `AGENT_RECORD.agent_id`.
- Every `PROCESS_INSTANCE.realization_id` references one admitted realization.
- Every `EXECUTION_SESSION` binds exactly one agent, realization, and observed process instance.
- Every admitted session references a current authorization and policy version.
- Every `AGENT_MEMBERSHIP` is separately admitted and scoped.
- No object is promoted by copying a status string from Ruflo.
- Revocation cascades to dependent sessions and outstanding requests, but does not erase historical receipts.
- All timestamps are UTC RFC 3339; all digests use a specified canonical serialization and cryptographic hash.
- Sensitive credentials are held in a secret manager and referenced by opaque secret handles; never stored in the morphology records.

## 7. Lifecycle transition contract

`AGENT_RECORD: DRAFT → IDENTIFIED → ATTESTED`

`EXECUTION_REALIZATION: PROPOSED → VALIDATED → ADMITTED`

`PROCESS_INSTANCE: DECLARED → OBSERVED → ATTESTED → RUNNING`

`EXECUTION_SESSION: REQUESTED → ADMITTED → ACTIVE → CLOSED | EXPIRED | REVOKED`

`AGENT_MEMBERSHIP: PROPOSED → ADMITTED → SUSPENDED | REVOKED | EXPIRED`

Every transition requires a typed event with:
`transition_id`, `subject_id`, `pre_state`, `requested_state`, `actor_identity`, `authority_ref`, `policy_version`, `issued_at`, `expires_at`, `nonce`, `payload_digest`, `execution_ref`, `observation_ref`, `witness_ref`, `decision`.

The system must preserve the difference between:
`REQUESTED → ADMITTED → ATTEMPTED → EFFECT_OBSERVED → EVIDENCE_ADMITTED → STATE_COMMITTED`.

A failed or missing observation leaves the effect unproven and prevents state promotion.

## 8. R2 mapping from Ruflo

| Ruflo source object | OURSELF destination | Mapping rule |
|---|---|---|
| Swarm `Agent` aggregate | `AGENT_RECORD` proposal | Copy descriptive fields only; reissue OURSELF identity |
| Agent role/domain/capabilities | Declared attributes | Never import as grants |
| `Agent.start()` / status=active | Candidate lifecycle event | Not process observation; cannot set PROCESS_INSTANCE=RUNNING |
| Spawn command result | Realization request / record receipt | Does not create process instance |
| MCP session | External transport session | Not OURSELF EXECUTION_SESSION without binding and admission |
| Hook event/context | Transition proposal | No authority inheritance |
| Memory namespace | Retrieval namespace | Provenance metadata required; no state promotion |
| Federation claim | Peer assertion | Must pass local peer and claim admission |
| Daemon status | Process observation candidate | Reconcile with host-side process and service-manager evidence |

## 9. Gate outcomes

| Milestone | Result | Evidence |
|---|---|---|
| R1 — Surface map | **PASS 1 COMPLETE / FULL AUDIT OPEN** | Pinned tree SHA, 10,602 entries, package counts, selected source-level inspections and classification |
| R2 — Morphology contract | **DESIGN COMPLETE / IMPLEMENTATION NOT STARTED** | Five record schemas, relations, transition and admission invariants |
| R3 — Lifecycle adapter | NOT STARTED | No runtime mutation or adapter implementation |
| R4 — SELFMOAT validator | NOT STARTED | No validator implementation |
| R5 — Independent witness | NOT STARTED | No effect witness integration |
| R6 — Recovery | NOT STARTED | No restart/revocation/replay tests |
| R7 — Controlled realization | NOT STARTED | No actuator operation performed |

## 10. Pinned source references

All links below point to the exact audited commit, not the default branch:

- [Root package manifest](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/package.json)
- [CLI package manifest](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/cli/package.json)
- [Swarm Agent entity](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/swarm/src/domain/entities/agent.ts)
- [Spawn Agent command](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/swarm/src/application/commands/spawn-agent.command.ts)
- [MCP server](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/mcp/src/server.ts)
- [MCP tool registry](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/mcp/src/tool-registry.ts)
- [MCP transport guard](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/mcp/src/transport/guard.ts)
- [MCP HTTP transport](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/mcp/src/transport/http.ts)
- [Hooks executor](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/hooks/src/executor/index.ts)
- [Agent memory scope](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/memory/src/agent-memory-scope.ts)
- [AgentDB lock guard](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/v3/@claude-flow/memory/src/agentdb-lock-guard.ts)
- [Ruflo MCP bridge](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/ruflo/src/mcp-bridge/index.js)
- [Bridge stdio kernel](https://github.com/ruvnet/ruflo/blob/dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1/ruflo/src/mcp-bridge/mcp-stdio-kernel.js)

## Governing conclusion

Ruflo's source contains useful coordination and security mechanisms, but its agent aggregate, MCP session, hook event, memory scope, daemon, and federation records do not by themselves satisfy OURSELF identity, authority, process attestation, or evidence admission.

**R1 identifies the surfaces and the trust seams. R2 defines the OURSELF-native morphology that Ruflo must map into.**

`AGENT STATUS ≠ PROCESS EXISTENCE.`  
`DECLARED CAPABILITY ≠ AUTHORIZED CAPABILITY.`  
`MCP SESSION ≠ OURSELF SESSION.`  
`HOOK EVENT ≠ AUTHORITY.`  
`EXECUTOR RECEIPT ≠ OBSERVED EFFECT.`
