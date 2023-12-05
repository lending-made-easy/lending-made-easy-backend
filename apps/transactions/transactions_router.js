import express from "express";
import {
  get_transaction_by_id,
  update_transaction_status,
  get_transactions_by_status,
  get_transactions_by_user,
  record_transaction,
} from "./transactions_view";

const transactions_router = express.Router();

transactions_router.post("/", record_transaction);
transactions_router.put(
  "/:id(txnid[a-zA-Z0-9]{15})",
  update_transaction_status
);
transactions_router.get("/:id(txnid[a-zA-Z0-9]{15})", get_transaction_by_id);
transactions_router.get(
  "/:user_id(uid[a-zA-Z0-9]{12})/:user_type(lender|borrower|all)",
  get_transactions_by_user
);
transactions_router.get(
  "/:status(success|pending|failed|all)",
  get_transactions_by_status
);
transactions_router.get("*", (req, res) => {
  res.status(404).send(`API endpoint not found, Please check again...`);
});

export default transactions_router;
