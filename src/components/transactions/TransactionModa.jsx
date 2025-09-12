import React from "react";

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

const TransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors = {},
  editingTransaction,
  categories,
  bankAccounts,
  loading,
}) => {
  if (!isOpen) return null;

  console.log("formData", formData);
  console.log("editingTransaction", editingTransaction);
  console.log("categories", categories[0].name);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 h-screen">
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h3 className="text-2xl font-bold text-card-foreground mb-6">
          {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-6">
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
                  // .filter((c) => c.type === formData.type)
                  .map((category) => (
                    <option key={category._id} value={category?.name}>
                      {category?.name}
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
                  <option key={account?._id} value={account?.name}>
                    {account?.name}
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
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
                  errors.transactionMethod ? "border-red-500" : "border-border"
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
              onClick={onClose}
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
  );
};

export default TransactionModal;
