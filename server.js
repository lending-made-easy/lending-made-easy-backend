import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config, { create_config } from "./config/config";
import users_router from "./apps/users/users_router";

const app = express();
app.use(cors());
app.use(express.json());

// Define routes and middleware...
app.use("/users", users_router);

const init_app = async () => {
  await create_config();
  // console.log(config);

  const PORT = config.PORT;

  // Connect to MongoDB
  try {
    mongoose.connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
  }

  // Run the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

init_app();
