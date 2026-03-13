import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { getBedrockClient } from "./novaConfig";

const SYSTEM_PROMPT = `You are an AI assistant that extracts service search information.

Convert the user request into structured JSON.

Return ONLY valid JSON.

Fields:
service
category
keywords`;

/**
 * Extracts structured search parameters from a natural language query using Amazon Nova via AWS Bedrock.
 * @param userQuery The natural language query from the user.
 * @returns Parsed JSON object containing service, category, and keywords.
 */
export const extractSearchParameters = async (userQuery: string) => {
    try {
        const client = getBedrockClient();
        const modelId = process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0";
        
        const command = new ConverseCommand({
            modelId,
            messages: [
                {
                    role: "user",
                    content: [{ text: `User request:\n${userQuery}` }]
                }
            ],
            system: [
                { text: SYSTEM_PROMPT }
            ],
            inferenceConfig: {
                temperature: 0.1, // Low temperature for consistent JSON output
            }
        });

        const response = await client.send(command);
        
        let responseText = "";
        if (response.output && response.output.message && response.output.message.content) {
            responseText = response.output.message.content[0].text || "";
        }

        if (!responseText) {
            throw new Error("No text response from Nova");
        }

        // Clean up markdown json block if present
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const cleanJSON = jsonMatch ? jsonMatch[1] : responseText.trim();
        
        return JSON.parse(cleanJSON);
    } catch (error) {
        console.error("Bedrock Nova AI Error:", error);
        throw error;
    }
};
