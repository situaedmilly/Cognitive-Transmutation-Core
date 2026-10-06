# ALCHEMYSELFRVER01 // Genesis Model Runtime

## Purpose

ALCHEMYSELFRVER01 is the first separated MODELSELF/GENESIS endpoint in the OURSELF ecosystem.

The design removes the large GGUF artifact from OURSELFMAC while preserving a local OURSELF authority boundary around model access.

## Jurisdiction

- **Cognitive doctrine:** Cognitive-Transmutation-Core / SELFTHOUGHTS / SELFBRAIN
- **Execution:** FLOWACTIONSELFWORK
- **Addressability:** SELFVEREIGN-ADDRESSELF
- **Genesis infrastructure:** ourself-cloud-server-network
- **Registry/memory pointer:** ALTONUMBUSELF

## Runtime topology

```
OURSELFMAC
  |
  | authenticated model request
  v
MODELSELF / ALCHEMYSELFRVER01
  |
  v
llama-server
  |
  v
verified GGUF artifact
```

The GGUF is implementation matter. The addressable object is the MODELSELF endpoint.

## Required runtime evidence

A Genesis boot is not considered realized until all of these are present:

1. Docker engine is reachable.
2. The configured GGUF exists on host storage.
3. SHA-256 of the artifact is recorded.
4. `ghcr.io/ggml-org/llama.cpp:server` starts.
5. `GET /health` returns HTTP 200.
6. `GET /v1/models` identifies the expected model.
7. One OpenAI-compatible chat completion succeeds.
8. The execution runtime emits a receipt containing instance, container, model hash, endpoint, and timestamps.
9. OURSELFMAC can address the endpoint without retaining the GGUF locally.

## Authority law

`MODEL_OUTPUT != OS_EFFECT`

`RECEIPT != EFFECT`

`OBSERVATION != AUTHORITY`

Genesis provides inference substrate. OURSELF remains the authority boundary.

## Security boundary

The initial Genesis endpoint MUST bind privately. Do not publish it to the public Internet merely to make it reachable.

The model directory is mounted read-only into the container. Model artifacts and secrets are not committed to Git.

## Runtime state

The runtime must distinguish:

- DECLARED
- AUTHORIZED
- BOOTING
- BOOTED
- READY
- EXECUTED
- VERIFIED
- STOPPED
- FAILED

A repository commit establishes declared implementation. Only host execution can establish BOOTED/READY/EXECUTED.

