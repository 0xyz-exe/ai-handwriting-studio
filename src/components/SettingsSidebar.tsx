import {
  HandwritingFont,
  HandwritingPreset,
  HandwritingStyleConfig,
  PaperConfig,
  PaperSize,
  PaperType,
  StudentProject,
} from '@/types';
import { HANDWRITING_FONTS, NEATNESS_PRESETS } from '@/lib/fonts';
import { createPaperConfig } from '@/lib/paper-templates';
import {
  Dices,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Grid,
  Layers,
  Music,
  Palette,
  PenTool,
  Settings,
  Sliders,
  Type,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

interface SettingsSidebarProps {
  paperConfig: PaperConfig;
  onUpdatePaperConfig: (config: PaperConfig) => void;
  handwritingConfig: HandwritingStyleConfig;
  onUpdateHandwritingConfig: (config: HandwritingStyleConfig) => void;
  studentMeta: StudentProject['studentMeta'];
  onUpdateStudentMeta: (meta: StudentProject['studentMeta']) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  paperConfig,
  onUpdatePaperConfig,
  handwritingConfig,
  onUpdateHandwritingConfig,
  studentMeta,
  onUpdateStudentMeta,
}) => {
  const [activeTab, setActiveTab] = useState<'handwriting' | 'paper' | 'student'>('handwriting');

  const handlePresetSelect = (preset: HandwritingPreset) => {
    if (preset === 'custom') {
      onUpdateHandwritingConfig({ ...handwritingConfig, neatness: 'custom' });
      return;
    }
    const presetValues = NEATNESS_PRESETS[preset];
    onUpdateHandwritingConfig({
      ...handwritingConfig,
      ...presetValues,
      neatness: preset,
    });
  };

  const handleRerollSeed = () => {
    onUpdateHandwritingConfig({
      ...handwritingConfig,
      randomSeed: Math.floor(Math.random() * 1000000),
    });
  };

  const handlePaperTypeChange = (type: PaperType) => {
    const newConfig = createPaperConfig(type, paperConfig.size);
    onUpdatePaperConfig(newConfig);
  };

  const handlePaperSizeChange = (size: PaperSize) => {
    const newConfig = createPaperConfig(paperConfig.type, size);
    onUpdatePaperConfig(newConfig);
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full select-none">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 text-xs font-semibold text-slate-600 bg-slate-50">
        <button
          onClick={() => setActiveTab('handwriting')}
          className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'handwriting'
              ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Gaya Tulisan</span>
        </button>

        <button
          onClick={() => setActiveTab('paper')}
          className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'paper'
              ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kertas & Ukuran</span>
        </button>

        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 py-3 px-2 flex items-center justify-center space-x-1.5 border-b-2 transition-colors ${
            activeTab === 'student'
              ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Identitas</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-slate-700">
        {/* TAB 1: HANDWRITING STYLE LIBRARY */}
        {activeTab === 'handwriting' && (
          <div className="space-y-5">
            {/* Font Picker */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Handwriting Style Library
              </label>
              <div className="space-y-1.5">
                {HANDWRITING_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => onUpdateHandwritingConfig({ ...handwritingConfig, fontId: font.id })}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      handwritingConfig.fontId === font.id
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>{font.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        {font.category}
                      </span>
                    </div>
                    <div
                      className="text-base text-slate-700 mt-1 truncate"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      Catatan penting untuk tugas kuliah & sekolah.
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Neatness Presets */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Tingkat Kerapian (Neatness)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['neat', 'natural', 'expressive'] as HandwritingPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetSelect(preset)}
                    className={`py-2 px-2 text-center rounded-lg border font-semibold capitalize text-xs transition-all ${
                      handwritingConfig.neatness === preset
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {preset === 'neat' ? 'Rapi' : preset === 'natural' ? 'Alami' : 'Cepat'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="border-t border-slate-200 pt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Ukuran Huruf</span>
                  <span className="font-mono text-slate-500">{handwritingConfig.fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="34"
                  value={handwritingConfig.fontSize}
                  onChange={(e) =>
                    onUpdateHandwritingConfig({
                      ...handwritingConfig,
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Kemiringan (Slant)</span>
                  <span className="font-mono text-slate-500">{handwritingConfig.slantAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="12"
                  value={handwritingConfig.slantAngle}
                  onChange={(e) =>
                    onUpdateHandwritingConfig({
                      ...handwritingConfig,
                      slantAngle: Number(e.target.value),
                      neatness: 'custom',
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Variasi Garis Dasar (Baseline Jitter)</span>
                  <span className="font-mono text-slate-500">{handwritingConfig.baselineJitter.toFixed(1)} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3.5"
                  step="0.1"
                  value={handwritingConfig.baselineJitter}
                  onChange={(e) =>
                    onUpdateHandwritingConfig({
                      ...handwritingConfig,
                      baselineJitter: Number(e.target.value),
                      neatness: 'custom',
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Jarak Antar Huruf</span>
                  <span className="font-mono text-slate-500">{handwritingConfig.letterSpacing.toFixed(1)} px</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="3"
                  step="0.2"
                  value={handwritingConfig.letterSpacing}
                  onChange={(e) =>
                    onUpdateHandwritingConfig({
                      ...handwritingConfig,
                      letterSpacing: Number(e.target.value),
                      neatness: 'custom',
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            {/* Re-roll variation seed */}
            <div className="border-t border-slate-200 pt-4">
              <button
                onClick={handleRerollSeed}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Dices className="w-4 h-4 text-indigo-600" />
                <span>Acak Ulang Variasi Tulisan</span>
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                Mengubah lekukan dan variasi karakter secara unik dengan seed acak.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PAPER & LAYOUT */}
        {activeTab === 'paper' && (
          <div className="space-y-5">
            {/* Paper Size */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Ukuran Kertas Fisik
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['A4', 'A5', 'Letter', 'B5', 'Folio'] as PaperSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePaperSizeChange(size)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      paperConfig.size === size
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-semibold">{size}</div>
                    <div className="text-[10px] text-slate-400">
                      {size === 'A4'
                        ? '210 x 297 mm'
                        : size === 'A5'
                        ? '148 x 210 mm'
                        : size === 'Letter'
                        ? '8.5 x 11 in'
                        : size === 'B5'
                        ? '176 x 250 mm'
                        : '215 x 330 mm (F4)'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Paper Type */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Pilihan Jenis Kertas (Pelajar & Akademisi)
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'ruled' as PaperType,
                    name: 'Buku Tulis SIDU (Sekolah)',
                    desc: 'Garis biru rapi dengan garis margin vertikal merah.',
                    icon: FileText,
                  },
                  {
                    id: 'folio' as PaperType,
                    name: 'Kertas Double Folio Bergaris',
                    desc: 'Standar tugas sekolah & kuliah (margin kiri ganda & margin kanan).',
                    icon: FileText,
                  },
                  {
                    id: 'looseleaf' as PaperType,
                    name: 'Kertas Loose Leaf Binder Kampus',
                    desc: 'Kertas binder bergaris lengkap dengan ring binder.',
                    icon: Layers,
                  },
                  {
                    id: 'grid' as PaperType,
                    name: 'Buku Kotak Matematika (5mm)',
                    desc: 'Grid kotak presisi untuk perhitungan sains dan rumus.',
                    icon: Grid,
                  },
                  {
                    id: 'grid-large' as PaperType,
                    name: 'Buku Kotak Besar (10mm)',
                    desc: 'Grid kotak besar untuk anak SD, angka, dan aksara/hanzi.',
                    icon: Grid,
                  },
                  {
                    id: 'lined-3' as PaperType,
                    name: 'Buku Garis 3 Tulis Halus',
                    desc: 'Format belajar menulis rapi dan huruf tegak bersambung.',
                    icon: PenTool,
                  },
                  {
                    id: 'exam' as PaperType,
                    name: 'Lembar Ujian Resmi (UTS/UAS)',
                    desc: 'Lengkap dengan tabel formal identitas siswa dan kotak nilai.',
                    icon: FileCheck,
                  },
                  {
                    id: 'millimeter' as PaperType,
                    name: 'Kertas Milimeter Blok',
                    desc: 'Grid mikro oranye presisi untuk grafik teknik & fisika.',
                    icon: FileSpreadsheet,
                  },
                  {
                    id: 'music' as PaperType,
                    name: 'Kertas Not Balok Musik',
                    desc: '5 garis paranada (stave) untuk notasi musik & seni.',
                    icon: Music,
                  },
                  {
                    id: 'plain' as PaperType,
                    name: 'Kertas Polos Ivory HVS',
                    desc: 'Kertas polos bersih hangat untuk catatan bebas & diagram.',
                    icon: FileSpreadsheet,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePaperTypeChange(item.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start space-x-2.5 ${
                      paperConfig.type === item.id
                        ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Fitting Controls */}
            <div className="border-t border-slate-200 pt-4 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Jarak Garis Kertas (Line Spacing)</span>
                  <span className="font-mono text-slate-500">{paperConfig.lineSpacingPx} px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="44"
                  value={paperConfig.lineSpacingPx}
                  onChange={(e) =>
                    onUpdatePaperConfig({
                      ...paperConfig,
                      lineSpacingPx: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>Margin Kiri</span>
                  <span className="font-mono text-slate-500">{paperConfig.leftMarginPx} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={paperConfig.leftMarginPx}
                  onChange={(e) =>
                    onUpdatePaperConfig({
                      ...paperConfig,
                      leftMarginPx: Number(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT METADATA */}
        {activeTab === 'student' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Nama Siswa / Mahasiswa
              </label>
              <input
                type="text"
                value={studentMeta.studentName}
                onChange={(e) => onUpdateStudentMeta({ ...studentMeta, studentName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Contoh: Muhammad Rizky"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Kelas / Semester / NIM
              </label>
              <input
                type="text"
                value={studentMeta.studentClass}
                onChange={(e) => onUpdateStudentMeta({ ...studentMeta, studentClass: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Contoh: XII IPA 1 / 20261001"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Mata Pelajaran / Mata Kuliah
              </label>
              <input
                type="text"
                value={studentMeta.subject}
                onChange={(e) => onUpdateStudentMeta({ ...studentMeta, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Contoh: Fisika Dasar"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Tanggal Pengerjaan
              </label>
              <input
                type="text"
                value={studentMeta.date}
                onChange={(e) => onUpdateStudentMeta({ ...studentMeta, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none"
                placeholder="Contoh: 26 Oktober 2026"
              />
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg text-[11px] text-indigo-700 leading-relaxed border border-indigo-100">
              💡 Identitas ini akan otomatis dicetak pada header Lembar Ujian & Tugas Resmi atau bagian atas catatan.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
