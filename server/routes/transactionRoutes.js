const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController.js");
const { validateToken } = require("../middleware/tokenValidation");

router.get(
  "/current-month",
  validateToken,
  transactionController.getTransactionsForCurrentMonth
);

router.get("/", validateToken, transactionController.getAllTransactions);

router.get(
  "/:transactionId",
  validateToken,
  transactionController.getTransactionById
);

router.post("/", validateToken, transactionController.createTransaction);

router.put(
  "/:transactionId",
  validateToken,
  transactionController.updateTransaction
);

router.delete(
  "/:transactionId",
  validateToken,
  transactionController.deleteTransaction
);

module.exports = router;
