/**
 * Parse scanned QR / barcode text into form field updates
 */
export function parseScanResult(text, captureType) {
  const trimmed = (text || "").trim();
  if (!trimmed) return {};

  let parsed = null;
  try {
    if (trimmed.startsWith("{")) {
      parsed = JSON.parse(trimmed);
    }
  } catch {
    parsed = null;
  }

  if (parsed && typeof parsed === "object") {
    return mapParsedObject(parsed, captureType);
  }

  return mapPlainText(trimmed, captureType);
}

function mapParsedObject(obj, captureType) {
  const lower = {};
  Object.entries(obj).forEach(([k, v]) => {
    lower[k.toLowerCase()] = v;
  });

  switch (captureType) {
    case "transaction":
      return {
        ...(lower.amount != null && { amount: String(lower.amount) }),
        ...(lower.description && { description: String(lower.description) }),
        ...(lower.notes && { notes: String(lower.notes) }),
        ...(lower.type && {
          type: String(lower.type).toLowerCase().includes("income")
            ? "income"
            : "expense",
        }),
        ...(lower.date && { date: formatDate(lower.date) }),
      };
    case "product":
      return {
        ...(lower.name && { name: String(lower.name) }),
        ...(lower.description && { description: String(lower.description) }),
        ...(lower.estimatedprice != null && {
          estimatedPrice: String(lower.estimatedprice ?? lower.price),
        }),
        ...(lower.sku && { description: `SKU: ${lower.sku}` }),
      };
    case "category":
      return {
        ...(lower.name && { categoryName: String(lower.name) }),
        ...(lower.description && { description: String(lower.description) }),
        ...(lower.type && {
          type: String(lower.type).toLowerCase().includes("income")
            ? "income"
            : "expense",
        }),
      };
    case "bank":
      return {
        ...(lower.name && { name: String(lower.name) }),
        ...(lower.accountnumber && {
          accountNumber: String(lower.accountnumber),
        }),
        ...(lower.ifsc && { ifsc: String(lower.ifsc) }),
      };
    case "task":
      return {
        ...(lower.title && { title: String(lower.title) }),
        ...(lower.description && { description: String(lower.description) }),
      };
    default:
      return { description: JSON.stringify(obj) };
  }
}

function mapPlainText(text, captureType) {
  const amountMatch = text.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d{1,2})?)/i);

  switch (captureType) {
    case "transaction":
      return {
        description: text.slice(0, 200),
        ...(amountMatch && {
          amount: amountMatch[1].replace(/,/g, ""),
        }),
        notes: `Scanned: ${text.slice(0, 200)}`,
      };
    case "product":
      return {
        name: text.slice(0, 120),
        description: `Barcode/QR: ${text}`,
      };
    case "category":
      return {
        categoryName: text.slice(0, 80),
        description: `Scanned: ${text}`,
        type: "expense",
      };
    case "bank":
      return {
        accountNumber: text.replace(/\D/g, "").slice(0, 20) || text.slice(0, 30),
        name: text.slice(0, 80),
      };
    case "task":
      return {
        title: text.slice(0, 100),
        description: `Scanned: ${text}`,
      };
    default:
      return { description: text };
  }
}

function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString().split("T")[0];
}
