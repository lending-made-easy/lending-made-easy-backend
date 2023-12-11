import express from "express";
import {
  create_offer_request,
  get_offer_request_by_id,
  get_offer_request_by_user,
  update_offer_request,
} from "./offer_requests_view";

const offer_requests_router = express.Router();

offer_requests_router.post("/", create_offer_request);
offer_requests_router.put("/:id(orid[a-zA-Z0-9]{16})", update_offer_request);
offer_requests_router.get("/:id(orid[a-zA-Z0-9]{16})", get_offer_request_by_id);
offer_requests_router.get(
  "/:user_id(uid[a-zA-Z0-9]{12})/:offer_status(open|accepted|closed|cancelled|all)",
  get_offer_request_by_user
);
offer_requests_router.get("*", (req, res) => {
  res.status(404).send(`API endpoint not found, Please check again...`);
});

export default offer_requests_router;
