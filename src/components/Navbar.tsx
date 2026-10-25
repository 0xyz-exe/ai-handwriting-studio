import { StudentProject } from '@/types';
import { BookOpen, Download, FileText, FolderOpen, HelpCircle, PenTool, Sparkles, Upload } from 'lucide-react';
import React from 'react';

interface NavbarProps {
  project: StudentProject;
  onUpdateTitle: (newTitle: string) => void;
  onOpenTemplates: () => void;
  onOpenImport: () => void;
  onOpenAi: () => void;
  onOpenExport: () => void;
  onOpenProjects: () => void;
  onOpenTour?: () => void;
  isSaving?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  onUpdateTitle,
  onOpenTemplates,
  onOpenImport,
  onOpenAi,
  onOpenExport,
  onOpenProjects,
  onOpenTour,
  isSaving,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Project Title */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg tracking-tight">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <PenTool className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Handwriting Studio
          </span>
        </div>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-sm font-semibold text-slate-800 bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 outline-none max-w-[200px] md:max-w-[320px] transition-colors"
            placeholder="Judul Catatan..."
          />
          {isSaving && <span className="text-xs text-slate-400 italic">Menyimpan...</span>}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenTemplates}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Contoh Template Catatan Siswa"
        >
          <BookOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Template</span>
        </button>

        <button
          onClick={onOpenImport}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Import DOCX, TXT atau OCR Foto Soal"
        >
          <Upload className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Import / OCR</span>
        </button>

        <button
          onClick={onOpenAi}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
          title="Bantuan AI: Rapikan, Perbaiki Ejaan, Rangkum"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="hidden sm:inline">AI Catatan</span>
        </button>

        <button
          onClick={onOpenProjects}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Buka Proyek Tersimpan"
        >
          <FolderOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Proyek</span>
        </button>

        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            title="Panduan Cara Menggunakan AI Handwriting Studio"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span className="hidden lg:inline">Panduan</span>
          </button>
        )}

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all shadow-indigo-200"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor PDF</span>
        </button>
      </div>
    </header>
  );
};
