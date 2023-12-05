import mongoose from "mongoose";

const users_schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^\+[0-9]{12}$/.test(value);
      },
    },
  },
  user_name: {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
  },
  user_type: { type: String, required: true, enum: ["lender", "borrower"] },
  wallet_balance: { type: Number, default: 0 },
});

const users_model = mongoose.model("users", users_schema);

export default users_model;
