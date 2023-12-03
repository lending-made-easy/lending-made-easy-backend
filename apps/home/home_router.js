import express from "express";
import { get_home_view } from "./home_view";

const home_router = express.Router();

home_router.get("/", get_home_view);

export default home_router;
