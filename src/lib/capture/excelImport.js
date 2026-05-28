import * as XLSX from "xlsx";
import { EXCEL_CONFIGS } from "./captureConfigs";

const normalizeHeader = (h) =>
  String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

function mapHeaderToKey(header, columns) {
  const n = normalizeHeader(header);
  for (const col of columns) {
    if (col.key.toLowerCase() === n) return col.key;
    if (col.aliases.some((a) => normalizeHeader(a) === n)) return col.key;
  }
  return null;
}

export function parseExcelFile(file, captureType) {
  return new Promise((resolve, reject) => {
    const config = EXCEL_CONFIGS[captureType];
    if (!config) {
      reject(new Error("Unknown capture type"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const rows = rawRows.map((raw) => {
          const mapped = {};
          Object.entries(raw).forEach(([header, value]) => {
            const key = mapHeaderToKey(header, config.columns);
            if (key) mapped[key] = value;
          });
          return mapped;
        });

        resolve(rows.filter((r) => Object.keys(r).length > 0));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

export function downloadExcelTemplate(captureType) {
  const config = EXCEL_CONFIGS[captureType];
  if (!config) return;

  const ws = XLSX.utils.aoa_to_sheet([config.templateHeaders]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  XLSX.writeFile(wb, `${captureType}-import-template.xlsx`);
}

/** Resolve category name to _id from list */
export function resolveCategoryId(categoryValue, categories = []) {
  if (!categoryValue) return "";
  const str = String(categoryValue).trim();
  const byId = categories.find((c) => c._id === str);
  if (byId) return byId._id;
  const byName = categories.find(
    (c) => c.name?.toLowerCase() === str.toLowerCase()
  );
  return byName?._id || "";
}

export function mapRowToFormData(row, captureType, { categories = [] } = {}) {
  const data = { ...row };

  if (captureType === "transaction" || captureType === "product") {
    if (data.category) {
      data.category = resolveCategoryId(data.category, categories);
    }
  }

  if (captureType === "transaction") {
    if (data.category) {
      data.category = resolveCategoryId(data.category, categories);
      const catType = categories.find((c) => c._id === data.category)?.type;
      if (catType) data.type = catType;
    }
    if (data.amount != null) data.amount = String(data.amount);
    if (data.date) {
      const d = new Date(data.date);
      if (!isNaN(d)) data.date = d.toISOString().split("T")[0];
    }
  }

  if (captureType === "product") {
    if (data.estimatedPrice != null) {
      data.estimatedPrice = String(data.estimatedPrice);
    }
    if (!data.status) data.status = "active";
  }

  if (captureType === "category") {
    if (data.name && !data.categoryName) data.categoryName = data.name;
    if (data.type) {
      const t = String(data.type).toLowerCase();
      data.type = t.includes("income") ? "income" : "expense";
    } else {
      data.type = "expense";
    }
  }

  if (captureType === "bank") {
    if (data.amount != null) data.amount = String(data.amount);
    if (!data.accountType) data.accountType = "primary";
  }

  if (captureType === "task") {
    if (data.progress != null) data.progress = parseInt(data.progress, 10) || 0;
  }

  return data;
}
