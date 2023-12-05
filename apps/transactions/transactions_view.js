import { create_id } from "../../utils/create_id";
import offer_request_model from "../offer_requests/offer_requests_model";
import transaction_model from "./transactions_model";
import users_model from "./../users/users_model";

export const record_transaction = async (req, res) => {
  const { offer_request_id } = req.body;
  try {
    const offer_request = await offer_request_model.findOne({
      offer_request_id,
    });
    const offer_request_status = offer_request.offer_request_status;
    if (offer_request_status === "accepted") {
      const transaction_id = create_id("txnid", 15);
      const amount = offer_request.offer_amount;
      const lender_id = offer_request.lender_id;
      const borrower_id = offer_request.borrower_id;
      const transaction_status = "pending"; //would be used for tracking transactions
      const transaction = new transaction_model({
        transaction_id,
        amount,
        lender_id,
        borrower_id,
        transaction_time: new Date(),
        transaction_status,
        offer_request_id,
      });

      await transaction.save();
      const lender = await users_model.findOne({ user_id: lender_id });
      const borrower = await users_model.findOne({ user_id: borrower_id });
      await lender.updateOne({
        wallet_balance: lender.wallet_balance + amount,
      });
      await borrower.updateOne({
        wallet_balance: borrower.wallet_balance - amount,
      });
      res.status(200).json({
        message: `transaction recorded with transaction_id: ${transaction_id}`,
        data: transaction,
      });
    } else if (
      offer_request_status === "canceled" ||
      offer_request_status === "closed"
    ) {
      res.status(400).json({ message: `offer request is no longer open` });
      return;
    } else {
      res
        .status(400)
        .json({ message: `offer request is not accepted by both party` });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

export const update_transaction_status = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const transaction = await transaction_model.findOne({ transaction_id: id });
    const transaction_status = transaction.transaction_status;
    if (transaction_status === "pending") {
      transaction.updateOne({ transaction_status: status });
      const offer_request_id = transaction.offer_request_id;
      await offer_request_model.findOneAndUpdate(
        { offer_request_id },
        { offer_request_status: "closed" }
      );
      res.status(200).json({
        message: `transaction updated`,
      });
    } else {
      res.status(400).json({ message: `transaction is already completed` });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

export const get_transaction_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await transaction_model.findOne({ transaction_id: id });
    res.status(200).json(transaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

export const get_transactions_by_user = async (req, res) => {
  const { user_id, user_type } = req.params;
  try {
    let transactions;
    switch (user_type) {
      case "all":
        transactions = await transaction_model.find({
          $or: [{ lender_id: user_id }, { borrower_id: user_id }],
        });
        break;
      case "lender":
        transactions = await transaction_model.find({ lender_id: user_id });
        break;
      case "borrower":
        transactions = await transaction_model.find({ borrower_id: user_id });
        break;
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

export const get_transactions_by_status = async (req, res) => {
  const { status } = req.params;
  try {
    let transactions;
    if (status === "all") {
      transactions = await transaction_model.find();
    } else {
      transactions = await transaction_model.find({
        transaction_status: status,
      });
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};
