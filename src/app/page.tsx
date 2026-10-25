'use client';

import {
  HandwritingStyleConfig,
  PaperConfig,
  PenType,
  StudentProject,
} from '@/types';
import { AiAssistantModal } from '@/components/AiAssistantModal';
import { Editor } from '@/components/Editor';
import { ExportModal } from '@/components/ExportModal';
import { ImportModal } from '@/components/ImportModal';
import { Navbar } from '@/components/Navbar';
import { PaperCanvas } from '@/components/PaperCanvas';
import { ProjectManagerModal } from '@/components/ProjectManagerModal';
import { QuickTour } from '@/components/QuickTour';
import { SettingsSidebar } from '@/components/SettingsSidebar';
import { calculateDocumentLayout } from '@/lib/layout-engine';
import {
  deleteProject,
  getSavedProjects,
  saveProject,
} from '@/lib/storage';
import {
  SAMPLE_TEMPLATES,
  SampleTemplate,
  createProjectFromTemplate,
} from '@/lib/templates';
import { Eye, PenLine, Sliders } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function Home() {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [activeProject, setActiveProject] = useState<StudentProject | null>(null);
  const activeCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const [exportCanvases, setExportCanvases] = useState<HTMLCanvasElement[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleRegisterCanvases = useCallback((canvases: HTMLCanvasElement[]) => {
    activeCanvasesRef.current = canvases;
  }, []);

  // Modals state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'settings'>('editor');

  // Load projects from storage on initial mount & check first visit tour
  useEffect(() => {
    const rawList = getSavedProjects();
    const list = rawList.map((p) => ({
      ...p,
      paperConfig: {
        ...p.paperConfig,
        showLines: p.paperConfig.showLines ?? false,
        showMargins: p.paperConfig.showMargins ?? false,
      },
    }));
    setProjects(list);
    if (list.length > 0) {
      setActiveProject(list[0]);
    } else {
      const initial = createProjectFromTemplate(SAMPLE_TEMPLATES[0]);
      initial.paperConfig.showLines = false;
      initial.paperConfig.showMargins = false;
      setProjects([initial]);
      setActiveProject(initial);
      saveProject(initial);
    }

    // Auto-open tour on first visit
    if (typeof window !== 'undefined' && !localStorage.getItem('ai_handwriting_studio_tour_seen')) {
      setIsTourOpen(true);
    }
  }, []);

  // Debounced auto-save project
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handlePersist = useCallback((projectToSave: StudentProject) => {
    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveProject(projectToSave);
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.id === projectToSave.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = projectToSave;
          return updated;
        }
        return [projectToSave, ...prev];
      });
      setIsSaving(false);
    }, 600);
  }, []);

  // Project state mutators
  const updateContent = (content: string) => {
    if (!activeProject) return;
    const updated = { ...activeProject, content, updatedAt: Date.now() };
    setActiveProject(updated);
    handlePersist(updated);
  };

  const updateTitle = (title: string) => {
    if (!activeProject) return;
    const updated = { ...activeProject, title, updatedAt: Date.now() };
    setActiveProject(updated);
    handlePersist(updated);
  };

  const updatePaperConfig = (paperConfig: PaperConfig) => {
    if (!activeProject) return;
    const updated = { ...activeProject, paperConfig, updatedAt: Date.now() };
    setActiveProject(updated);
    handlePersist(updated);
  };

  const updateHandwritingConfig = (handwritingConfig: HandwritingStyleConfig) => {
    if (!activeProject) return;
    const updated = { ...activeProject, handwritingConfig, updatedAt: Date.now() };
    setActiveProject(updated);
    handlePersist(updated);
  };

  const updateActivePen = (activePen: PenType) => {
    if (!activeProject) return;
    const updated = { ...activeProject, activePen };
    setActiveProject(updated);
  };

  const updateStudentMeta = (studentMeta: StudentProject['studentMeta']) => {
    if (!activeProject) return;
    const updated = { ...activeProject, studentMeta, updatedAt: Date.now() };
    setActiveProject(updated);
    handlePersist(updated);
  };

  // Switch project or create new
  const handleSelectProject = (project: StudentProject) => {
    setActiveProject(project);
  };

  const handleCreateNewProject = () => {
    const blank: StudentProject = {
      id: `project-${Date.now()}`,
      title: 'Catatan Baru Tanpa Judul',
      content: '# JUDUL CATATAN BARU\n\nMulai tulis materi tugas atau catatan penting di sini...',
      paperConfig: activeProject?.paperConfig || SAMPLE_TEMPLATES[0] ? createProjectFromTemplate(SAMPLE_TEMPLATES[0]).paperConfig : undefined as any,
      handwritingConfig: activeProject?.handwritingConfig || createProjectFromTemplate(SAMPLE_TEMPLATES[0]).handwritingConfig,
      activePen: 'ballpoint-black',
      customPenColors: {
        blue: '#1d4ed8',
        black: '#18181b',
        red: '#dc2626',
      },
      studentMeta: {
        studentName: '',
        studentClass: '',
        subject: '',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveProject(blank);
    setProjects((prev) => [blank, ...prev]);
    setActiveProject(blank);
  };

  const handleSelectTemplate = (template: SampleTemplate) => {
    const fromTemplate = createProjectFromTemplate(template);
    saveProject(fromTemplate);
    setProjects((prev) => [fromTemplate, ...prev]);
    setActiveProject(fromTemplate);
  };

  const handleDeleteProject = (id: string) => {
    const remaining = deleteProject(id);
    setProjects(remaining);
    if (activeProject?.id === id && remaining.length > 0) {
      setActiveProject(remaining[0]);
    }
  };

  // Smart Page Fitting layout recalculation
  const layout = useMemo(() => {
    if (!activeProject) return { pages: [], totalPages: 0, totalLines: 0 };
    return calculateDocumentLayout(
      activeProject.content,
      activeProject.paperConfig,
      activeProject.handwritingConfig.fontSize,
      activeProject.handwritingConfig.letterSpacing,
      {
        activeDefaultPen: activeProject.activePen,
        customPenColors: activeProject.customPenColors,
      }
    );
  }, [
    activeProject?.content,
    activeProject?.paperConfig,
    activeProject?.handwritingConfig.fontSize,
    activeProject?.handwritingConfig.letterSpacing,
    activeProject?.activePen,
    activeProject?.customPenColors,
  ]);

  if (!activeProject) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <div className="text-indigo-600 font-bold text-lg">AI Handwriting Studio</div>
          <div className="text-sm text-slate-400">Memuat studio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        project={activeProject}
        onUpdateTitle={updateTitle}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenExport={() => {
          setExportCanvases(activeCanvasesRef.current);
          setIsExportOpen(true);
        }}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        isSaving={isSaving}
      />

      {/* Main Workspace (Responsive 3-pane on desktop, Tab-switched on mobile/tablet) */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Left Pane: Multi-pen Text Editor */}
        <div
          className={`${
            mobileTab === 'editor' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-[380px] xl:w-[440px] shrink-0 h-full flex-col z-10`}
        >
          <Editor
            content={activeProject.content}
            onChange={updateContent}
            activePen={activeProject.activePen}
            onSelectPen={updateActivePen}
            totalPages={layout.totalPages}
            totalLines={layout.totalLines}
          />
        </div>

        {/* Center Pane: Realistic Canvas Paper Preview */}
        <div
          className={`${
            mobileTab === 'preview' ? 'flex' : 'hidden'
          } lg:flex flex-1 h-full min-w-0 flex-col z-10`}
        >
          <PaperCanvas
            pages={layout.pages}
            paperConfig={activeProject.paperConfig}
            onUpdatePaperConfig={updatePaperConfig}
            handwritingConfig={activeProject.handwritingConfig}
            studentMeta={activeProject.studentMeta}
            onRegisterCanvases={handleRegisterCanvases}
          />
        </div>

        {/* Right Pane: Settings & Handwriting Style Library */}
        <div
          className={`${
            mobileTab === 'settings' ? 'flex' : 'hidden'
          } lg:flex w-full lg:w-80 shrink-0 h-full flex-col z-10`}
        >
          <SettingsSidebar
            paperConfig={activeProject.paperConfig}
            onUpdatePaperConfig={updatePaperConfig}
            handwritingConfig={activeProject.handwritingConfig}
            onUpdateHandwritingConfig={updateHandwritingConfig}
            studentMeta={activeProject.studentMeta}
            onUpdateStudentMeta={updateStudentMeta}
          />
        </div>
      </div>

      {/* Mobile / Tablet Bottom Navigation Bar */}
      <div className="lg:hidden h-14 bg-white border-t border-slate-200 px-2 flex items-center justify-around z-30 select-none shrink-0 shadow-lg">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-lg transition-colors ${
            mobileTab === 'editor' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <PenLine className="w-4 h-4" />
          <span className="text-[10px]">Editor Teks</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-lg transition-colors relative ${
            mobileTab === 'preview' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Eye className="w-4 h-4" />
            <span className="absolute -top-1.5 -right-3 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {layout.totalPages}
            </span>
          </div>
          <span className="text-[10px]">Preview Kanvas</span>
        </button>

        <button
          onClick={() => setMobileTab('settings')}
          className={`flex-1 py-1 flex flex-col items-center justify-center space-y-0.5 rounded-lg transition-colors ${
            mobileTab === 'settings' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px]">Pengaturan</span>
        </button>
      </div>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentContent={activeProject.content}
        onApply={updateContent}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportText={(extracted) => {
          updateContent(activeProject.content ? `${activeProject.content}\n\n${extracted}` : extracted);
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        canvases={exportCanvases}
        paperSize={activeProject.paperConfig.size}
        projectTitle={activeProject.title}
      />

      <ProjectManagerModal
        isOpen={isProjectsOpen || isTemplatesOpen}
        onClose={() => {
          setIsProjectsOpen(false);
          setIsTemplatesOpen(false);
        }}
        savedProjects={projects}
        currentProjectId={activeProject.id}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        onCreateNewProject={handleCreateNewProject}
        onSelectTemplate={handleSelectTemplate}
        initialTab={isTemplatesOpen ? 'templates' : 'projects'}
      />

      {/* Quick Interactive Guided Tour */}
      <QuickTour
        isOpen={isTourOpen}
        onClose={() => {
          setIsTourOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ai_handwriting_studio_tour_seen', 'true');
          }
        }}
      />
    </div>
  );
}
