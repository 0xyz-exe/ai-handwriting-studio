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
    name: 'Pensil 2B (Sketsa & Catatan Ringan)',
    color: '#4b5563', // Graphite gray
    opacity: 0.82,
    thickness: 0.92,
    roughness: 0.35,
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

export function getPenStyle(type: PenType, customColors?: { blue?: string; black?: string; red?: string }): PenStyle {
  const base = { ...DEFAULT_PENS[type] };
  if (customColors) {
    if (type === 'ballpoint-blue' && customColors.blue) base.color = customColors.blue;
    if (type === 'ballpoint-black' && customColors.black) base.color = customColors.black;
    if (type === 'ballpoint-red' && customColors.red) base.color = customColors.red;
  }
  return base;
}
