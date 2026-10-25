import { Check, Copy, RefreshCw, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  onApply: (newContent: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  currentContent,
  onApply,
}) => {
  const [action, setAction] = useState<
    'clean_notes' | 'grammar_check' | 'summarize' | 'format_qa' | 'student_paraphrase' | 'custom'
  >('clean_notes');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [providerUsed, setProviderUsed] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          content: currentContent,
          customPrompt,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        setProviderUsed(data.provider);
      }
    } catch (err) {
      console.error('AI error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Catatan Studio</h3>
              <p className="text-xs text-slate-500">
                Rapikan catatan, perbaiki ejaan, buat rangkuman, atau sesuaikan gaya tulisan.
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Action Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Tindakan AI:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'clean_notes', label: '🧹 Rapikan Struktur Catatan' },
                { id: 'grammar_check', label: '✍️ Perbaiki Ejaan (PUEBI)' },
                { id: 'summarize', label: '📌 Buat Rangkuman Inti' },
                { id: 'format_qa', label: '📝 Format Soal & Pembahasan' },
                { id: 'student_paraphrase', label: '🎓 Parafrase Gaya Siswa' },
                { id: 'custom', label: '💬 Perintah Kustom...' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setAction(btn.id as any)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                    action === btn.id
                      ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {action === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instruksi Khusus untuk AI:
              </label>
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Contoh: Ubah menjadi format poin-poin dengan judul biru..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            </div>
          )}

          {/* Trigger button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg flex items-center justify-center space-x-2 transition-all shadow-sm shadow-purple-200"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sedang Memproses AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mulai Pengolahan AI</span>
              </>
            )}
          </button>

          {/* Diff / Comparison View */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Teks Asli:
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {currentContent}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
                    Hasil Rekomendasi AI:
                  </span>
                  {providerUsed && (
                    <span className="text-[10px] text-slate-400">
                      {providerUsed === 'heuristic-offline' ? 'Offline Mode' : 'AI Mode'}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-lg text-xs font-mono text-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Batal
          </button>

          {result && (
            <button
              onClick={() => {
                onApply(result);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Gunakan Hasil Ini di Editor</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
