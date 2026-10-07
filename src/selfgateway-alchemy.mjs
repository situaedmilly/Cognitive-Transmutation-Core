import { createHash } from "node:crypto";

export function transmuteSelfGatewayReceipt(receipt) {
  if (receipt?.status !== "RECORDED") throw new Error("Only recorded gateway receipts may enter alchemy");
  const signal = {
    kind:"SELF_GATEWAY_ALCHEMY",
    gateway:receipt.result.gateway,
    network:receipt.result.network,
    authority:receipt.result.authority,
    receipt:{
      status:receipt.status,
      effect_hash:receipt.effect_hash,
      semantic_hash:"sha256:"+createHash("sha256").update(JSON.stringify({gateway:receipt.result.gateway,network:receipt.result.network}),"utf8").digest("hex")
    }
  };
  return Object.freeze(signal);
}
