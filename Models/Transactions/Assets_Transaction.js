const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Assets_Transaction = new mongoose.Schema({
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
const Assets_Transactions = mongoose.model(
  "Assets_Transaction",
  Assets_Transaction
);
module.exports = Assets_Transactions;
