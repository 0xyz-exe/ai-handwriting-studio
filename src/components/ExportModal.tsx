import { PaperSize } from '@/types';
import { exportCanvasToImage, exportPagesToPdf } from '@/lib/exporter';
import { Download, FileDown, FileImage, Printer, X } from 'lucide-react';
import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvases: HTMLCanvasElement[];
  paperSize: PaperSize;
  projectTitle: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  canvases,
  paperSize,
  projectTitle,
}) => {
  const [filename, setFilename] = useState(
    projectTitle ? projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'catatan-tulisan-tangan'
  );
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      await exportPagesToPdf(canvases, paperSize, `${filename}.pdf`);
      onClose();
    } catch (err: any) {
      alert('Gagal mengekspor PDF: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleExportImages = () => {
    canvases.forEach((canvas, idx) => {
      exportCanvasToImage(canvas, 'png', `${filename}-halaman-${idx + 1}.png`);
    });
    onClose();
  };

  const handleDirectPrint = () => {
    if (canvases.length === 0) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.title = `${filename} - Print Mode`;
    const style = printWindow.document.createElement('style');
    style.textContent = `@page { margin: 0; size: auto; } body { margin: 0; padding: 0; background: #fff; } img { width: 100%; max-width: 100%; display: block; page-break-after: always; }`;
    printWindow.document.head.appendChild(style);

    canvases.forEach((c) => {
      const img = printWindow.document.createElement('img');
      img.src = c.toDataURL('image/jpeg', 0.95);
      printWindow.document.body.appendChild(img);
    });

    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Ekspor & Cetak Dokumen</h3>
              <p className="text-xs text-slate-500">
                Pilih format dokumen untuk tugas sekolah atau kuliah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Nama File Dokumen:
            </label>
            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <span className="text-slate-400 font-mono">.pdf / .png</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-slate-700">Ukuran Kertas Target:</span>
            <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
              {paperSize}
            </span>
          </div>

          {/* Action options */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center space-x-2.5">
                <FileDown className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">Unduh Dokumen PDF</div>
                  <div className="text-[10px] text-indigo-100">
                    Sesuai ukuran kertas {paperSize} asli ({canvases.length} halaman)
                  </div>
                </div>
              </div>
              <span className="text-xs bg-indigo-500/50 px-2 py-1 rounded">Rekomendasi</span>
            </button>

            <button
              onClick={handleExportImages}
              className="w-full p-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg border border-slate-200 flex items-center space-x-2.5 transition-colors"
            >
              <FileImage className="w-5 h-5 text-slate-600" />
              <div className="text-left">
                <div className="font-bold">Unduh Gambar PNG Resolusi Tinggi</div>
                <div className="text-[10px] text-slate-500">
                  Setiap halaman diekspor menjadi file gambar terpisah
                </div>
              </div>
            </button>

            <button
              onClick={handleDirectPrint}
              className="w-full p-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg border border-slate-200 flex items-center space-x-2.5 transition-colors"
            >
              <Printer className="w-5 h-5 text-slate-600" />
              <div className="text-left">
                <div className="font-bold">Mode Cetak Langsung (Print Mode)</div>
                <div className="text-[10px] text-slate-500">
                  Buka dialog print printer browser untuk cetak langsung ke kertas
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
