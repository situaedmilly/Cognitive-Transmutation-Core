import test from "node:test";
import assert from "node:assert/strict";
import { bootProtocolSelfRegistry } from "../src/protocolself-registry.mjs";
test("Cognitive Transmutation Core boots the pinned 18-protocol registry without activating transport",()=>{const r=bootProtocolSelfRegistry();assert.equal(r.protocol_count,18);assert.equal(r.status,"REGISTRY_BOOTED_LISTENERS_DISABLED");assert.equal(r.network_listeners_started,0);assert.equal(r.external_bindings_created,0);assert.equal(r.network_transport_authority,"NOT_GRANTED");});
