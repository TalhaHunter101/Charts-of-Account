const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Liability_Transaction = new mongoose.Schema({
  User: { type: Schema.Types.ObjectId, ref: "Users" },
  Source: {
    type: Schema.Types.ObjectId,
    ref: "Equity",
    required: true,
  },
  Destination: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  Transaction: {
    Ammount: { type: Number, required: true },
    Date: { type: String, required: false },
    description: { type: String, required: false },
    category: { type: String, required: false },
  },
});
const Liability_Transactions = mongoose.model(
  "Liability_Transaction",
  Liability_Transaction
);
module.exports = Liability_Transactions;
