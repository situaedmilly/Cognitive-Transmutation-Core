import { AetherReceiver } from '../src/receiver.mjs';
import fs from 'fs/promises';
import path from 'path';

async function runProof() {
    const contract = {}; // Simplified for harness
    const receiver = new AetherReceiver(contract);

    console.log('--- TEST 1: Unresolved Preimage (Should Fail) ---');
    try {
        await receiver.processIngress(Buffer.from('not json'));
    } catch (e) {
        console.log('Caught expected error:', e.message);
    }

    console.log('\n--- TEST 2: Unauthorized Identity (Should Fail) ---');
    try {
        const badInput = JSON.stringify({
            authority_ref: 'HACKER',
            action_id: 'TNC_BOOT_001',
            payload: 'malicious'
        });
        await receiver.processIngress(Buffer.from(badInput));
    } catch (e) {
        console.log('Caught expected error:', e.message);
    }

    console.log('\n--- TEST 3: Admitted Transition (Should Succeed) ---');
    try {
        const goodInput = JSON.stringify({
            authority_ref: 'ALCHEMY_ROOT',
            action_id: 'TNC_BOOT_001',
            payload: 'ACTIVATE_Sovereign_Estate'
        });
        const receipt = await receiver.processIngress(Buffer.from(goodInput));
        console.log('SUCCESS: Durable Receipt Generated:');
        console.log(JSON.stringify(receipt, null, 2));
        
        // Save receipt to disk as evidence
        await fs.writeFile(
            path.join('/Users/millysituated/Cognitive-Transmutation-Core', 'alchemy/aethernet/harness/receipts/PROOF-001.json'),
            JSON.stringify(receipt, null, 2)
        );
    } catch (e) {
        console.error('Unexpected failure:', e);
    }
}

runProof();
