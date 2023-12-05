import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config, { create_config } from "./config/config";
import users_router from "./apps/users/users_router";
import transactions_router from "./apps/transactions/transactions_router";
import offer_requests_router from "./apps/offer_requests/offer_requests_router";

const app = express();
app.use(cors());
app.use(express.json());

// Define routes and middleware...
app.use("/users", users_router);
app.use("/transactions", transactions_router);
app.use("/offer_requests", offer_requests_router);

const init_app = async () => {
  await create_config();
  // console.log(config);

  const PORT = config.PORT;

  // Connect to MongoDB
  try {
    mongoose.connect(config.MONGODB_URL);
  } catch (error) {
    console.log(error);
  }

  // Run the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

init_app();
