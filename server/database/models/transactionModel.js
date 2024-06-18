const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  amount: { type: Number, required: true },
  type: { type: String, required: true }, // Assure-toi que ce champ est présent et requis
  date: { type: Date, default: Date.now },
  balanceAfterTransaction: { type: Number, required: true },
  category: { type: String, default: "" },
  notes: { type: String, default: "" },
  accountType: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
