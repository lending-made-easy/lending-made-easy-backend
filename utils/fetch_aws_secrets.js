import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: "ap-south-1",
});

const fetch_aws_secrets = async (secret_name) => {
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
  } catch (error) {
    throw error;
  }
  const secret = JSON.parse(response.SecretString);
  return secret;
};

export default fetch_aws_secrets;
