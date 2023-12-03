import "dotenv/config";
import fetch_aws_secrets from "../utils/fetch_aws_secrets";

const config = {
  ENV: "DEV", // Switch between DEV | PROD
  PORT: 8080,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

export const create_config = async () => {
  const secretConfig = await fetch_aws_secrets("LENDING_MADE_EASY");
  Object.assign(config, secretConfig);
};

export default config;
