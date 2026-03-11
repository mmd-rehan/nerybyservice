import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

// Validate AWS configuration
const getBedrockClient = () => {
    // Make sure we have credentials or are running in an environment with IAM roles
    // If not, explicitly provide credentials only if defined in env
    const region = process.env.AWS_REGION || "us-east-1";
    
    let config: any = { region };
    
    if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
        config.credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        };
    } else {
        console.error("Using IAM role or default credentials");
    }
    
    return new BedrockRuntimeClient(config);
};

const SYSTEM_PROMPT = `
You are an AI assistant for a hyper-local service discovery platform.

Your task is to convert a natural language user request into structured search data for finding nearby services.

Return ONLY valid JSON.

The JSON schema must be:

{
  "serviceTitle": "string",
  "category": "string",
  "keywords": ["string"]
}

Field definitions:

serviceTitle:
A short human-readable name of the service the user needs.
Examples:
"plumber"
"AC repair"
"electrician"
"math tutor"
"car mechanic"

category:
The broader service category.

Use one of these common categories when possible:

home repair
automotive
education
cleaning
health
beauty
moving
technology
other

keywords:
Important search terms related to the problem or task.

Rules:

- Return ONLY JSON.
- Do NOT include explanations or text outside JSON.
- Always include all fields.
- serviceTitle should be short (2-4 words).
- keywords should help match serviceTitle or description in search.

Examples:

User request:
"My sink is leaking"

Output:
{
  "serviceTitle": "plumber",
  "category": "home repair",
  "keywords": ["sink", "leak", "pipe", "water"]
}

User request:
"Need someone to fix my AC"

Output:
{
  "serviceTitle": "AC repair",
  "category": "home repair",
  "keywords": ["ac", "air conditioner", "cooling", "hvac"]
}

User request:
"Looking for a math tutor for my son"

Output:
{
  "serviceTitle": "math tutor",
  "category": "education",
  "keywords": ["math", "tutor", "student", "teaching"]
}
`;

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
