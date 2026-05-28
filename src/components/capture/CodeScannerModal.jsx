import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SCANNER_ID = "findo-code-scanner";

const QR_FORMATS = [Html5QrcodeSupportedFormats.QR_CODE];

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.ITF,
];

function CodeScannerModal({ open, mode = "qr", onClose, onScan }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open) return;

    let scanner = null;
    let mounted = true;

    const start = async () => {
      setStarting(true);
      setError("");
      try {
        scanner = new Html5Qrcode(SCANNER_ID, {
          formatsToSupport: mode === "qr" ? QR_FORMATS : BARCODE_FORMATS,
          verbose: false,
        });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decodedText) => {
            if (!mounted) return;
            onScan(decodedText);
            stopScanner(scanner);
            onClose();
          },
          () => {}
        );
      } catch (err) {
        if (mounted) {
          setError(
            err?.message ||
              "Camera access denied or unavailable. Allow camera permission and try again."
          );
        }
      } finally {
        if (mounted) setStarting(false);
      }
    };

    const stopScanner = async (instance) => {
      try {
        const s = instance || scannerRef.current;
        if (s?.isScanning) await s.stop();
        if (s) await s.clear();
      } catch {
        /* ignore cleanup errors */
      }
      scannerRef.current = null;
    };

    const timer = setTimeout(start, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [open, mode, onClose, onScan]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[var(--neo-black)]/60">
      <div className="neo-card w-full max-w-md p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            {mode === "qr" ? "Scan QR Code" : "Scan Barcode"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-[10px] border-4 border-[var(--neo-black)] bg-secondary shadow-[2px_2px_0_0_var(--neo-black)]"
            aria-label="Close scanner"
          >
            <X size={18} />
          </button>
        </div>

        <div
          id={SCANNER_ID}
          className="w-full overflow-hidden rounded-[14px] border-4 border-[var(--neo-black)] bg-black min-h-[280px]"
        />

        {starting && (
          <p className="text-sm font-medium text-muted-foreground mt-3 text-center">
            Starting camera…
          </p>
        )}
        {error && (
          <p className="text-sm font-medium text-destructive mt-3">{error}</p>
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Point your camera at a {mode === "qr" ? "QR code" : "barcode"}. Scan
          fills the form automatically.
        </p>

        <Button variant="outline" className="w-full mt-4" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default CodeScannerModal;
