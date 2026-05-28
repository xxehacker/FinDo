import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  Camera,
  QrCode,
  Barcode,
  Paperclip,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { parseScanResult } from "@/lib/capture/scanParse";
import { uploadCaptureFile } from "@/lib/capture/uploadFile";
import CodeScannerModal from "./CodeScannerModal";
import ExcelImportModal from "./ExcelImportModal";

/**
 * Quick-capture toolbar: Excel import, photo, QR & barcode scan.
 *
 * @param {string} captureType - transaction | product | category | bank | task
 * @param {object} formData
 * @param {function} setFormData
 * @param {array} [categories] - for Excel category name resolution
 * @param {function} [onBulkImport] - optional bulk rows handler
 * @param {boolean} [disabled]
 */
function FormCaptureToolbar({
  captureType,
  formData,
  setFormData,
  categories = [],
  onBulkImport,
  disabled = false,
}) {
  const photoRef = useRef(null);
  const [excelOpen, setExcelOpen] = useState(false);
  const [scanMode, setScanMode] = useState(null);
  const [uploading, setUploading] = useState(false);

  const mergeForm = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleScan = (text) => {
    const patch = parseScanResult(text, captureType);
    mergeForm(patch);
    toast.success("Scanned data applied to form");
  };

  const handleExcelRow = (mapped) => {
    mergeForm(mapped);
    toast.success("Row applied to form");
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCaptureFile(file);
      const preview = URL.createObjectURL(file);
      mergeForm({
        attachment: url,
        attachmentPreview: preview,
      });
      toast.success("Photo attached");
    } catch (err) {
      toast.error(err.response?.data?.message || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clearAttachment = () => {
    if (formData.attachmentPreview) {
      URL.revokeObjectURL(formData.attachmentPreview);
    }
    mergeForm({ attachment: "", attachmentPreview: "" });
  };

  const attachmentLabel =
    formData.attachment || formData.attachmentPreview ? "Photo attached" : null;

  return (
    <>
      <div className="mb-6 pb-5 border-b-4 border-[var(--neo-black)]">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Quick capture
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={() => setExcelOpen(true)}
          >
            <FileSpreadsheet size={16} />
            Excel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploading}
            onClick={() => photoRef.current?.click()}
          >
            <Camera size={16} />
            {uploading ? "Uploading…" : "Photo"}
          </Button>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhoto}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => setScanMode("qr")}
          >
            <QrCode size={16} />
            QR
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => setScanMode("barcode")}
          >
            <Barcode size={16} />
            Barcode
          </Button>
        </div>

        {attachmentLabel && (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-[12px] border-4 border-[var(--neo-black)] bg-muted/40">
            {formData.attachmentPreview ? (
              <img
                src={formData.attachmentPreview}
                alt="Attachment preview"
                className="h-14 w-14 object-cover rounded-[8px] border-2 border-[var(--neo-black)]"
              />
            ) : (
              <Paperclip size={20} />
            )}
            <span className="text-sm font-semibold flex-1 truncate">
              {attachmentLabel}
            </span>
            <button
              type="button"
              onClick={clearAttachment}
              className="p-1.5 rounded-[8px] border-2 border-[var(--neo-black)] hover:bg-destructive/15"
              aria-label="Remove photo"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <ExcelImportModal
        open={excelOpen}
        onClose={() => setExcelOpen(false)}
        captureType={captureType}
        categories={categories}
        onApplyRow={handleExcelRow}
        onBulkImport={onBulkImport}
      />

      <CodeScannerModal
        open={!!scanMode}
        mode={scanMode}
        onClose={() => setScanMode(null)}
        onScan={handleScan}
      />
    </>
  );
}

export default FormCaptureToolbar;
