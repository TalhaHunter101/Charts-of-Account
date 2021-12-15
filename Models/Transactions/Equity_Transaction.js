const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Equity_Transaction = new mongoose.Schema({
  User: { type: Schema.Types.ObjectId, ref: "Users" },
  Source: {
    type: Schema.Types.ObjectId,
  },
  Destination: {
    type: Schema.Types.ObjectId,
  },
  Transaction: {
    Ammount: { type: Number, required: true },
    Date: { type: String, required: false },
    description: { type: String, required: false },
    category: { type: String, required: false },
  },
});
const Equity_Transactions = mongoose.model(
  "Equity_Transaction",
  Equity_Transaction
);
module.exports = Equity_Transactions;
