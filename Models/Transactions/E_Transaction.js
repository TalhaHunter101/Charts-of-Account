const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Expense_Transaction = new mongoose.Schema({
  User: { type: Schema.Types.ObjectId, ref: "Users" },
  Paid_from: {
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
const Expense_Transactions = mongoose.model(
  "E_Transaction",
  Expense_Transaction
);
module.exports = Expense_Transactions;
