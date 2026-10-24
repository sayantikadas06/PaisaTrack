
const Transaction = require("../models/Transaction");

// GET: Fetch all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// POST: Add a transaction
exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    // Validate required fields
    if (
      !title?.trim() ||
      amount === undefined ||
      amount === null ||
      !type ||
      !category?.trim() ||
      !date
    ) {
      return res.status(400).json({
        message: "Title, amount, type, category, and date are required",
      });
    }

    // Validate amount
    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be a number greater than zero",
      });
    }

    // Validate transaction type
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    // Validate date
    const transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid date",
      });
    }

    const transaction = await Transaction.create({
      title: title.trim(),
      amount: numericAmount,
      type,
      category: category.trim(),
      date: transactionDate,
      description: description || "",
    });

    res.status(201).json({
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add transaction",
      error: error.message,
    });
  }
};

// GET: Calculate summary totals
exports.getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income =
      summary.find((item) => item._id === "income")?.total || 0;

    const expense =
      summary.find((item) => item._id === "expense")?.total || 0;

    res.status(200).json({
      income,
      expense,
      netSavings: income - expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate summary",
    });
  }
};

// DELETE: Remove a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(
      req.params.id
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid transaction ID or delete failed",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body;

    if (
      !title?.trim() ||
      amount === undefined ||
      amount === null ||
      !type ||
      !category?.trim() ||
      !date
    ) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    const transactionDate = new Date(date);

    if (Number.isNaN(transactionDate.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid date",
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        amount: numericAmount,
        type,
        category: category.trim(),
        date: transactionDate,
        description: description || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};
