"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input = {
    modelId: "amazon.nova-lite-v1:0",
    messages: [
        {
            role: "user",
            content: [
                {
                    document: {
                        name: "test",
                        format: "mp3",
                        source: { bytes: new Uint8Array() }
                    }
                }
            ]
        }
    ]
};
