const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController.js");
const tokenValidation = require("../middleware/tokenValidation");

router.get(
  "/",
  tokenValidation.validateToken,
  transactionController.getAllTransactions
);
router.get(
  "/:transactionId",
  tokenValidation.validateToken,
  transactionController.getTransactionById
);
router.post(
  "/",
  tokenValidation.validateToken,
  transactionController.createTransaction
);
router.put(
  "/:transactionId",
  tokenValidation.validateToken,
  transactionController.updateTransaction
);
router.delete(
  "/:transactionId",
  tokenValidation.validateToken,
  transactionController.deleteTransaction
);

module.exports = router;
