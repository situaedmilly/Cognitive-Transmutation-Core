import test from "node:test";
import assert from "node:assert/strict";
import { transmuteSelfGatewayReceipt } from "../src/selfgateway-alchemy.mjs";
test("gateway alchemy refuses unrecorded input",()=>{assert.throws(()=>transmuteSelfGatewayReceipt({status:"PENDING"}));});
test("gateway alchemy emits a non-authoritative cognitive signal",()=>{
  const signal=transmuteSelfGatewayReceipt({status:"RECORDED",effect_hash:"sha256:test",result:{
    gateway:{model_name:"HB5GGW_TMO-G4AR",model_number:"JT737656C",firmware_version:"1.00.18"},
    network:{wan_address:null,address_family:null,nat_state:"UNKNOWN",inbound_reachability:"UNPROVEN"},
    authority:{status:"NONE"}
  }});
  assert.equal(signal.kind,"SELF_GATEWAY_ALCHEMY"); assert.equal(signal.authority.status,"NONE");
});
