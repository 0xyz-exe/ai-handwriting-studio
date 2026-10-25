import { extractTextFromDocx, extractTextFromTxt } from '@/lib/docx-importer';
import { extractTextFromImage, OcrProgress } from '@/lib/ocr';
import { Camera, Check, FileText, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportText: (extractedText: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportText }) => {
  const [activeTab, setActiveTab] = useState<'doc' | 'ocr'>('doc');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState('');
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);
  const [ocrLang, setOcrLang] = useState('ind');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setExtracted('');
    setOcrProgress(null);

    try {
      if (file.name.endsWith('.docx')) {
        const text = await extractTextFromDocx(file);
        setExtracted(text);
      } else if (file.name.endsWith('.txt')) {
        const text = await extractTextFromTxt(file);
        setExtracted(text);
      } else if (file.type.startsWith('image/')) {
        // Run Tesseract OCR
        const text = await extractTextFromImage(file, ocrLang, (p) => {
          setOcrProgress(p);
        });
        setExtracted(text);
      }
    } catch (err: any) {
      alert('Gagal mengekstrak file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Import Dokumen atau Foto Soal</h3>
              <p className="text-xs text-slate-500">Mendukung file DOCX, TXT, dan OCR gambar otomatis.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('doc');
              setExtracted('');
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'doc'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Dokumen (DOCX / TXT)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ocr');
              setExtracted('');
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              activeTab === 'ocr'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>OCR Foto Soal / Catatan (Tesseract)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'ocr' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Bahasa Teks pada Foto/Gambar:</span>
                <span className="text-[10px] text-slate-400">Tesseract OCR akan memuat model bahasa yang dipilih</span>
              </div>
              <select
                value={ocrLang}
                onChange={(e) => setOcrLang(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-slate-800 text-xs outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ind">🇮🇩 Bahasa Indonesia</option>
                <option value="eng">🇬🇧 English</option>
                <option value="ind+eng">🌐 Campuran Indo + English</option>
                <option value="ara">🇸🇦 Arabic (العربية)</option>
                <option value="chi_sim">🇨🇳 Chinese Simplified (简体中文)</option>
                <option value="jpn">🇯🇵 Japanese (日本語)</option>
                <option value="kor">🇰🇷 Korean (한국어)</option>
                <option value="fra">🇫🇷 French (Français)</option>
                <option value="spa">🇪🇸 Spanish (Español)</option>
                <option value="deu">🇩🇪 German (Deutsch)</option>
                <option value="rus">🇷🇺 Russian (Русский)</option>
                <option value="por">🇵🇹 Portuguese (Português)</option>
              </select>
            </div>
          )}

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/30 rounded-xl p-8 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={activeTab === 'doc' ? '.docx,.txt' : 'image/*'}
              onChange={handleFileUpload}
              className="hidden"
            />
            {activeTab === 'doc' ? (
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            ) : (
              <ImageIcon className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
            )}
            <p className="text-sm font-semibold text-slate-700">
              {activeTab === 'doc'
                ? 'Klik untuk memilih file DOCX atau TXT'
                : 'Klik untuk mengunggah foto lembar soal / tulisan'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'doc' ? 'File dokumen Word atau teks polos' : 'JPG, PNG, WebP'}
            </p>
          </div>

          {/* OCR Progress Bar */}
          {loading && ocrProgress && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-800">
                <span className="capitalize">{ocrProgress.status}...</span>
                <span>{ocrProgress.progress}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-200"
                  style={{ width: `${ocrProgress.progress}%` }}
                />
              </div>
            </div>
          )}

          {loading && !ocrProgress && (
            <div className="flex items-center justify-center p-6 space-x-2 text-indigo-600 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Mengekstrak teks...</span>
            </div>
          )}

          {/* Extracted Preview */}
          {extracted && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Hasil Teks Terdeteksi:</label>
              <textarea
                value={extracted}
                onChange={(e) => setExtracted(e.target.value)}
                rows={6}
                className="w-full p-3 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            Batal
          </button>
          {extracted && (
            <button
              onClick={() => {
                onImportText(extracted);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Masukkan ke Editor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
