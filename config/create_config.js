import "dotenv/config";
import fetch_aws_secrets from "../utils/fetch_aws_secrets";

const create_config = async () => {
  let config = {
    ENV: "DEV", // Switch between DEV | PROD
    PORT: 8080,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  };
  const secret = await fetch_aws_secrets("LENDING_MADE_EASY");
  config = { ...config, ...secret };
  return config;
};

export default create_config;
