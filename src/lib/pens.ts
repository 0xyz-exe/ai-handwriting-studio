import { PenStyle, PenType } from '@/types';

export const DEFAULT_PENS: Record<PenType, PenStyle> = {
  'ballpoint-blue': {
    id: 'ballpoint-blue',
    name: 'Bolpoin Biru (Judul / Header)',
    color: '#1d4ed8', // Vibrant gel blue
    opacity: 0.95,
    thickness: 1.05,
    roughness: 0.05,
  },
  'ballpoint-black': {
    id: 'ballpoint-black',
    name: 'Bolpoin Hitam (Isi Catatan)',
    color: '#18181b', // Deep carbon black
    opacity: 0.98,
    thickness: 1.0,
    roughness: 0.05,
  },
  'ballpoint-red': {
    id: 'ballpoint-red',
    name: 'Bolpoin Merah (Koreksi / Poin Penting)',
    color: '#dc2626', // Teacher red
    opacity: 0.95,
    thickness: 1.0,
    roughness: 0.05,
  },
  'ballpoint-green': {
    id: 'ballpoint-green',
    name: 'Bolpoin Hijau (Sub-bab / Rumus)',
    color: '#15803d',
    opacity: 0.92,
    thickness: 0.98,
    roughness: 0.05,
  },
  pencil: {
    id: 'pencil',
    name: 'Pensil 2B (Ujian & Menulis)',
    color: '#3f3f46', // Classic 2B graphite
    opacity: 0.86,
    thickness: 0.95,
    roughness: 0.32,
    isPencil: true,
  },
  'pencil-mechanical': {
    id: 'pencil-mechanical',
    name: 'Pensil Mekanik 0.5mm (Presisi & Rapi)',
    color: '#334155', // Sharp thin graphite
    opacity: 0.9,
    thickness: 0.72,
    roughness: 0.18,
    isPencil: true,
  },
  'pencil-4b': {
    id: 'pencil-4b',
    name: 'Pensil 4B Gelap (Sketsa & Tebal)',
    color: '#18181b', // Soft dark graphite
    opacity: 0.92,
    thickness: 1.25,
    roughness: 0.45,
    isPencil: true,
  },
  'pencil-colored-red': {
    id: 'pencil-colored-red',
    name: 'Pensil Warna Merah (Koreksi Lembut)',
    color: '#e11d48',
    opacity: 0.85,
    thickness: 1.0,
    roughness: 0.35,
    isPencil: true,
  },
  'pencil-colored-blue': {
    id: 'pencil-colored-blue',
    name: 'Pensil Warna Biru (Sketsa Diagram)',
    color: '#2563eb',
    opacity: 0.85,
    thickness: 1.0,
    roughness: 0.35,
    isPencil: true,
  },
  highlighter: {
    id: 'highlighter',
    name: 'Stabilo Kuning (Highlight)',
    color: '#fef08a',
    opacity: 0.45,
    thickness: 1.5,
    roughness: 0.0,
    isHighlighter: true,
  },
};

export function getPenStyle(type?: PenType, customColors?: { blue?: string; black?: string; red?: string }): PenStyle {
  const resolvedType = (type && DEFAULT_PENS[type]) ? type : 'ballpoint-black';
  const base = { ...DEFAULT_PENS[resolvedType] };
  if (customColors) {
    if (resolvedType === 'ballpoint-blue' && customColors.blue) base.color = customColors.blue;
    if (resolvedType === 'ballpoint-black' && customColors.black) base.color = customColors.black;
    if (resolvedType === 'ballpoint-red' && customColors.red) base.color = customColors.red;
  }
  return base;
}
