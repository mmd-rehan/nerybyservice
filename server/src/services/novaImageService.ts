import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getBedrockClient } from "./novaConfig";

/**
 * Uses Amazon Nova Multimodal capabilities to analyze an image to detect the service requirement.
 * @param imageBuffer Buffer of the image
 * @param mimeType Mime type of the image (e.g., 'image/jpeg')
 * @returns A problem description string
 */
export const analyzeImage = async (imageBuffer: Buffer, mimeType: string): Promise<string> => {
    try {
        const client = getBedrockClient();
        const modelId = process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";
        
        let format = mimeType.split('/')[1] || "jpeg";
        // Bedrock accepts jpeg, png, webp, gif
        if (!['jpeg', 'png', 'webp', 'gif'].includes(format)) {
            format = 'jpeg'; // fallback
        }

        const command = new ConverseCommand({
            modelId,
            messages: [
                {
                    role: "user",
                    content: [
                        { text: "Describe the problem or service needed shown in this image in one short sentence. For example: 'leaking pipe under kitchen sink' or 'broken air conditioner'." },
                        {
                            image: {
                                format: format as any,
                                source: {
                                    bytes: new Uint8Array(imageBuffer)
                                }
                            }
                        }
                    ]
                }
            ],
            inferenceConfig: {
                temperature: 0.3,
            }
        });

        const response = await client.send(command);
        
        let responseText = "";
        if (response.output && response.output.message && response.output.message.content) {
            responseText = response.output.message.content[0].text || "";
        }

        if (!responseText) {
            throw new Error("No image analysis response from Nova");
        }

        return responseText.replace(/['"]/g, '').trim();
    } catch (error) {
        console.error("Bedrock Nova Image AI Error:", error);
        throw error;
    }
};
