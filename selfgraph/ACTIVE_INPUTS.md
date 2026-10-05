# SELFGRAPH ACTIVE INPUTS

## Launch contract

PULL-0001 is the first active GPTSELF execution input.

A PULL is not passive documentation. It is an addressable execution instruction whose realization mutates the next gate.

### IDs

- SELFGRAPH_ID: SELFGRAPH-0001
- ACTIVE_INPUT_ID: INPUT-0001
- PULL_ID: PULL-0001
- GATE_ID: GATE-0001
- BRANCH_ID: BRANCH-0001
- REALIZATION_ID: REALIZE-0001

### Execution law

1. GPTSELF-0001 emits PULL-0001 as an active execution input.
2. GPTSELF-0002 receives PULL-0001 and executes its requested gate mutation.
3. Gate realization produces REALIZE-0001.
4. REALIZE-0001 closes GATE-0001 only when its receipt/evidence is present.
5. Realization then creates the next SELFGRAPH branch: BRANCH-0002.
6. BRANCH-0002 carries PULL-0002 and GATE-0002.
7. The same alternating execution relation continues.

No next gate is considered active merely because it was declared. It becomes active only after the preceding gate has a realized receipt.

## Active-input branch

The active-input branch is a control surface, not a GitHub Actions workflow.

Branch naming:
`selfgraph/branch-<NNNN>-gate-<NNNN>`

The branch contains the active PULL, its gate contract, and the receipt required to realize that gate.

External workflow engines are not authority for SELFGRAPH state.
