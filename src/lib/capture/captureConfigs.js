/** Column aliases for Excel import per entity type */

export const CAPTURE_TYPES = [
  "transaction",
  "product",
  "category",
  "bank",
  "task",
];

export const EXCEL_CONFIGS = {
  transaction: {
    label: "Transaction",
    columns: [
      { key: "amount", aliases: ["amount", "price", "value", "total"] },
      {
        key: "description",
        aliases: ["description", "desc", "title", "name", "details"],
      },
      { key: "category", aliases: ["category", "category name", "cat"] },
      { key: "date", aliases: ["date", "transaction date", "txn date"] },
      { key: "notes", aliases: ["notes", "note", "remarks"] },
      {
        key: "transactionMethod",
        aliases: ["method", "payment method", "transaction method"],
      },
    ],
    templateHeaders: [
      "amount",
      "description",
      "category",
      "date",
      "notes",
      "transactionMethod",
    ],
  },
  product: {
    label: "Product",
    columns: [
      { key: "name", aliases: ["name", "product", "product name", "title"] },
      { key: "description", aliases: ["description", "desc", "details"] },
      { key: "category", aliases: ["category", "category name", "cat"] },
      {
        key: "estimatedPrice",
        aliases: ["estimatedprice", "price", "amount", "cost"],
      },
      { key: "status", aliases: ["status", "active"] },
    ],
    templateHeaders: [
      "name",
      "description",
      "category",
      "estimatedPrice",
      "status",
    ],
  },
  category: {
    label: "Category",
    columns: [
      { key: "categoryName", aliases: ["name", "category", "category name"] },
      { key: "description", aliases: ["description", "desc"] },
      { key: "type", aliases: ["type", "income/expense", "transaction type"] },
      { key: "status", aliases: ["status"] },
    ],
    templateHeaders: ["categoryName", "description", "type", "status"],
  },
  bank: {
    label: "Bank",
    columns: [
      { key: "name", aliases: ["name", "bank", "bank name"] },
      { key: "ifsc", aliases: ["ifsc", "ifsc code"] },
      { key: "branch", aliases: ["branch", "branch name"] },
      {
        key: "accountNumber",
        aliases: ["accountnumber", "account", "account no", "a/c"],
      },
      { key: "amount", aliases: ["amount", "balance"] },
      { key: "accountType", aliases: ["accounttype", "type"] },
    ],
    templateHeaders: [
      "name",
      "ifsc",
      "branch",
      "accountNumber",
      "amount",
      "accountType",
    ],
  },
  task: {
    label: "Task",
    columns: [
      { key: "title", aliases: ["title", "task", "name"] },
      { key: "description", aliases: ["description", "desc"] },
      { key: "priority", aliases: ["priority"] },
      { key: "status", aliases: ["status"] },
      { key: "progress", aliases: ["progress", "%"] },
      { key: "dueDate", aliases: ["duedate", "due date", "due"] },
    ],
    templateHeaders: [
      "title",
      "description",
      "priority",
      "status",
      "progress",
      "dueDate",
    ],
  },
};
