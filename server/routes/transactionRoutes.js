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
  requireAdmin, // Assurez-vous que seuls les admins peuvent créer des transactions
  transactionController.createTransaction
);

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
