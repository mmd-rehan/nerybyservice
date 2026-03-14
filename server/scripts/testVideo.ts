import fs from 'fs';
import { processVideo } from '../src/services/novaVideoService';

async function test() {
    console.log("Starting test");
    const buffer = await fs.promises.readFile('../client/public/test.mp4').catch(e => {
        console.log("Please place a test.mp4 file in client/public to test");
        return Buffer.from("");
    });
    // This is just to test the compilation of processVideo FFMPEG functions 
    // without triggering actual BEDROCK credits if we fail fast.
}
test();
