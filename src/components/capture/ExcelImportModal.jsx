import { useRef, useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  parseExcelFile,
  mapRowToFormData,
  downloadExcelTemplate,
} from "@/lib/capture/excelImport";
import { EXCEL_CONFIGS } from "@/lib/capture/captureConfigs";

function ExcelImportModal({
  open,
  onClose,
  captureType,
  categories = [],
  onApplyRow,
  onBulkImport,
}) {
  const inputRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config = EXCEL_CONFIGS[captureType];

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const parsed = await parseExcelFile(file, captureType);
      if (!parsed.length) {
        setError("No data rows found in the spreadsheet.");
        setRows([]);
      } else {
        setRows(parsed);
      }
    } catch (err) {
      setError(err.message || "Failed to parse Excel file");
      setRows([]);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const handleApply = (row, index) => {
    const mapped = mapRowToFormData(row, captureType, { categories });
    onApplyRow(mapped, index);
    onClose();
  };

  const handleBulk = () => {
    const mapped = rows.map((r) =>
      mapRowToFormData(r, captureType, { categories })
    );
    onBulkImport?.(mapped);
    onClose();
  };

  if (!open) return null;

  const previewKeys = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--neo-black)]/60">
      <div className="neo-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h3 className="text-lg font-bold">Import from Excel</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-[10px] border-4 border-[var(--neo-black)] bg-secondary shadow-[2px_2px_0_0_var(--neo-black)]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-muted-foreground font-medium mb-4">
          Upload .xlsx, .xls, or .csv for {config?.label || captureType}. First
          row should be column headers.
        </p>

        <div className="flex flex-wrap gap-2 mb-4 shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            {loading ? "Reading…" : "Choose file"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadExcelTemplate(captureType)}
          >
            <Download size={16} />
            Template
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium mb-3">{error}</p>
        )}

        {rows.length > 0 && (
          <div className="flex-1 overflow-auto border-4 border-[var(--neo-black)] rounded-[14px] mb-4">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-bold">#</th>
                  {previewKeys.map((k) => (
                    <th key={k} className="px-3 py-2 text-left font-bold">
                      {k}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t-2 border-[var(--neo-black)]/10 hover:bg-muted/40"
                  >
                    <td className="px-3 py-2 font-bold">{i + 1}</td>
                    {previewKeys.map((k) => (
                      <td key={k} className="px-3 py-2 max-w-[140px] truncate">
                        {String(row[k] ?? "")}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleApply(row, i)}
                      >
                        Use row
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap gap-2 shrink-0">
          {onBulkImport && rows.length > 1 && (
            <Button type="button" onClick={handleBulk}>
              Import all {rows.length} rows
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExcelImportModal;
