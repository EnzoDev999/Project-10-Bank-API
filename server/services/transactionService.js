const Transaction = require("../database/models/transactionModel");

module.exports.createTransaction = async (serviceData) => {
  try {
    // Fetch the last transaction to get the previous balance
    const lastTransaction = await Transaction.findOne({
      userId: serviceData.userId,
    }).sort({ date: -1 });
    const previousBalance = lastTransaction ? lastTransaction.balance : 0;
    const newBalance = previousBalance + serviceData.amount;

    const transaction = new Transaction({
      ...serviceData,
      balance: newBalance,
    });

    let result = await transaction.save();

    if (
      !result.amount ||
      !result.type ||
      !result.description ||
      !result.balance
    ) {
      console.error("Transaction created with missing fields:", result);
      throw new Error("Transaction created with missing fields");
    }

    return result;
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};

module.exports.deleteTransaction = async (transactionId) => {
  try {
    const transactionToDelete = await Transaction.findById(transactionId);
    if (!transactionToDelete) {
      throw new Error("Transaction not found!");
    }

    await Transaction.deleteOne({ _id: transactionId });

    // Update the balance of subsequent transactions
    const subsequentTransactions = await Transaction.find({
      userId: transactionToDelete.userId,
      date: { $gt: transactionToDelete.date },
    }).sort({ date: 1 });

    let previousBalance =
      transactionToDelete.balance - transactionToDelete.amount;

    for (const txn of subsequentTransactions) {
      txn.balance = previousBalance + txn.amount;
      previousBalance = txn.balance;
      await txn.save();
    }

    return transactionToDelete;
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};
