# RAWMACSCRIPTS Thought Branch

This branch contains literal execution scripts intended for the OURSELF RawMac substrate.

## Contract

- Every script is byte-for-byte executable input.
- No prose, commentary, markdown fences, prompts, or explanatory text may be embedded in an execution script.
- Machine execution content is stored exactly as it is intended to be pasted or executed on RawMac.
- Human-facing explanation belongs outside the script artifact.
- Script filenames use explicit sequence and purpose.
- A script MUST declare its target substrate, working directory, required preconditions, and post-execution witness when those are necessary to execute safely.
- Scripts MUST NOT silently mutate unrelated files, repositories, services, model configuration, credentials, or network state.
- Destructive or irreversible operations require an explicit guard in the script.
- Secrets MUST NOT be embedded in scripts.
- A script is an execution input, not an execution receipt. Successful storage or GitHub commit does not establish that RawMac executed it.

## Layout

`scripts/` contains literal RawMac execution scripts.

`manifests/` contains machine-readable metadata describing script identity, target, preconditions, and expected witness.

`receipts/` is reserved for execution evidence returned by the RawMac substrate. A stored script is never treated as a receipt.

## Byte Contract

The canonical script payload is the exact UTF-8 file content between byte offset 0 and EOF.

Do not normalize line endings, trim whitespace, reformat commands, or prepend shell headers after authoring unless the script artifact itself explicitly contains them.

## Jurisdiction

`thought/rawmacscripts` is an execution-input thought branch. It does not grant execution authority.

Execution authority remains governed by the active OURSELF admission and SELFSHIFT controls.
