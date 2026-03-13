import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

export const getBedrockClient = () => {
    const region = process.env.AWS_REGION || "us-east-1";
    
    let config: any = { region };
    
    if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY) {
        config.credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        };
    } else {
        console.log("Using IAM role or default credentials for Bedrock");
    }
    
    return new BedrockRuntimeClient(config);
};
