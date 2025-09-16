import { API_ENDPOINTS } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import React, { useEffect, useMemo, useState } from "react";
import TransactionModal from "./TransactionModa";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, List, Wallet } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showDayWiseForm, setShowDayWiseForm] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set()); // Set to store expanded group IDs new Set();

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    bankAccount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    transactionMethod: "googlepay",
    transactionStatus: "pending",
    notes: "",
    timeOFDay: "morning",
    dailyTransactions: [],
    dayWiseGroupId: "",
  });

  const [dayWiseData, setDayWiseData] = useState({
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    totalAmount: "",
    bankAccount: "",
    items: [],
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
      transactionMethod: "googlepay",
      transactionStatus: "pending",
      notes: "",
      timeOFDay: "morning",
      dailyTransactions: [],
      dayWiseGroupId: "",
    });
    setErrors({});
  };

  //! Reset day-wise form when hiding
  useEffect(() => {
    if (!showDayWiseForm) {
      setDayWiseData({
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        totalAmount: "",
        bankAccount: "",
        items: [],
      });
    }
  }, [showDayWiseForm]);

  //! Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (
      !formData.category ||
      !categories.some((cat) => cat._id === formData.category)
    ) {
      newErrors.category = "Please select a valid category";
    }
    if (
      formData.bankAccount &&
      !bankAccounts.some((acc) => acc._id === formData.bankAccount)
    ) {
      newErrors.bankAccount = "Please select a valid bank account";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.description.length > 200) {
      newErrors.description = "Description must be 200 characters or less";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (
      !formData.transactionMethod ||
      ![
        "cash",
        "googlepay",
        "phonepe",
        "paytm",
        "netbanking",
        "debitcard",
        "creditcard",
        "other",
      ].includes(formData.transactionMethod)
    ) {
      newErrors.transactionMethod = "Please select a valid transaction method";
    }
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = "Notes must be 500 characters or less";
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
      console.log("Transactions:", data);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
      setErrors({
        general:
          error.response?.data?.message || "Failed to fetch transactions",
      });
    } finally {
      setLoading(false);
    }
  };

  //! Add a new transaction
  const addTransaction = async (transactionData) => {
    // console.log("Adding transaction:", transactionData);
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.post(
        API_ENDPOINTS.TRANSACTION.CREATE,
        transactionData
      );
      if (response.status !== 201) {
        throw new Error("Failed to add transaction");
      }
      setTransactions([...transactions, response.data?.data?.transaction]);
      setErrors({});
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to add transaction";
      setErrors({ general: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  //! Update an existing transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.put(
        API_ENDPOINTS.TRANSACTION.UPDATE(id),
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
      setErrors({});
      alert("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update transaction";
      setErrors({ general: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  //! Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      setLoading(true);
      const response = await AXIOS_INSTANCE.delete(
        API_ENDPOINTS.TRANSACTION.DELETE(id)
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete transaction");
      }
      setTransactions(transactions.filter((t) => t.id !== id));
      setErrors({});
      alert("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete transaction";
      setErrors({ general: errorMessage });
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  //! Handle day-wise form submission
  const handleDayWiseSubmit = (e) => {
    e.preventDefault();

    const totalCalculated = dayWiseData.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalExpected = parseFloat(dayWiseData.totalAmount);

    if (Math.abs(totalCalculated - totalExpected) > 0.01) {
      alert(
        `Total of items (${totalCalculated}) doesn't match expected total (${totalExpected})`
      );
      return;
    }

    const groupId = `daywise-${Date.now()}`;

    dayWiseData.items.forEach((item, index) => {
      const transactionData = {
        type: dayWiseData.type,
        amount: item.amount,
        category: item.category,
        bankAccount: dayWiseData.bankAccount,
        description: `${item.description} (${item.timeOFDay})`,
        date: dayWiseData.date,
        transactionMethod: formData.transactionMethod,
        transactionStatus: formData.transactionStatus,
        notes: "",
        timeOFDay: item.timeOFDay,
        dailyTransactions: [],
        dayWiseGroupId: groupId,
      };

      setTimeout(() => {
        addTransaction(transactionData);
      }, index * 10);
    });

    setShowDayWiseForm(false);
  };

  const addDayWiseItem = () => {
    setDayWiseData({
      ...dayWiseData,
      items: [
        ...dayWiseData.items,
        { amount: 0, category: "", description: "", timeOFDay: "morning" },
      ],
    });
  };

  const removeDayWiseItem = (index) => {
    setDayWiseData({
      ...dayWiseData,
      items: dayWiseData.items.filter((_, i) => i !== index),
    });
  };

  const updateDayWiseItem = (index, field, value) => {
    const newItems = [...dayWiseData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setDayWiseData({ ...dayWiseData, items: newItems });
  };

  const calculateDayWiseTotal = () => {
    return dayWiseData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const isValidDayWiseForm = () => {
    const totalCalculated = calculateDayWiseTotal();
    const totalExpected = parseFloat(dayWiseData.totalAmount) || 0;
    return (
      Math.abs(totalCalculated - totalExpected) <= 0.01 &&
      dayWiseData.items.length > 0 &&
      dayWiseData.bankAccount &&
      dayWiseData.items.every(
        (item) => item.category && item.description && item.amount > 0
      )
    );
  };

  const toggleGroupExpansion = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (expandedGroups.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleDeleteGroup = (groupId) => {
    const groupTransactions = filteredTransactions.groups.get(groupId);
    if (!groupTransactions) return;

    if (
      confirm(
        `Are you sure you want to delete all ${groupTransactions.length} transactions in this day-wise group?`
      )
    ) {
      groupTransactions.forEach((transaction) => {
        deleteTransaction(transaction.id);
      });
    }
  };

  //! Filter and search transactions
  const filteredTransactions = useMemo(() => {
    const groups = new Map();
    const standalone = [];

    transactions.forEach((transaction) => {
      if (transaction.dayWiseGroupId) {
        if (!groups.has(transaction.dayWiseGroupId)) {
          groups.set(transaction.dayWiseGroupId, []);
        }
        groups.get(transaction.dayWiseGroupId).push(transaction);
      } else {
        standalone.push(transaction);
      }
    });

    const filteredStandalone = standalone.filter((transaction) => {
      const matchesSearch =
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || transaction.type === filterType;
      const matchesStatus =
        filterStatus === "all" ||
        transaction.transactionStatus === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

    return { groups, standalone: filteredStandalone };
  }, [transactions, searchTerm, filterType, filterStatus]);

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
      bankAccount: formData.bankAccount || null,
      description: formData.description.trim(),
      date: formData.date,
      transactionStatus: formData.transactionStatus,
      transactionMethod: formData.transactionMethod,
      notes: formData.notes.trim(),
      timeOFDay: formData.timeOFDay,
      dailyTransactions: formData.dailyTransactions,
      dayWiseGroupId: formData.dayWiseGroupId,
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
      category: transaction.category?._id || "",
      bankAccount: transaction.bankAccount?._id || "",
      description: transaction.description || "",
      date: new Date(transaction.date).toISOString().split("T")[0],
      transactionMethod: transaction.transactionMethod || "googlepay",
      transactionStatus: transaction.transactionStatus || "pending",
      notes: transaction.notes || "",
      timeOFDay: transaction.timeOFDay || "morning",
      dailyTransactions: transaction.dailyTransactions || [],
      dayWiseGroupId: transaction.dayWiseGroupId || "",
    });
    setShowForm(true);
  };

  //! Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  // !Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  //! Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      setErrors({});
      const response = await AXIOS_INSTANCE.get(API_ENDPOINTS.CATEGORY.GET_ALL);
      if (response.status !== 200) {
        throw new Error("Failed to fetch categories");
      }
      const categoriesList = response.data?.data || [];
      console.log("Categories:", categoriesList);
      setCategories(categoriesList);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setErrors({
        general:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch categories",
      });
    } finally {
      setLoading(false);
    }
  };

  //! Fetch bank accounts
  const fetchBankAccounts = async () => {
    setLoading(true);
    try {
      setErrors({});
      const response = await AXIOS_INSTANCE.get(API_ENDPOINTS.BANK.GET_ALL);
      if (response.status !== 200) {
        throw new Error("Failed to fetch bank accounts");
      }
      console.log("Bank Accounts:", response.data?.data);
      const bankAccountsList = response.data?.data || [];
      setBankAccounts(bankAccountsList);
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
      setErrors({
        general:
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch bank accounts",
      });
    } finally {
      setLoading(false);
    }
  };

  //! Fetch transactions on mount
  useEffect(() => {
    handleGetTransactions();
    fetchCategories();
    fetchBankAccounts();
  }, []);

  return (
    <div className="w-full mx-auto space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Transaction Management
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Track your income and expenses effortlessly
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary transition-all shadow-md disabled:opacity-50"
            disabled={loading}
          >
            ➕ Add Transaction
          </button>
          <button
            onClick={() => setShowDayWiseForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50"
            disabled={loading}
          >
            ➕ Add Day-Wise Transaction
          </button>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTransaction(null);
          resetFormData();
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        editingTransaction={editingTransaction}
        categories={categories}
        bankAccounts={bankAccounts}
        loading={loading}
      />

      {/* Day-wise Transaction Form Modal */}
      {showDayWiseForm && (
        <div className="fixed inset-0 h-full bg-transparent backdrop-blur  bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Add Day-wise Transactions
            </h3>
            <form onSubmit={handleDayWiseSubmit} className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-accent/30 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={dayWiseData.type}
                    onChange={(e) =>
                      setDayWiseData({
                        ...dayWiseData,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={dayWiseData.date}
                    onChange={(e) =>
                      setDayWiseData({ ...dayWiseData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={dayWiseData.totalAmount}
                    onChange={(e) =>
                      setDayWiseData({
                        ...dayWiseData,
                        totalAmount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                    placeholder="100.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Account
                </label>
                <select
                  value={dayWiseData.bankAccount}
                  onChange={(e) =>
                    setDayWiseData({
                      ...dayWiseData,
                      bankAccount: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select account</option>
                  {bankAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transaction Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-card-foreground">
                    Transaction Breakdown
                  </h4>
                  <button
                    type="button"
                    onClick={addDayWiseItem}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    ➕ Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {dayWiseData.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg bg-card"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.amount || ""}
                            onChange={(e) =>
                              updateDayWiseItem(
                                index,
                                "amount",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                            placeholder="40.00"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) =>
                              updateDayWiseItem(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                            required
                          >
                            <option value="">Select category</option>
                            {categories
                              // .filter((c) => c.type === dayWiseData.type)
                              .map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.name}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <input
                            value={item.description}
                            onChange={(e) =>
                              updateDayWiseItem(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                            placeholder="Food at home"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Time of Day
                          </label>
                          <select
                            value={item.timeOFDay}
                            onChange={(e) =>
                              updateDayWiseItem(
                                index,
                                "timeOFDay",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                            required
                          >
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                            <option value="night">Night</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeDayWiseItem(index)}
                            className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {dayWiseData.items.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">
                      No items added yet. Click "Add Item" to start.
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {dayWiseData.items.length > 0 && (
                <div className="p-4 bg-accent/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Calculated Total:</span>
                    <span className="text-lg font-bold">
                      ₹{calculateDayWiseTotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Expected Total:</span>
                    <span className="text-lg font-bold">
                      ₹{(parseFloat(dayWiseData.totalAmount) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border">
                    <span className="font-medium">Difference:</span>
                    <span
                      className={`text-lg font-bold ${
                        Math.abs(
                          calculateDayWiseTotal() -
                            (parseFloat(dayWiseData.totalAmount) || 0)
                        ) <= 0.01
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹
                      {Math.abs(
                        calculateDayWiseTotal() -
                          (parseFloat(dayWiseData.totalAmount) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDayWiseForm(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValidDayWiseForm()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create {dayWiseData.items.length} Transactions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        <Card className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <CardHeader className="flex flex-row items-center space-x-3">
            <span className="p-2 bg-green-100 rounded-full">
              <ArrowUpCircle className="text-green-600 w-6 h-6" />
            </span>
            <CardTitle className="text-lg font-semibold">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">
              ₹{totalIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <CardHeader className="flex flex-row items-center space-x-3">
            <span className="p-2 bg-red-100 rounded-full">
              <ArrowDownCircle className="text-red-600 w-6 h-6" />
            </span>
            <CardTitle className="text-lg font-semibold">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">
              ₹{totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br ${
            netBalance >= 0
              ? "from-green-50 to-white border-green-100"
              : "from-red-50 to-white border-red-100"
          } border rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all`}
        >
          <CardHeader className="flex flex-row items-center space-x-3">
            <span
              className={`p-2 rounded-full ${
                netBalance >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Wallet
                className={`w-6 h-6 ${
                  netBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </span>
            <CardTitle className="text-lg font-semibold">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                netBalance >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              ₹{Math.abs(netBalance).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <CardHeader className="flex flex-row items-center space-x-3">
            <span className="p-2 bg-blue-100 rounded-full">
              <List className="text-purple-600 w-6 h-6" />
            </span>
            <CardTitle className="text-lg font-semibold">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-700">
              {transactions.length}
            </p>
          </CardContent>
        </Card>
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
              <option value="pending">Pending</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
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
                {Array.from(filteredTransactions.groups.entries())
                  .sort(
                    ([, a], [, b]) =>
                      new Date(b[0].date).getTime() -
                      new Date(a[0].date).getTime()
                  )
                  .map(([groupId, groupTransactions]) => {
                    const totalAmount = groupTransactions.reduce(
                      (sum, t) => sum + t.amount,
                      0
                    );
                    const representativeTransaction = groupTransactions[0];
                    const isExpanded = expandedGroups.has(groupId);

                    return (
                      <React.Fragment key={groupId}>
                        <tr
                          className="hover:bg-accent/50 transition-colors cursor-pointer bg-primary/5 dark:bg-primary/10"
                          onClick={() => toggleGroupExpansion(groupId)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground font-medium">
                            {new Date(
                              representativeTransaction.date
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-primary">
                                  {isExpanded ? "⬇️" : "➡️"}
                                </span>
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    representativeTransaction.type === "income"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                <span className="text-sm text-card-foreground font-medium">
                                  Day Wise Transaction Summary
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                              DayWise ({groupTransactions.length} items)
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {representativeTransaction.bankAccount?.name ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">
                            {representativeTransaction.transactionMethod ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                representativeTransaction.transactionStatus ===
                                "successful"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : representativeTransaction.transactionStatus ===
                                    "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : representativeTransaction.transactionStatus ===
                                    "failed"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {representativeTransaction.transactionStatus ||
                                "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-sm font-bold ${
                                representativeTransaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {representativeTransaction.type === "income"
                                ? "+"
                                : "-"}
                              ₹{totalAmount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(
                                    "Group edit functionality can be implemented here"
                                  );
                                }}
                                className="text-primary hover:text-primary/80 transition-colors p-2 rounded-full hover:bg-blue-100"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteGroup(groupId);
                                }}
                                className="text-red-600 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded &&
                          groupTransactions
                            .sort(
                              (a, b) =>
                                new Date(a.date).getTime() -
                                new Date(b.date).getTime()
                            )
                            .map((transaction) => (
                              <tr
                                key={transaction.id}
                                className="bg-accent/20 hover:bg-accent/40 transition-colors"
                              >
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-muted-foreground pl-12">
                                  <div>
                                    {new Date(
                                      transaction.date
                                    ).toLocaleDateString()}
                                    {transaction.timeOFDay && (
                                      <div className="text-xs text-muted-foreground capitalize">
                                        {transaction.timeOFDay}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex items-center pl-8">
                                    <div
                                      className={`h-2 w-2 rounded-full mr-3 ${
                                        transaction.type === "income"
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    />
                                    <div>
                                      <div className="text-sm text-card-foreground">
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
                                <td className="px-6 py-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                      transaction.type === "income"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }`}
                                  >
                                    {transaction.category?.name || "N/A"}
                                  </span>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                  <div className="flex flex-col items-center justify-center">
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                        transaction.bankAccount
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {transaction.bankAccount?.name?.toUpperCase() ||
                                        "N/A"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {transaction.bankAccount?.accountNumber ||
                                        "N/A"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm text-muted-foreground capitalize">
                                  {transaction.transactionMethod || "N/A"}
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                      transaction.transactionStatus ===
                                      "successful"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : transaction.transactionStatus ===
                                          "pending"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                        : transaction.transactionStatus ===
                                          "failed"
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                    }`}
                                  >
                                    {transaction.transactionStatus || "Unknown"}
                                  </span>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                  <span
                                    className={`text-sm font-medium ${
                                      transaction.type === "income"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {transaction.type === "income" ? "+" : "-"}₹
                                    {transaction.amount?.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
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
                                      onClick={() =>
                                        handleDelete(transaction.id)
                                      }
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
                      </React.Fragment>
                    );
                  })}
                {filteredTransactions.standalone
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
                          {transaction.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                              transaction.bankAccount
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {transaction.bankAccount?.name?.toUpperCase() ||
                              "N/A"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {transaction.bankAccount?.accountNumber || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">
                        {transaction.transactionMethod || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.transactionStatus === "successful"
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
                          {transaction.amount?.toLocaleString()}
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
            {filteredTransactions.standalone.length === 0 &&
              filteredTransactions.groups.size === 0 && (
                <div className="text-center py-16">
                  <span className="text-5xl">📊</span>
                  <h3 className="mt-6 text-xl font-semibold text-card-foreground">
                    No transactions found
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    {searchTerm ||
                    filterType !== "all" ||
                    filterStatus !== "all"
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
