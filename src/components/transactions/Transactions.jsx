import { API_ENDPOINTS } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";

// Mock data for categories and bank accounts
const categories = [
  { id: 1, name: "Salary", type: "income" },
  { id: 2, name: "Freelance", type: "income" },
  { id: 3, name: "Investment Returns", type: "income" },
  { id: 4, name: "Food", type: "expense" },
  { id: 5, name: "Utilities", type: "expense" },
  { id: 6, name: "Entertainment", type: "expense" },
  { id: 7, name: "Transportation", type: "expense" },
  { id: 8, name: "Healthcare", type: "expense" },
  { id: 9, name: "Shopping", type: "expense" },
];

const bankAccounts = [
  { id: 1, name: "Savings Account" },
  { id: 2, name: "Checking Account" },
  { id: 3, name: "Credit Card" },
  { id: 4, name: "Cash" },
];

const transactionMethods = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Debit/Credit Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "wallet", label: "Digital Wallet" },
  { value: "cheque", label: "Cheque" },
];

const transactionStatuses = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

const timeOfDayOptions = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
  { value: "evening", label: "Evening (6 PM - 10 PM)" },
  { value: "night", label: "Night (10 PM - 6 AM)" },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "income",
      amount: 50000,
      category: "Salary",
      bankAccount: "Savings Account",
      description: "Monthly salary credit",
      date: "2025-08-01",
      transactionMethod: "bank_transfer",
      transactionStatus: "completed",
      notes: "August salary from employer",
      timeOFDay: "morning",
      dailyTransactions: [],
    },
    {
      id: 2,
      type: "expense",
      amount: 2500,
      category: "Food",
      bankAccount: "Credit Card",
      description: "Grocery shopping",
      date: "2025-08-05",
      transactionMethod: "card",
      transactionStatus: "completed",
      notes: "Weekly grocery purchase at supermarket",
      timeOFDay: "afternoon",
      dailyTransactions: [],
    },
    {
      id: 3,
      type: "income",
      amount: 10000,
      category: "Freelance",
      bankAccount: "Checking Account",
      description: "Freelance project payment",
      date: "2025-08-10",
      transactionMethod: "upi",
      transactionStatus: "completed",
      notes: "Payment for web development project",
      timeOFDay: "evening",
      dailyTransactions: [],
    },
    {
      id: 4,
      type: "expense",
      amount: 1500,
      category: "Transportation",
      bankAccount: "Cash",
      description: "Taxi fare",
      date: "2025-08-12",
      transactionMethod: "cash",
      transactionStatus: "completed",
      notes: "Trip to downtown",
      timeOFDay: "night",
      dailyTransactions: [],
    },
    {
      id: 5,
      type: "expense",
      amount: 3000,
      category: "Entertainment",
      bankAccount: "Credit Card",
      description: "Movie night",
      date: "2025-08-15",
      transactionMethod: "wallet",
      transactionStatus: "pending",
      notes: "Tickets and snacks for movie",
      timeOFDay: "evening",
      dailyTransactions: [],
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    bankAccount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    transactionMethod: "",
    transactionStatus: "completed",
    notes: "",
    timeOFDay: "morning",
    dailyTransactions: [],
  });

  //! Reset form data
  const resetFormData = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "",
      bankAccount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      transactionMethod: "",
      transactionStatus: "completed",
      notes: "",
      timeOFDay: "morning",
      dailyTransactions: [],
    });
    setErrors({});
  };

  //! Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.bankAccount) {
      newErrors.bankAccount = "Bank account is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.transactionMethod) {
      newErrors.transactionMethod = "Transaction method is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //! Fetch all transactions
  const handleGetTransactions = async () => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.get(
        API_ENDPOINTS.TRANSACTION.GET_ALL
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch transactions");
      }
      const data = response.data?.data?.transactions || [];
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      alert(error.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  //! Add a new transaction
  const addTransaction = async (transactionData) => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.post(
        API_ENDPOINTS.TRANSACTION.CREATE,
        transactionData
      );
      if (response.status !== 201) {
        throw new Error("Failed to add transaction");
      }
      setTransactions([...transactions, response.data.data]);
      alert("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(error.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  //! Update an existing transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.put(
        `${API_ENDPOINTS.TRANSACTION.UPDATE}/${id}`,
        transactionData
      );
      if (response.status !== 200) {
        throw new Error("Failed to update transaction");
      }
      setTransactions(
        transactions.map((t) =>
          t.id === id ? { ...t, ...response.data.data } : t
        )
      );
      alert("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert(error.response?.data?.message || "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  //! Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.delete(
        `${API_ENDPOINTS.TRANSACTION.DELETE}/${id}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions(transactions.filter((t) => t.id !== id));
      alert("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert(error.response?.data?.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  //! Filter and search transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus =
      filterStatus === "all" || transaction.transactionStatus === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  //! Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transactionData = {
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      bankAccount: formData.bankAccount,
      description: formData.description.trim(),
      date: formData.date,
      transactionStatus: formData.transactionStatus,
      transactionMethod: formData.transactionMethod,
      notes: formData.notes.trim(),
      timeOFDay: formData.timeOFDay,
      dailyTransactions: formData.dailyTransactions,
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      setEditingTransaction(null);
    } else {
      addTransaction(transactionData);
    }

    resetFormData();
    setShowForm(false);
  };

  //! Handle edit button click
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      bankAccount: transaction.bankAccount,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split("T")[0],
      transactionMethod: transaction.transactionMethod || "",
      transactionStatus: transaction.transactionStatus || "completed",
      notes: transaction.notes || "",
      timeOFDay: transaction.timeOFDay || "morning",
      dailyTransactions: transaction.dailyTransactions || [],
    });
    setShowForm(true);
  };

  //! Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  //! Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  //! Fetch transactions on mount
  useEffect(() => {
    handleGetTransactions();
  }, []);

  return (
    <div className="w-full mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transaction Management
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Track your income and expenses effortlessly
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary transition-all shadow-md disabled:opacity-50"
          disabled={loading}
        >
          ➕ Add Transaction
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-card-foreground mb-6">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type and Amount */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                        category: "",
                      })
                    }
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-input-background border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.amount ? "border-red-500" : "border-border"
                    }`}
                    placeholder="0.00"
                    required
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
              </div>

              {/* Category and Bank Account */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-input-background border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.category ? "border-red-500" : "border-border"
                    }`}
                    required
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter((c) => c.type === formData.type)
                      .map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bank Account *
                  </label>
                  <select
                    value={formData.bankAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, bankAccount: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-input-background border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.bankAccount ? "border-red-500" : "border-border"
                    }`}
                    required
                  >
                    <option value="">Select account</option>
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                  {errors.bankAccount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bankAccount}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full px-4 py-3 bg-input-background border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.description ? "border-red-500" : "border-border"
                  }`}
                  placeholder="Transaction description"
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date and Time of Day */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className={`w-full px-4 py-3 bg-input-background border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.date ? "border-red-500" : "border-border"
                    }`}
                    required
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time of Day
                  </label>
                  <select
                    value={formData.timeOFDay}
                    onChange={(e) =>
                      setFormData({ ...formData, timeOFDay: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {timeOfDayOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transaction Method and Status */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={formData.transactionMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionMethod: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 bg-input-background border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                      errors.transactionMethod
                        ? "border-red-500"
                        : "border-border"
                    }`}
                    required
                  >
                    <option value="">Select method</option>
                    {transactionMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {errors.transactionMethod && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transactionMethod}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={formData.transactionStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionStatus: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {transactionStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Additional notes (optional)"
                  rows="4"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                    resetFormData();
                  }}
                  className="px-6 py-3 text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-accent transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary transition-all shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : editingTransaction
                    ? "Update"
                    : "Add"}{" "}
                  Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <span className="text-3xl text-green-500">📈</span>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-semibold text-green-600">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <span className="text-3xl text-red-500">📉</span>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-semibold text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <span
              className={`text-3xl ${
                netBalance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {netBalance >= 0 ? "💰" : "⚠️"}
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <p
                className={`text-2xl font-semibold ${
                  netBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{Math.abs(netBalance).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <span className="text-3xl text-blue-500">#</span>
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-semibold text-card-foreground">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search transactions by description, notes, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              disabled={loading}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-40 px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              disabled={loading}
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-40 px-4 py-3 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              disabled={loading}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
            <p className="mt-4 text-xl text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Account
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`hover:bg-accent/50 transition-colors ${
                        index % 2 === 0 ? "bg-muted/50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                        <div>
                          {new Date(transaction.date).toLocaleDateString()}
                          {transaction.timeOFDay && (
                            <div className="text-xs text-muted-foreground capitalize">
                              {transaction.timeOFDay}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-3 w-3 rounded-full mr-4 ${
                              transaction.type === "income"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div>
                            <div className="text-sm text-card-foreground font-medium">
                              {transaction.description}
                            </div>
                            {transaction.notes && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {transaction.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {transaction.bankAccount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">
                        {transaction.transactionMethod?.replace("_", " ") ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.transactionStatus === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : transaction.transactionStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : transaction.transactionStatus === "failed"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }`}
                        >
                          {transaction.transactionStatus || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₹
                          {transaction.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-100"
                            disabled={loading}
                            title="Edit transaction"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
                            disabled={loading}
                            title="Delete transaction"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-16">
                <span className="text-5xl">📊</span>
                <h3 className="mt-6 text-xl font-semibold text-card-foreground">
                  No transactions found
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  {searchTerm || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search or filters."
                    : "Get started by adding your first transaction."}
                </p>
                {!searchTerm &&
                  filterType === "all" &&
                  filterStatus === "all" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary transition-all shadow-md disabled:opacity-50"
                      disabled={loading}
                    >
                      Add Transaction
                    </button>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;