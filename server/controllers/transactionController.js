const Transaction = require("../database/models/transactionModel.js");
const transactionService = require("../services/transactionService.js");
const User = require("../database/models/userModel.js");
const jwt = require("jsonwebtoken");

module.exports.getAllTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    const transactions = await transactionService.getAllTransactions(userId);
    if (!transactions || transactions.length === 0) {
      return res.status(404).send({ message: "No transactions found" });
    }
    return res.status(200).send({ data: transactions });
  } catch (error) {
    console.error("Error in getAllTransactions:", error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports.getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Vérifiez si l'utilisateur est administrateur ou propriétaire de la transaction
    if (
      req.userRole !== "admin" &&
      transaction.userId.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.status(200).json({ data: transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getTransactionsForCurrentMonth = async (req, res) => {
  try {
    const { userId, accountType } = req.query;

    // Vérification du rôle et des autorisations
    if (req.userRole !== "admin" && req.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const transactions = await Transaction.find({
      userId,
      accountType,
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      },
    });

    res.status(200).json({ status: "success", data: transactions });
  } catch (error) {
    console.error("Error fetching transactions for current month:", error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, description, userId, accountType } = req.body;

    // Log pour vérifier les données reçues
    console.log("Creating transaction with data:", req.body);

    // Find the user's current balance for the given account type
    const user = await User.findById(userId);
    let currentBalance;
    switch (accountType) {
      case "checking":
        currentBalance = user.checkingBalance;
        break;
      case "savings":
        currentBalance = user.savingsBalance;
        break;
      case "credit":
        currentBalance = user.creditBalance;
        break;
      default:
        return res.status(400).json({ message: "Invalid account type" });
    }

    const newBalance = currentBalance - amount;

    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      description,
      date: new Date(),
      balanceAfterTransaction: newBalance,
      accountType,
    });

    const savedTransaction = await newTransaction.save();

    // Update user's balance
    switch (accountType) {
      case "checking":
        user.checkingBalance = newBalance;
        break;
      case "savings":
        user.savingsBalance = newBalance;
        break;
      case "credit":
        user.creditBalance = newBalance;
        break;
    }
    await user.save();

    res.status(201).json({ status: "success", data: savedTransaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const { category, notes } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      { category, notes },
      { new: true }
    );

    if (
      req.userRole !== "admin" &&
      transaction.userId.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }
    res.status(200).json({ data: transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const token = req.headers.authorization.split("Bearer ")[1].trim();
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    // Récupérer la transaction à supprimer
    const transactionToDelete = await Transaction.findById(transactionId);
    if (!transactionToDelete) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Supprimer la transaction
    await Transaction.findByIdAndDelete(transactionId);

    // Récupérer toutes les transactions après celle qui a été supprimée
    const subsequentTransactions = await Transaction.find({
      userId: transactionToDelete.userId, // Utiliser transactionToDelete.userId
      accountType: transactionToDelete.accountType,
      date: { $gt: transactionToDelete.date },
    }).sort("date");

    // Ajouter le montant de la transaction supprimée aux soldes des transactions suivantes
    const amountToAdd = transactionToDelete.amount;
    for (let tx of subsequentTransactions) {
      tx.balanceAfterTransaction += amountToAdd;
      await tx.save();
    }

    // Mettre à jour le solde de l'utilisateur
    const user = await User.findById(transactionToDelete.userId); // Utiliser transactionToDelete.userId
    switch (transactionToDelete.accountType) {
      case "checking":
        user.checkingBalance += amountToAdd;
        break;
      case "savings":
        user.savingsBalance += amountToAdd;
        break;
      case "credit":
        user.creditBalance += amountToAdd;
        break;
    }
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(400).json({ message: error.message });
  }
};
