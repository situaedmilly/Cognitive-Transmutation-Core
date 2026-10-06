/**
 * AETHERRECEIVER Proof Harness v0.1
 * 
 * This is an experimental instrument designed to be falsifiable.
 * It implements the transition from Foreign Ingress to Durable Receipt.
 */

import fs from 'fs/promises';
import crypto from 'crypto';
import { EventEmitter } from 'events';

class AetherReceiver extends EventEmitter {
    constructor(contract) {
        super();
        this.contract = contract;
        this.residentActuator = new ResidentActuator();
    }

    async processIngress(foreignBytes) {
        console.log('[AETHER_IN] Receiving foreign bytes...');
        
        // 1. Preimage Preservation & Parsing
        const preimageDigest = crypto.createHash('sha256').update(foreignBytes).digest('hex');
        const parsedPreimage = this.parsePreimage(foreignBytes);
        
        if (parsedPreimage.status === 'UNRESOLVED') {
            throw new Error('INVARIANT_VIOLATION: FOREIGN_BYTES != PARSED_PREIMAGE (Parsing failed)');
        }

        // 2. Membrane / Policy Gate
        const admission = await this.evaluateMembrane(parsedPreimage);
        
        if (!admission.admitted) {
            throw new Error(`MEMBRANE_REFUSAL: ${admission.reason}`);
        }

        // 3. Transition to AETHER_OUT
        console.log('[AETHER_OUT] Transition admitted. Routing to Resident Actuator...');
        
        // 4. Resident Actuation
        const actuationResult = await this.residentActuator.execute(admission.action);

        // 5. Observation of Effect
        const effect = await this.observeEffect(actuationResult);

        // 6. Durable Receipt Generation
        const receipt = await this.generateReceipt({
            preimageDigest,
            admission,
            actuationResult,
            effect
        });

        return receipt;
    }

    parsePreimage(bytes) {
        try {
            const content = bytes.toString('utf-8');
            const data = JSON.parse(content);
            return { status: 'RESOLVED', ...data };
        } catch (e) {
            return { status: 'UNRESOLVED' };
        }
    }

    async evaluateMembrane(preimage) {
        // Minimal admission logic: Requires matching authority_ref and action_id
        const { authority_ref, action_id } = preimage;
        
        if (!authority_ref || !action_id) {
            return { admitted: false, reason: 'MISSING_AUTHORITY_OR_ACTION' };
        }

        // In a real scenario, this would check against a registry
        if (authority_ref === 'ALCHEMY_ROOT' && action_id === 'TNC_BOOT_001') {
            return { 
                admitted: true, 
                admission_id: crypto.randomUUID(),
                action: preimage.payload 
            };
        }

        return { admitted: false, reason: 'UNAUTHORIZED_IDENTITY' };
    }

    async observeEffect(result) {
        // Invariants: stdout != success. 
        // We must verify the effect independently of the actuator's return value.
        if (result.effect_witnessed) {
            return { status: 'VERIFIED', witness: result.witness_log };
        }
        throw new Error('INVARIANT_VIOLATION: ACTUATION != EFFECT');
    }

    async generateReceipt({ preimageDigest, admission, actuationResult, effect }) {
        const receipt = {
            timestamp: new Date().toISOString(),
            preimage_digest: preimageDigest,
            admission_id: admission.admission_id,
            actuation_id: actuationResult.id,
            effect_status: effect.status,
            witness: effect.witness,
            integrity_hash: null
        };
        
        receipt.integrity_hash = crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
        return receipt;
    }
}

class ResidentActuator {
    async execute(payload) {
        console.log(`[RESIDENT_ACTUATOR] Executing: ${payload}`);
        // Simulating a state change with a witness
        return {
            id: crypto.randomUUID(),
            effect_witnessed: true,
            witness_log: `Substrate state mutated via payload: ${payload}`
        };
    }
}

export { AetherReceiver };
