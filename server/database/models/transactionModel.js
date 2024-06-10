const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  balanceAfterTransaction: { type: Number, required: true }, // Ajout du champ balance
});

module.exports = mongoose.model("Transaction", transactionSchema);
