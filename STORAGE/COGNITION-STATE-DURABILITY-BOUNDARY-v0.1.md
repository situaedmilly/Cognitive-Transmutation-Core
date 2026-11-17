# Cognition State Durability Boundary v0.1

Cognitive-Transmutation-Core is a cognition and transformation runtime. Model context, inference cache, embeddings in process memory, temporary scratch, and agent-local state are volatile or derived by default.

## State classes

- INFERENCE_CONTEXT: volatile; D0 only.
- MODEL_CACHE: disposable cache; D0 only.
- TRANSFORMATION_PROPOSAL: immutable candidate artifact; may be enveloped by DATASELF.
- EXECUTION_RECEIPT: operational evidence; canonical retention requires a DATASELF envelope and journal event.
- ADMITTED_MEMORY: DATASELF-backed exact bytes with resolved authority and lineage.

The cognition runtime never becomes storage authority. It may request a read or propose a write through OURPROCESSORSELF. It cannot self-admit the adapter, authorize its own write, or infer persistence from model output.

Every transformation that needs continuity must bind source content keys, transformation identity/version, exact output bytes, processor receipt, and later recontact evidence.
