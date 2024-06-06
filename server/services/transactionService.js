const Transaction = require("../database/models/transactionModel.js");
const jwt = require("jsonwebtoken");

module.exports.getAllTransactions = async (req) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  const decoded = jwt.verify(
    token,
    process.env.SECRET_KEY || "default-secret-key"
  );
  const transactions = await Transaction.find({ userId: decoded.id });

  // Retourne un tableau vide si aucune transaction n'est trouvée
  return transactions.length ? transactions : [];
};

module.exports.getTransactionById = async (transactionId) => {
  return await Transaction.findById(transactionId);
};

module.exports.createTransaction = async (req) => {
  const token = req.headers.authorization.split("Bearer ")[1];
  const decoded = jwt.verify(
    token,
    process.env.SECRET_KEY || "default-secret-key"
  );
  const transaction = new Transaction({
    userId: decoded.id,
    amount: req.body.amount,
    type: req.body.type,
    description: req.body.description,
    date: new Date(),
  });
  return await transaction.save();
};

module.exports.updateTransaction = async (req) => {
  return await Transaction.findByIdAndUpdate(
    req.params.transactionId,
    {
      amount: req.body.amount,
      type: req.body.type,
      description: req.body.description,
    },
    { new: true }
  );
};

module.exports.deleteTransaction = async (transactionId) => {
  return await Transaction.findByIdAndDelete(transactionId);
};
