import { StudentProject } from '@/types';
import { SAMPLE_TEMPLATES, SampleTemplate, createProjectFromTemplate } from '@/lib/templates';
import { BookOpen, FolderOpen, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: StudentProject[];
  currentProjectId: string;
  onSelectProject: (project: StudentProject) => void;
  onDeleteProject: (id: string) => void;
  onCreateNewProject: () => void;
  onSelectTemplate: (template: SampleTemplate) => void;
  initialTab?: 'projects' | 'templates';
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  savedProjects,
  currentProjectId,
  onSelectProject,
  onDeleteProject,
  onCreateNewProject,
  onSelectTemplate,
  initialTab = 'projects',
}) => {
  const [tab, setTab] = useState<'projects' | 'templates'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Manajemen Proyek & Template</h3>
              <p className="text-xs text-slate-500">Buka dokumen tersimpan atau mulai dari template catatan.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setTab('projects')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              tab === 'projects'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Dokumen Saya ({savedProjects.length})</span>
          </button>

          <button
            onClick={() => setTab('templates')}
            className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              tab === 'templates'
                ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Galeri Template Siswa</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === 'projects' && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  onCreateNewProject();
                  onClose();
                }}
                className="w-full p-3 border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Catatan Tulisan Tangan Baru</span>
              </button>

              <div className="space-y-2">
                {savedProjects.map((p) => (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      p.id === currentProjectId
                        ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectProject(p);
                        onClose();
                      }}
                      className="cursor-pointer flex-1"
                    >
                      <div className="font-bold text-slate-900 text-xs">{p.title}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-3">
                        <span>Kertas: {p.paperConfig.type} ({p.paperConfig.size})</span>
                        <span>Diperbarui: {new Date(p.updatedAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>

                    {savedProjects.length > 1 && (
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Hapus Dokumen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAMPLE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {tmpl.category}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">Kertas {tmpl.paperType}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{tmpl.title}</div>
                    <p className="text-[11px] text-slate-500 mt-1">{tmpl.description}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                    <span>Gunakan Template Ini</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
