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
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Project Title */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-indigo-600 font-bold text-base sm:text-lg tracking-tight shrink-0">
          <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            AI Handwriting Studio
          </span>
          <span className="sm:hidden font-bold text-indigo-600 text-sm">Studio</span>
        </div>

        <div className="h-4 sm:h-5 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-indigo-500 rounded px-1.5 sm:px-2 py-1 outline-none w-24 sm:w-44 md:w-64 truncate transition-colors"
            placeholder="Judul Catatan..."
          />
          {isSaving && <span className="text-[10px] text-slate-400 italic hidden md:inline">Menyimpan...</span>}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
        <button
          onClick={onOpenTemplates}
          className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Contoh Template Catatan Siswa"
        >
          <BookOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Template</span>
        </button>

        <button
          onClick={onOpenImport}
          className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Import DOCX, TXT atau OCR Foto Soal"
        >
          <Upload className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Import/OCR</span>
        </button>

        <button
          onClick={onOpenAi}
          className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
          title="Bantuan AI: Rapikan, Perbaiki Ejaan, Rangkum"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="hidden sm:inline">AI</span>
        </button>

        <button
          onClick={onOpenProjects}
          className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Buka Proyek Tersimpan"
        >
          <FolderOpen className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline">Proyek</span>
        </button>

        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
            title="Panduan Cara Menggunakan AI Handwriting Studio"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span className="hidden lg:inline">Panduan</span>
          </button>
        )}

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all shadow-indigo-200 shrink-0"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Ekspor PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
};
