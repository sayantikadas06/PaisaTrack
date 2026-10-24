
const express = require("express");
const router = express.Router();

const {
  getTransactions,
  addTransaction,
  getSummary,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.get("/", getTransactions);
router.post("/", addTransaction);
router.get("/summary", getSummary);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
