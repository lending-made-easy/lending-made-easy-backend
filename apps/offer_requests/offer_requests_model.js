import mongoose from "mongoose";

const offer_request_schema = new mongoose.Schema({
  offer_request_id: {
    type: String,
    required: true,
    unique: true,
  },
  offer_amount: {
    type: Number,
    required: true,
    min: 0,
  },
  lender_id: {
    type: String,
    required: true,
  },
  borrower_id: {
    type: String,
    required: true,
  },
  last_modified_time: {
    type: Date,
    required: true,
  },
  lender_approval: {
    type: Boolean,
    required: true,
  },
  borrower_approval: {
    type: Boolean,
    required: true,
  },
  offer_request_status: {
    type: String,
    required: true,
    enum: ["open", "accepted", "closed", "canceled"],
  },
});

const offer_request_model = mongoose.model(
  "offer_requests",
  offer_request_schema
);

export default offer_request_model;
