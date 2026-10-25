import { PaperConfig, PaperSize, PaperType } from '@/types';

export const PAPER_DIMENSIONS_MM: Record<PaperSize, { widthMm: number; heightMm: number }> = {
  A4: { widthMm: 210, heightMm: 297 },
  A5: { widthMm: 148, heightMm: 210 },
  Letter: { widthMm: 215.9, heightMm: 279.4 },
  B5: { widthMm: 176, heightMm: 250 },
  Folio: { widthMm: 215, heightMm: 330 },
};

export const CANVAS_PIXELS_PER_MM = 3.8;

export function getCanvasDimensions(size?: PaperSize): { widthPx: number; heightPx: number } {
  const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
  const dim = PAPER_DIMENSIONS_MM[safeSize];
  return {
    widthPx: Math.round(dim.widthMm * CANVAS_PIXELS_PER_MM),
    heightPx: Math.round(dim.heightMm * CANVAS_PIXELS_PER_MM),
  };
}

export const DEFAULT_PAPER_TEMPLATES: Record<PaperType, (size: PaperSize) => PaperConfig> = {
  ruled: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'ruled',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 32,
      gridSizePx: 0,
      lineColor: '#93c5fd', // Classic SIDU blue rule (jelas & tegas)
      marginLineColor: '#ef4444', // Red vertical margin
      hasLeftMargin: true,
      leftMarginPx: 105,
      topMarginPx: 96,
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#fbfbfb',
      paperTexture: 'subtle-cream',
      showLines: false,
      showMargins: false,
    };
  },
  folio: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'Folio';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'folio',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 30,
      gridSizePx: 0,
      lineColor: '#93c5fd', // Biru terang khas folio bergaris
      marginLineColor: '#dc2626', // Garis tepi merah ganda kiri
      hasLeftMargin: true,
      hasRightMargin: true, // Garis tepi kanan khas folio
      leftMarginPx: 90,
      topMarginPx: 80,
      rightMarginPx: 60,
      bottomMarginPx: 64,
      backgroundColor: '#fdfdfd',
      paperTexture: 'pure-white',
      showLines: false,
      showMargins: false,
    };
  },
  looseleaf: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'B5';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'looseleaf',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 32,
      gridSizePx: 0,
      lineColor: '#93c5fd', // Garis biru looseleaf kampus
      marginLineColor: '#f87171',
      hasLeftMargin: true,
      leftMarginPx: 125, // Ruang untuk lubang binder
      topMarginPx: 88,
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#ffffff',
      paperTexture: 'pure-white',
      showHoles: true,
      showLines: false,
      showMargins: false,
    };
  },
  grid: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'grid',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 28,
      gridSizePx: 26, // 5mm math grid
      lineColor: '#cbd5e1', // Jelas terbaca
      marginLineColor: '#64748b',
      hasLeftMargin: true,
      leftMarginPx: 84,
      topMarginPx: 84,
      rightMarginPx: 48,
      bottomMarginPx: 56,
      backgroundColor: '#ffffff',
      paperTexture: 'pure-white',
    };
  },
  'grid-large': (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'grid-large',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 42,
      gridSizePx: 42, // 10mm kotak besar
      lineColor: '#94a3b8',
      marginLineColor: '#ef4444',
      hasLeftMargin: true,
      leftMarginPx: 84,
      topMarginPx: 84,
      rightMarginPx: 48,
      bottomMarginPx: 56,
      backgroundColor: '#fefefe',
      paperTexture: 'subtle-cream',
    };
  },
  'lined-3': (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A5';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'lined-3',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 38,
      gridSizePx: 0,
      lineColor: '#3b82f6', // Garis utama biru
      subLineColor: '#93c5fd', // Garis bantu tengah putus-putus
      marginLineColor: '#ef4444',
      hasLeftMargin: true,
      leftMarginPx: 96,
      topMarginPx: 96,
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#fffbeb',
      paperTexture: 'subtle-cream',
    };
  },
  exam: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'exam',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 34,
      gridSizePx: 0,
      lineColor: '#94a3b8',
      marginLineColor: '#475569',
      hasLeftMargin: true,
      leftMarginPx: 96,
      topMarginPx: 170, // Ruang untuk tabel header ujian
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#fafaf9',
      paperTexture: 'subtle-cream',
      showHeaderInfo: true,
    };
  },
  millimeter: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'millimeter',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 30,
      gridSizePx: 10,
      lineColor: '#f97316', // Kertas grafik oranye teknik
      subLineColor: '#fdba74',
      marginLineColor: '#ea580c',
      hasLeftMargin: true,
      leftMarginPx: 70,
      topMarginPx: 70,
      rightMarginPx: 50,
      bottomMarginPx: 50,
      backgroundColor: '#fffaf5',
      paperTexture: 'pure-white',
    };
  },
  music: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'music',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 48, // Jarak antar sistem stave
      gridSizePx: 0,
      lineColor: '#1e293b', // Garis not balok hitam
      marginLineColor: '#94a3b8',
      hasLeftMargin: true,
      leftMarginPx: 80,
      topMarginPx: 90,
      rightMarginPx: 60,
      bottomMarginPx: 70,
      backgroundColor: '#fbf9f5',
      paperTexture: 'vintage',
    };
  },
  plain: (size: PaperSize) => {
    const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[safeSize];
    return {
      type: 'plain',
      size: safeSize,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 34,
      gridSizePx: 0,
      lineColor: 'transparent',
      marginLineColor: 'transparent',
      hasLeftMargin: false,
      leftMarginPx: 70,
      topMarginPx: 80,
      rightMarginPx: 70,
      bottomMarginPx: 70,
      backgroundColor: '#fbf8ee',
      paperTexture: 'vintage',
    };
  },
};

export function createPaperConfig(type: PaperType = 'ruled', size: PaperSize = 'A4'): PaperConfig {
  const safeSize = (size && PAPER_DIMENSIONS_MM[size]) ? size : 'A4';
  const factory = DEFAULT_PAPER_TEMPLATES[type] || DEFAULT_PAPER_TEMPLATES.ruled;
  return factory(safeSize);
}
