const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const R_Transaction = new mongoose.Schema({
  User: { type: Schema.Types.ObjectId, ref: "Users" },
  Deposited_To: {
    type: Schema.Types.ObjectId,
  },
  Destination: {
    // Category
    type: Schema.Types.ObjectId,
  },
  Transaction: {
    Ammount: { type: Number, required: false },
    Date: { type: String, required: false },
    DateModified: { type: String, required: false },
    Description: { type: String, required: false },
    Category: { type: String, required: false },
  },
});
const R_transaction = mongoose.model("R_Transaction", R_Transaction);
module.exports = R_transaction;
