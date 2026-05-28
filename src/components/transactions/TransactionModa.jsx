import React from "react";
import FormCaptureToolbar from "@/components/capture/FormCaptureToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getTypeForCategory,
  formatCategoryOptionLabel,
} from "@/lib/categoryUtils";

const transactionMethods = [
  { value: "cash", label: "Cash" },
  { value: "googlepay", label: "Google Pay" },
  { value: "phonepe", label: "PhonePe" },
  { value: "paytm", label: "Paytm" },
  { value: "netbanking", label: "Net Banking" },
  { value: "debitcard", label: "Debit Card" },
  { value: "creditcard", label: "Credit Card" },
  { value: "other", label: "Other" },
];

const transactionStatuses = [
  { value: "pending", label: "Pending" },
  { value: "successful", label: "Successful" },
  { value: "failed", label: "Failed" },
];

const timeOfDayOptions = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
  { value: "evening", label: "Evening (6 PM - 10 PM)" },
  { value: "night", label: "Night (10 PM - 6 AM)" },
];

const fieldClass =
  "w-full px-4 py-3 bg-input-background border-4 border-[var(--neo-black)] rounded-[var(--neo-radius-sm)] font-medium shadow-[3px_3px_0_0_var(--neo-black)] focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_var(--neo-black)]";

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
  onBulkImport,
  onCategoryChange,
}) => {
  if (!isOpen) return null;

  const resolvedType = formData.category
    ? getTypeForCategory(categories, formData.category)
    : null;

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const type = getTypeForCategory(categories, categoryId);
    const next = { ...formData, category: categoryId };
    if (type) next.type = type;
    setFormData(next);
    onCategoryChange?.(categoryId, type);
  };

  return (
    <div className="fixed inset-0 bg-[var(--neo-black)]/50 flex items-center justify-center p-4 z-50">
      <div className="neo-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h3 className="text-xl font-bold">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Income or expense is set automatically from the category you pick.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="button" onClick={onSubmit} disabled={loading}>
              {loading
                ? "Processing..."
                : editingTransaction
                  ? "Update"
                  : "Add"}
            </Button>
          </div>
        </div>

        <FormCaptureToolbar
          captureType="transaction"
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onBulkImport={onBulkImport}
          disabled={loading}
        />

        {errors.general && (
          <div className="text-destructive text-sm font-medium mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {resolvedType && (
            <div className="flex items-center gap-2 p-3 rounded-[12px] border-4 border-[var(--neo-black)] bg-muted/40">
              <span className="text-sm font-bold">Transaction type:</span>
              <Badge
                variant={resolvedType === "income" ? "accent" : "secondary"}
              >
                {resolvedType === "income" ? "Income" : "Expense"}
              </Badge>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className={`${fieldClass} ${errors.category ? "border-destructive" : ""}`}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {formatCategoryOptionLabel(category)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-destructive text-sm mt-1">{errors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Amount *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className={`${fieldClass} ${errors.amount ? "border-destructive" : ""}`}
                placeholder="0.00"
                required
              />
              {errors.amount && (
                <p className="text-destructive text-sm mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Bank Account</label>
            <select
              value={formData.bankAccount}
              onChange={(e) =>
                setFormData({ ...formData, bankAccount: e.target.value })
              }
              className={fieldClass}
            >
              <option value="">Select account (optional)</option>
              {bankAccounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.name} ({account.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Description *</label>
            <input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`${fieldClass} ${errors.description ? "border-destructive" : ""}`}
              placeholder="Transaction description"
              maxLength={200}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className={fieldClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Time of Day</label>
              <select
                value={formData.timeOFDay}
                onChange={(e) =>
                  setFormData({ ...formData, timeOFDay: e.target.value })
                }
                className={fieldClass}
              >
                {timeOfDayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">
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
                className={fieldClass}
                required
              >
                <option value="">Select method</option>
                {transactionMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Status</label>
              <select
                value={formData.transactionStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    transactionStatus: e.target.value,
                  })
                }
                className={fieldClass}
              >
                {transactionStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className={fieldClass}
              placeholder="Additional notes (optional)"
              rows={3}
              maxLength={500}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
