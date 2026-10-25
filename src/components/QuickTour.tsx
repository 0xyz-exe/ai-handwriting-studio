import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Hand,
  HelpCircle,
  Layers,
  PenTool,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface TourStep {
  title: string;
  tag: string;
  description: string;
  highlight: string;
  icon: React.ElementType;
  badgeColor: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Editor Teks & Multi-Alat Tulis',
    tag: 'Langkah 1: Menulis & Memberi Gaya',
    description:
      'Ketik atau paste materi tugas di editor kiri. Kamu bisa mengombinasikan Bolpoin Biru untuk judul, Bolpoin Hitam untuk isi catatan, Bolpoin Merah untuk kata penting, Pensil 2B untuk sketsa, serta Stabilo Kuning untuk highlight penting.',
    highlight:
      '💡 Tips: Cukup blok teks yang diinginkan di editor, lalu klik tombol alat tulis di atas editor untuk menerapkan warna/tekstur secara instan.',
    icon: PenTool,
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    title: 'Kanvas Kertas & Geser Bebas (Free-Drag)',
    tag: 'Langkah 2: Navigasi & Tampilan',
    description:
      'Kanvas di tengah mensimulasikan kertas asli secara realistis. Kamu bisa memilih mode 1 Halaman, 2 Halaman Berdampingan (buku tulis terbuka), atau Semua Halaman. Kursor mouse kini mendukung geser bebas (drag-to-pan).',
    highlight:
      '🖐️ Tips: Klik dan tahan mouse di mana saja pada area abu-abu atau kertas, lalu geser mouse untuk memindahkan posisi kertas dengan leluasa layaknya di atas meja.',
    icon: Hand,
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    title: '10 Koleksi Kertas & Warna Garis Beragam',
    tag: 'Langkah 3: Pilihan Kertas & Garis',
    description:
      'Tersedia 10 jenis buku tulis standar pelajar & akademisi (Buku SIDU Sekolah, Double Folio, Loose Leaf Binder, Kotak Matematika, Lembar Ujian Resmi, dll). Garis buku (ruled lines) juga memiliki beragam warna khas dan tingkat kepekatan yang dapat diatur.',
    highlight:
      '📐 Tips: Kamu bisa mematikan garis melalui tombol "Garis: Mati" di atas kanvas agar kertas bersih tanpa garis yang mengganggu, atau ubah warnanya menjadi abu-abu/sepia lembut.',
    icon: Layers,
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  {
    title: 'AI Catatan Studio & OCR Foto Dokumen',
    tag: 'Langkah 4: Asisten Otomatis',
    description:
      'Gunakan tombol "AI Catatan" untuk merapikan struktur catatan secara otomatis, memperbaiki ejaan & tanda baca (PUEBI), membuat rangkuman inti, atau memformat soal & jawaban. Tombol "Import/OCR" siap mengekstrak teks langsung dari file Word (.docx) atau foto soal.',
    highlight:
      '✨ Tips: Fitur AI dilengkapi fallback cerdas sehingga tetap bisa digunakan secara offline tanpa perlu memasukkan API key berbayar.',
    icon: Sparkles,
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    title: 'Ekspor Dokumen PDF & Siap Cetak',
    tag: 'Langkah 5: Cetak & Selesai',
    description:
      'Setelah catatan selesai, klik tombol "Ekspor PDF" di pojok kanan atas. Dokumen akan di-render dalam ukuran kertas fisik asli (A4, A5, Folio/F4) dengan ketajaman tinggi, siap dikumpulkan ke guru, dosen, atau dicetak langsung ke printer.',
    highlight:
      '📄 Tips: Kamu juga bisa mengekspor dalam format gambar PNG resolusi tinggi per halaman untuk diunggah ke Google Classroom atau WhatsApp.',
    icon: Download,
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
];

interface QuickTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickTour: React.FC<QuickTourProps> = ({ isOpen, onClose }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        setStepIndex((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[stepIndex];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">
              Panduan Cepat AI Handwriting Studio
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="p-6 space-y-4">
          {/* Badge & Step indicator */}
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${currentStep.badgeColor}`}
            >
              {currentStep.tag}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {stepIndex + 1} / {TOUR_STEPS.length}
            </span>
          </div>

          {/* Title & Icon */}
          <div className="flex items-center space-x-3 pt-1">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">
              {currentStep.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed pt-1">
            {currentStep.description}
          </p>

          {/* Highlight Callout */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
            {currentStep.highlight}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 pt-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === stepIndex ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Langkah ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Lewati Panduan
          </button>

          <div className="flex items-center space-x-2">
            {stepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center space-x-1.5"
            >
              {stepIndex === TOUR_STEPS.length - 1 ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Selesai & Mulai Menulis</span>
                </>
              ) : (
                <>
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
