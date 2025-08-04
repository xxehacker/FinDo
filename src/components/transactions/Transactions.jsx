import React from "react";

const Transactions = ({
  transactions,
  showForm,
  setShowForm,
  editingTransaction,
  setEditingTransaction,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  formData,
  setFormData,
  categories,
  bankAccounts,
  addTransaction,
  updateTransaction,
  deleteTransaction,
}) => {
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      bankAccount: formData.bankAccount,
      description: formData.description,
      date: formData.date,
    };
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
      setEditingTransaction(null);
    } else {
      addTransaction(transactionData);
    }
    setShowForm(false);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Transaction Management
          </h1>
          <p className="text-muted-foreground">
            Track your income and expenses
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          ➕ Add Transaction
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bank Account
                </label>
                <select
                  value={formData.bankAccount}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccount: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select account</option>
                  {bankAccounts.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  placeholder="Transaction description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                  }}
                  className="px-4 py-2 text-muted-foreground hover:text-card-foreground border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingTransaction ? "Update" : "Add"} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-3xl">📈</span>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ₹
                {transactions
                  .filter((t) => t.type === "income")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-red-500 text-3xl">📉</span>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                ₹
                {transactions
                  .filter((t) => t.type === "expense")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <span className="text-blue-500 text-3xl">#</span>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-card-foreground">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
                .map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ₹{transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-sm text-card-foreground">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ₹{transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
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
            <div className="text-center py-12">
              <span className="text-6xl">📊</span>
              <h3 className="mt-4 text-lg font-medium text-card-foreground">
                No transactions found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by adding your first transaction."}
              </p>
              {!searchTerm && filterType === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Add Transaction
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
