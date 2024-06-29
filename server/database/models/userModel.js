const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: { type: String, default: "user" },
    checkingBalance: {
      type: Number,
      default: Math.floor(Math.random() * 3001) + 2000,
    },
    savingsBalance: {
      type: Number,
      default: Math.floor(Math.random() * 3001) + 2000,
    },
    creditBalance: {
      type: Number,
      default: Math.floor(Math.random() * 3001) + 2000,
    }, // Ajoute un solde de départ aléatoire entre 2000 et 5000
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
