import { create_id } from "../../utils/create_id";
import offer_request_model from "./offer_requests_model";

export const create_offer_request = async (req, res) => {
  const { amount, lender_id, borrower_id } = req.body;
  const lender = await users_model.findOne({ user_id: lender_id });
  const borrower = await users_model.findOne({ user_id: borrower_id });
  if (lender?.user_type === "lender" && borrower?.user_type === "borrower") {
    const offer_request_id = create_id("orid", 16);
    const offer_request_status = "open";
    const offer_request = new offer_request_model({
      offer_request_id,
      offer_amount: amount,
      lender_id,
      borrower_id,
      last_modified_time: new Date(),
      lender_approval: false,
      borrower_approval: true,
      offer_request_status,
    });
    try {
      await offer_request.save();
      res.status(200).json({
        message: `new offer request placed with offer_request_id: ${offer_request_id}, offer_amount: ${amount}, lender_id: ${lender_id}, borrower_id: ${borrower_id}`,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: `Something went wrong` });
    }
  } else {
    res.status(404).json({ message: `No such lender/borrower found` });
  }
};

export const update_offer_request = async (req, res) => {
  const { id } = req.params;
  const { user_id, amount, status } = req.body;
  try {
    const offer_request = await offer_request_model.findOne({
      offer_request_id: id,
    });
    const {
      offer_request_status,
      lender_id,
      borrower_id,
      lender_approval,
      borrower_approval,
    } = offer_request;
    if (
      offer_request_status === "canceled" ||
      offer_request_status === "closed"
    ) {
      res.status(400).json({
        message: `${offer_request_status} offer request can't be modified`,
      });
    } else if (
      offer_request_status === "open" ||
      offer_request_status === "accepted"
    ) {
      if (status === "accepted") {
        if (user_id === lender_id) {
          const updated_status = borrower_approval ? "accepted" : "open";
          offer_request.updateOne({
            lender_approval: true,
            offer_request_status: updated_status,
          });
        } else if (user_id === borrower_id) {
          const updated_status = lender_approval ? "accepted" : "open";
          offer_request.updateOne({
            borrower_approval: true,
            offer_request_status: updated_status,
          });
        }
      } else if (status === "canceled") {
        offer_request.updateOne({ offer_request_status: "cancelled" });
      } else if (status === "open") {
        let updated_lender_approval, updated_borrower_approval;
        if (user_id === lender_id) {
          updated_lender_approval = true;
          updated_borrower_approval = false;
        } else if (user_id === borrower_id) {
          updated_lender_approval = false;
          updated_borrower_approval = true;
        } else {
          console.log(
            `user_id: ${user_id} lender_id: ${lender_id} borrower_id: ${borrower_id}`
          );
          res
            .status(404)
            .json({ message: `User is not a part of this offer request` });
        }
        offer_request.updateOne({
          offer_amount: amount,
          lender_approval: updated_lender_approval,
          borrower_approval: updated_borrower_approval,
          offer_request_status: "open",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: `No such offer request found` });
  }
};

export const get_offer_request_by_id = async (req, res) => {
  const { id } = req.params;
  try {
    const offer_request = await offer_request_model.findOne({
      offer_request_id: id,
    });
    res.status(200).json(offer_request);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};

export const get_offer_request_by_user = async (req, res) => {
  const { user_id, offer_status } = req.params;
  try {
    let offer_requests;
    if (offer_status === "all") {
      offer_requests = await offer_request_model.find({
        $or: [{ lender_id: user_id }, { borrower_id: user_id }],
      });
    } else if (
      (offer_status === "open") |
      (offer_status === "accepted") |
      (offer_status === "closed") |
      (offer_status === "cancelled")
    ) {
      offer_requests = await offer_request_model.find({
        $or: [{ lender_id: user_id }, { borrower_id: user_id }],
        offer_request_status: offer_status,
      });
    }
    res.status(200).json(offer_requests);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: `Something went wrong` });
  }
};
