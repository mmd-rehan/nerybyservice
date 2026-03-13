import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getBedrockClient } from "./novaConfig";

/**
 * Uses Amazon Nova Audio capabilities to transcribe speech to text.
 * @param audioBuffer Buffer of the audio
 * @param mimeType Mime type of the audio (e.g., 'audio/webm' or 'audio/mp3')
 * @returns Transcribed text string
 */
export const transcribeAudio = async (audioBuffer: Buffer, mimeType: string): Promise<string> => {
    try {
        const client = getBedrockClient();
        const modelId = process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";
        
        // Naive extraction of format from mime/type
        let format = mimeType.split('/')[1] || "mp3";
        // Handle variations (e.g. audio/webm;codecs=opus)
        if (format.includes('webm')) format = 'webm';
        else if (format.includes('mp4')) format = 'mp4';
        else if (format.includes('wav')) format = 'wav';
        else if (!['mp3', 'wav', 'flac', 'ogg', 'webm'].includes(format)) {
            format = 'mp3'; // safe fallback
        }

        const command = new ConverseCommand({
            modelId,
            messages: [
                {
                    role: "user",
                    content: [
                        { text: "Accurately transcribe the spoken audio into text. Only return the transcription, nothing else." },
                        // In AWS SDK v3 Bedrock, audio is generally passed inside document block for Nova multimodal.
                        // We use `any` casting to satisfy the TypeScript compiler if types are outdated.
                        {
                            document: {
                                name: "audio",
                                format: format as any,
                                source: {
                                    bytes: new Uint8Array(audioBuffer)
                                }
                            }
                        }
                    ]
                }
            ],
            inferenceConfig: {
                temperature: 0.1,
            }
        });

        const response = await client.send(command);
        
        let responseText = "";
        if (response.output && response.output.message && response.output.message.content) {
            responseText = response.output.message.content[0].text || "";
        }

        if (!responseText) {
            throw new Error("No voice transcription response from Nova");
        }

        return responseText.trim();
    } catch (error) {
        console.error("Bedrock Nova Voice AI Error:", error);
        throw error;
    }
};
