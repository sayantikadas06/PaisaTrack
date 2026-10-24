
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:5000/api/transactions";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
const [filterType, setFilterType] = useState("all");
const [filterCategory, setFilterCategory] = useState("all");
const [filterDate, setFilterDate] = useState("");

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    netSavings: 0,
  });

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [transactionsResponse, summaryResponse] = await Promise.all([
        axios.get(API_URL),
        axios.get(`${API_URL}/summary`),
      ]);

      setTransactions(transactionsResponse.data);
      setSummary(summaryResponse.data);
      setError("");
    } catch (err) {
      setError(
        "Could not load data. Make sure your backend is running on port 5000."
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const amount = Number(form.amount);
    const chosenDate = new Date(`${form.date}T00:00:00`);

    if (!form.title.trim() || !form.category.trim()) {
      setError("Please enter a title and category.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!form.date || Number.isNaN(chosenDate.getTime())) {
      setError("Please choose a valid date.");
      return;
    }

    try {
      setLoading(true);

      
const payload = {
  ...form,
  title: form.title.trim(),
  category: form.category.trim(),
  amount,
};

if (editingId) {
  await axios.put(`${API_URL}/${editingId}`, payload);
  setMessage("Transaction updated successfully!");
  setEditingId(null);
} else {
  await axios.post(API_URL, payload);
  setMessage("Transaction added successfully!");
}


      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });

      setMessage("Transaction added successfully!");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not save the transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  
const handleEdit = (transaction) => {
  setEditingId(transaction._id);

  setForm({
    title: transaction.title,
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    date: new Date(transaction.date).toISOString().split("T")[0],
    description: transaction.description || "",
  });

  setError("");
  setMessage("");

  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Transaction deleted successfully!");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not delete the transaction."
      );
    }
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  
const filteredTransactions = transactions.filter((transaction) => {
  const matchesType =
    filterType === "all" || transaction.type === filterType;

  const matchesCategory =
    filterCategory === "all" ||
    transaction.category === filterCategory;

  const transactionDate = new Date(transaction.date)
    .toISOString()
    .split("T")[0];

  const matchesDate =
    !filterDate || transactionDate === filterDate;

  return matchesType && matchesCategory && matchesDate;
});

const categories = [
  ...new Set(transactions.map((transaction) => transaction.category)),
];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Wallet size={24} />
          </div>
          <div>
            <h1>PaisaTrack</h1>
            <p>Your personal finance dashboard</p>
          </div>
        </div>

        <span className="status">
          <span className="status-dot"></span>
          Expense Tracker
        </span>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR FINANCES AT A GLANCE</p>
            <h2>Money made simple.</h2>
            <p className="subtitle">
              Track your income, manage expenses, and understand your savings.
            </p>
          </div>
        </section>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <section className="summary-grid">
          <div className="summary-card income-card">
            <div className="card-heading">
              <span>Total Income</span>
              <span className="card-icon">
                <TrendingUp size={21} />
              </span>
            </div>
            <h3>{formatMoney(summary.income)}</h3>
            <p>All recorded income</p>
          </div>

          <div className="summary-card expense-card">
            <div className="card-heading">
              <span>Total Expenses</span>
              <span className="card-icon">
                <TrendingDown size={21} />
              </span>
            </div>
            <h3>{formatMoney(summary.expense)}</h3>
            <p>All recorded expenses</p>
          </div>

          <div className="summary-card savings-card">
            <div className="card-heading">
              <span>Net Savings</span>
              <span className="card-icon">
                <Wallet size={21} />
              </span>
            </div>
            <h3>{formatMoney(summary.netSavings)}</h3>
            <p>Income minus expenses</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h3>Add Transaction</h3>
                <p>Record your income or an expense.</p>
              </div>
              <span className="heading-icon">
                <Plus size={20} />
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="type">Transaction type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={form.type === "income" ? "type-btn active-income" : "type-btn"}
                  onClick={() =>
                    setForm({ ...form, type: "income" })
                  }
                >
                  <ArrowDownRight size={17} /> Income
                </button>

                <button
                  type="button"
                  className={form.type === "expense" ? "type-btn active-expense" : "type-btn"}
                  onClick={() =>
                    setForm({ ...form, type: "expense" })
                  }
                >
                  <ArrowUpRight size={17} /> Expense
                </button>
              </div>

              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Monthly salary"
                required
              />

              <label htmlFor="amount">Amount (₹) *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 1500"
                required
              />

              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Education">Education</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>

              <label htmlFor="date">Date *</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />

              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add a note..."
                rows="3"
              />

              
<button className="submit-btn" type="submit" disabled={loading}>
  {editingId ? <Pencil size={18} /> : <Plus size={18} />}
  {loading
    ? "Saving..."
    : editingId
      ? "Update Transaction"
      : "Add Transaction"}
</button>

{editingId && (
  <button
    type="button"
    className="cancel-edit-btn"
    onClick={() => {
      setEditingId(null);
      setError("");
      setMessage("");
      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    }}
  >
    Cancel Editing
  </button>
)}

            </form>
          </div>

          <div className="panel history-panel">
            <div className="panel-heading">
              <div>
                <h3>Transaction History</h3>
                <p>
  Showing {filteredTransactions.length} of {transactions.length} transaction(s)
</p>
              </div>
              <span className="count-badge">{transactions.length}</span>
            </div>
            
<div className="filters">
  <div className="filter-field">
    <label htmlFor="filterType">Type</label>
    <select
      id="filterType"
      value={filterType}
      onChange={(e) => setFilterType(e.target.value)}
    >
      <option value="all">All Types</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>
  </div>

  <div className="filter-field">
    <label htmlFor="filterCategory">Category</label>
    <select
      id="filterCategory"
      value={filterCategory}
      onChange={(e) => setFilterCategory(e.target.value)}
    >
      <option value="all">All Categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  </div>

  <div className="filter-field">
    <label htmlFor="filterDate">Date</label>
    <input
      id="filterDate"
      type="date"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
  </div>

  <button
    type="button"
    className="clear-filters-btn"
    onClick={() => {
      setFilterType("all");
      setFilterCategory("all");
      setFilterDate("");
    }}
  >
    Clear Filters
  </button>
</div>

            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Wallet size={30} />
                </div>
                
<h4>
  {transactions.length === 0
    ? "No transactions yet"
    : "No matching transactions"}
</h4>
<p>
  {transactions.length === 0
    ? "Add your first transaction using the form."
    : "Try changing your filters or clear them."}
</p>

              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>
                          <strong>{transaction.title}</strong>
                          {transaction.description && (
                            <small>{transaction.description}</small>
                          )}
                        </td>
                        <td>
                          <span className="category-badge">
                            {transaction.category}
                          </span>
                        </td>
                        <td>
                          {new Date(transaction.date).toLocaleDateString("en-IN")}
                        </td>
                        <td
                          className={
                            transaction.type === "income"
                              ? "amount-income"
                              : "amount-expense"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatMoney(transaction.amount)}
                        </td>
                        <td>
                          
<div className="action-buttons">
  <button
    className="edit-btn"
    type="button"
    title="Edit transaction"
    aria-label={`Edit ${transaction.title}`}
    onClick={() => handleEdit(transaction)}
  >
    <Pencil size={17} />
  </button>

  <button
    className="delete-btn"
    type="button"
    title="Delete transaction"
    aria-label={`Delete ${transaction.title}`}
    onClick={() => handleDelete(transaction._id)}
  >
    <Trash2 size={17} />
  </button>
</div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <footer>
          <p>PaisaTrack · Built with React, Express & MongoDB</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
