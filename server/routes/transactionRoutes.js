const express = require("express");
const transactionController = require("../controllers/transactionController");
const { validateToken } = require("../middleware/tokenValidation");

const router = express.Router();

router.get(
  "/transactions",
  validateToken,
  transactionController.getAllTransactions
);

router.get(
  "/transactions/current-month",
  validateToken,
  transactionController.getTransactionsForCurrentMonth
);

router.post(
  "/transactions",
  validateToken,
  transactionController.createTransaction
);

router.put(
  "/transactions/:transactionId",
  validateToken,
  transactionController.updateTransaction
);

router.delete(
  "/transactions/:transactionId",
  validateToken,
  transactionController.deleteTransaction
);

module.exports = router;
