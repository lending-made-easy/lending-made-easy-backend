import express from "express";

import { create_user, get_user_by_id, get_all_users } from "./users_view";

const users_router = express.Router();

users_router.post("/", create_user);
users_router.get("/:id(uid[a-zA-Z0-9]{12})", get_user_by_id);
users_router.get("/:type", get_all_users);
users_router.get("*", (req, res) => {
  res.status(404).send(`API endpoint not found, Please check again...`);
});

export default users_router;
