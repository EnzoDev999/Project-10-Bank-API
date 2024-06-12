const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  accountType: { type: String, required: true },
  balanceAfterTransaction: { type: Number, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
