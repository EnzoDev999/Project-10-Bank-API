const transactionService = require("../services/transactionService.js");

module.exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAllTransactions(req);
    res.status(200).json({ body: transactions });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const transaction = await transactionService.createTransaction(req);
    res.status(201).json({ body: transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    await transactionService.deleteTransaction(req.params.transactionId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
