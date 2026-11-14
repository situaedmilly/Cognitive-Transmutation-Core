Philosopher Milly — R1 and R2 have been advanced against the pinned Ruflo source revision, not the moving default branch.

# R1 — Source surface audit

<badge color="success">Inventory pass 1 complete</badge>

- Upstream: `ruvnet/ruflo`
- Commit: `dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1`
- Root package: `claude-flow@3.76.0`
- Recursive Git tree: **10,602 entries**

This is a multi-package system, not one agent runner. Major tree areas include CLI (1,998 entries), plugins (3,001), Ruflo bridge/application (723), MCP (313), memory (162), swarm (117), security (91), federation package (85), and hooks (53).

## Source findings

1. **Agent spawn is not OS process creation.** The inspected `SpawnAgentCommandHandler` creates a domain `Agent`, optionally calls `agent.start()`, and persists it. `Agent.start()` only changes the entity status to `active`. No OS process is launched in that code path.
2. **Agent capabilities are descriptive strings.** The aggregate stores capability names and exposes `hasCapability()`; this is not a signed, scoped, expiring OURSELF grant.
3. **MCP authorization is optional unless configured as required.** The server only rejects missing authorizers when `requireToolAuthorization` is true. The tool registry invokes an authorizer only when one is present. OURSELF must make authorization mandatory and fail closed.
4. **Transport security is not operation authority.** HTTP/WebSocket include token and Host/Origin protections, but transport admission does not grant a tool capability.
5. **Hooks execute callbacks.** Priority ordering, event context, metadata mutation, aborts, and error handling are runtime mechanisms—not authority.
6. **Memory scopes are not provenance.** Project/local/user memory directories and AgentDB controls do not prove authorship or evidence admission.
7. **The MCP bridge starts backend child processes.** The bridge removes its bearer token from backend child environments, which is a useful secret-separation measure. Backend process startup and tool dispatch still need explicit capability boundaries.
8. **Federation and plugins are independent trust surfaces.** Claims, peer messages, and plugins must remain quarantined until identity, source, freshness, jurisdiction, scope, and policy are admitted.
9. **Kernel signing is conditional.** The inspected bridge kernel only signs when `RVF_KERNEL_SECRET` is configured. An auto-generated fallback identity is not a provisioned trust root.
10. **Package versions need reconciliation.** Root manifest references `@claude-flow/mcp@3.1.6`, while the workspace manifest says `3.1.7`. Resolve this against the lockfile and publish graph before installation.

R1 is **not fully closed**: exhaustive CLI command/handler mapping, all plugin entrypoints, shell/filesystem/browser/Git tool review, federation trust audit, lifecycle scripts, and package-lock reconciliation remain open. No unsafe source has been executed.

# R2 — OURSELF morphology contract

<badge color="success">Design contract complete</badge>

Five separate records are now specified:

| Object | Purpose | Key identity |
|---|---|---|
| `AGENT_RECORD` | Durable conceptual agent | `agent_id` |
| `EXECUTION_REALIZATION` | Model, source, toolchain, adapter configuration | `realization_id` |
| `PROCESS_INSTANCE` | Independently observed OS process | `process_instance_id` |
| `EXECUTION_SESSION` | Bounded work interval | `session_id` |
| `AGENT_MEMBERSHIP` | Admitted relation to swarm/project/host/jurisdiction | `membership_id` |

The contract specifies immutable OURSELF-issued IDs; source and dependency digests; host and executable attestation; process start time and PID namespace; requester, jurisdiction, capability, scope, expiry and nonce; authorization and policy references; and explicit status machines.

Core relationship rules:
- A process instance must reference an admitted realization.
- A session binds one agent, realization, and observed process instance.
- Membership is separately admitted; swarm registration is not membership authority.
- Capability declarations never become grants merely by being copied from Ruflo.
- Restart requires re-attestation and reconciliation; stale sessions cannot inherit authority.
- Revocation invalidates dependent sessions and outstanding requests without erasing historical receipts.

Lifecycle is split into independent transitions:

`AGENT_RECORD: DRAFT → IDENTIFIED → ATTESTED`

`EXECUTION_REALIZATION: PROPOSED → VALIDATED → ADMITTED`

`PROCESS_INSTANCE: DECLARED → OBSERVED → ATTESTED → RUNNING`

`EXECUTION_SESSION: REQUESTED → ADMITTED → ACTIVE → CLOSED | EXPIRED | REVOKED`

`AGENT_MEMBERSHIP: PROPOSED → ADMITTED → SUSPENDED | REVOKED | EXPIRED`

# Gate status

| Milestone | Status |
|---|---|
| R1 surface map | Inventory pass 1 complete; full audit open |
| R2 morphology | Design complete; implementation not started |
| R3 lifecycle adapter | Not started |
| R4 SELFMOAT validator | Not started |
| R5 independent witness | Not started |
| R6 recovery tests | Not started |
| R7 controlled realization | Not started |

# SELFTHOUGHTS capture

The full source audit and morphology contract are recorded at:

`SELFTHOUGHTS/RUFLO-R1-R2-SURFACE-AUDIT-MORPHOLOGY-2026-11-14.md`

This turn is also recorded as `SELFTHOUGHT-0005` in the sequential index. The audit file was read back from GitHub and its blob SHA is `6bb503107035a5a41e615a67c7476f8335a0aa0f`.

# Execution boundary

This work inspected public source and wrote documentation to the existing SELFTHOUGHTS branch. It did not install Ruflo, run a Ruflo process, change a Mac or Pi service, modify production infrastructure, or implement an actuator.

**R1 identifies the trust seams. R2 defines the native morphology. Next is R1 closure on executable command surfaces, followed by R3's deterministic-mock lifecycle adapter.**

`AGENT STATUS ≠ PROCESS EXISTENCE.`
`DECLARED CAPABILITY ≠ AUTHORIZED CAPABILITY.`
`MCP SESSION ≠ OURSELF SESSION.`
`HOOK EVENT ≠ AUTHORITY.`
`EXECUTOR RECEIPT ≠ OBSERVED EFFECT.`
