import React, { useState, useEffect } from "react";
import { MainLayout, Transactions } from "@/components";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([
    {
      id: "1",
      type: "income",
      amount: 30000,
      category: "Salary",
      bankAccount: "Checking",
      description: "Monthly salary",
      date: "2025-08-01",
    },
    {
      id: "2",
      type: "expense",
      amount: 5000,
      category: "Groceries",
      bankAccount: "Savings",
      description: "Weekly grocery shopping",
      date: "2025-08-02",
    },
  ]);

  const [categories] = useState([
    { id: "1", name: "Salary", type: "income" },
    { id: "2", name: "Freelance", type: "income" },
    { id: "3", name: "Groceries", type: "expense" },
    { id: "4", name: "Utilities", type: "expense" },
  ]);

  const [bankAccounts] = useState([
    { id: "1", name: "Checking" },
    { id: "2", name: "Savings" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    bankAccount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        bankAccount: editingTransaction.bankAccount,
        description: editingTransaction.description,
        date: editingTransaction.date,
      });
      setShowForm(true);
    } else if (!showForm) {
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        bankAccount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingTransaction, showForm]);

  const addTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id, transactionData) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...transactionData, id } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <MainLayout>
      <Transactions
        transactions={transactions}
        showForm={showForm}
        setShowForm={setShowForm}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        bankAccounts={bankAccounts}
        addTransaction={addTransaction}
        updateTransaction={updateTransaction}
        deleteTransaction={deleteTransaction}
      />
    </MainLayout>
  );
};

export default TransactionsPage;
