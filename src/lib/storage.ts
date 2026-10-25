import { StudentProject } from '@/types';
import { SAMPLE_TEMPLATES, createProjectFromTemplate } from './templates';

const STORAGE_KEY = 'ai_handwriting_studio_projects';
const ACTIVE_PROJECT_ID_KEY = 'ai_handwriting_studio_active_id';

export function getSavedProjects(): StudentProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial default project from first sample template
      const initial = createProjectFromTemplate(SAMPLE_TEMPLATES[0]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([initial]));
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, initial.id);
      return [initial];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading projects:', err);
    return [];
  }
}

export function saveProject(project: StudentProject): void {
  if (typeof window === 'undefined') return;
  try {
    const projects = getSavedProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const updated = { ...project, updatedAt: Date.now() };

    if (index >= 0) {
      projects[index] = updated;
    } else {
      projects.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, project.id);
  } catch (err) {
    console.error('Error saving project:', err);
  }
}

export function getActiveProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
}

export function deleteProject(id: string): StudentProject[] {
  if (typeof window === 'undefined') return [];
  const projects = getSavedProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects;
}
