import { S3Client } from "@aws-sdk/client-s3";
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { LambdaClient } from "@aws-sdk/client-lambda";

const credentials = {
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY!,
};

const region = "us-east-1";

export const s3 = new S3Client({
  region,
  credentials,
});

export const bedrock = new BedrockRuntimeClient({
  region,
  credentials,
});

export const lambda = new LambdaClient({
  region,
  credentials,
});
