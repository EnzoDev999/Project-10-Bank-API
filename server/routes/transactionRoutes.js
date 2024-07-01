const express = require("express");
const transactionController = require("../controllers/transactionController");
const {
  validateToken,
  requireAdmin,
} = require("../middleware/tokenValidation");

const router = express.Router();

router.post(
  "/transactions",
  validateToken,
  requireAdmin,
  transactionController.createTransaction
);

router.get(
  "/transactions",
  validateToken,
  requireAdmin,
  transactionController.getAllTransactions
);

router.get(
  "/transactions/current-month",
  validateToken,
  transactionController.getTransactionsForCurrentMonth
);

router.get(
  "/transactions/:transactionId",
  validateToken,
  transactionController.getTransactionById
);

router.put(
  "/transactions/:transactionId",
  validateToken,
  transactionController.updateTransaction
);

router.delete(
  "/transactions/:transactionId",
  validateToken,
  requireAdmin,
  transactionController.deleteTransaction
);

module.exports = router;
