import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import create_config from "./config/create_config";

const app = express();
app.use(cors());

const init_app = async () => {
  const config = await create_config();
  console.log(config);

  const PORT = config.PORT;

  // Connect to MongoDB
  mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Define routes and middleware...
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

init_app();
