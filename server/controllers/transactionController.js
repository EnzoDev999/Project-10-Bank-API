const Transaction = require("../database/models/transactionModel.js");
const transactionService = require("../services/transactionService.js");
const User = require("../database/models/userModel.js");
const jwt = require("jsonwebtoken");

module.exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions(req);
    if (!transactions || transactions.length === 0) {
      return res.status(404).send({ message: "No transactions found" });
    }
    return res.status(200).send({ data: transactions });
  } catch (error) {
    console.error("Error in getAllTransactions:", error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports.getTransactionsForCurrentMonth = async (req, res) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1].trim();
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      },
    });

    console.log("Transactions:", transactions); // Ajoutez cette ligne pour vérifier les transactions récupérées

    res.status(200).json({ status: "success", data: transactions });
  } catch (error) {
    console.error("Error fetching transactions for current month:", error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.transactionId
    );
    res.status(200).json({ body: transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.createTransaction = async (req, res) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1].trim();
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.id;

    const { amount, type, description, date } = req.body;

    // Récupérer l'utilisateur pour obtenir la balance actuelle
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Calculer la nouvelle balance après la transaction
    const newBalance = user.balance - amount;

    const newTransaction = new Transaction({
      userId,
      amount,
      type,
      description,
      date,
      balanceAfterTransaction: newBalance, // Enregistrer la nouvelle balance
    });

    // Enregistrer la transaction
    const savedTransaction = await newTransaction.save();

    // Mettre à jour la balance de l'utilisateur
    user.balance = newBalance;
    await user.save();

    res.status(201).json({ status: "success", data: savedTransaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req);
    res.status(200).json({ body: transaction });
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
      userId,
      date: { $gt: transactionToDelete.date },
    }).sort("date");

    // Ajouter le montant de la transaction supprimée aux balances des transactions suivantes
    const amountToAdd = transactionToDelete.amount;
    for (let tx of subsequentTransactions) {
      tx.balanceAfterTransaction += amountToAdd;
      await tx.save();
    }

    // Mettre à jour la balance de l'utilisateur
    const user = await User.findById(userId);
    user.balance += amountToAdd;
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(400).json({ message: error.message });
  }
};
