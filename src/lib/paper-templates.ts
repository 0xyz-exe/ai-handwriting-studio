import { PaperConfig, PaperSize, PaperType } from '@/types';

export const PAPER_DIMENSIONS_MM: Record<PaperSize, { widthMm: number; heightMm: number }> = {
  A4: { widthMm: 210, heightMm: 297 },
  A5: { widthMm: 148, heightMm: 210 },
  Letter: { widthMm: 215.9, heightMm: 279.4 },
  B5: { widthMm: 176, heightMm: 250 },
};

// Pixels per mm at standard working canvas scale (~3.78 px/mm = 96 dpi)
// For sharp rendering, we can render canvas with scale multiplier (e.g. 2x for retina)
export const CANVAS_PIXELS_PER_MM = 3.8;

export function getCanvasDimensions(size: PaperSize): { widthPx: number; heightPx: number } {
  const dim = PAPER_DIMENSIONS_MM[size];
  return {
    widthPx: Math.round(dim.widthMm * CANVAS_PIXELS_PER_MM),
    heightPx: Math.round(dim.heightMm * CANVAS_PIXELS_PER_MM),
  };
}

export const DEFAULT_PAPER_TEMPLATES: Record<PaperType, (size: PaperSize) => PaperConfig> = {
  ruled: (size: PaperSize) => {
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[size];
    return {
      type: 'ruled',
      size,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 32,
      gridSizePx: 0,
      lineColor: '#cbd5e1', // Soft blue-gray notebook rule
      marginLineColor: '#f87171', // Red vertical margin
      hasLeftMargin: true,
      leftMarginPx: 105,
      topMarginPx: 96,
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#fefefe',
      paperTexture: 'subtle-cream',
    };
  },
  grid: (size: PaperSize) => {
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[size];
    return {
      type: 'grid',
      size,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 28,
      gridSizePx: 28,
      lineColor: '#e2e8f0', // Crisp subtle math grid
      marginLineColor: '#94a3b8',
      hasLeftMargin: true,
      leftMarginPx: 84,
      topMarginPx: 84,
      rightMarginPx: 48,
      bottomMarginPx: 56,
      backgroundColor: '#ffffff',
      paperTexture: 'pure-white',
    };
  },
  dot: (size: PaperSize) => {
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[size];
    return {
      type: 'dot',
      size,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 30,
      gridSizePx: 30,
      lineColor: '#94a3b8',
      marginLineColor: 'transparent',
      hasLeftMargin: false,
      leftMarginPx: 64,
      topMarginPx: 64,
      rightMarginPx: 64,
      bottomMarginPx: 64,
      backgroundColor: '#fdfbf7',
      paperTexture: 'subtle-cream',
    };
  },
  looseleaf: (size: PaperSize) => {
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[size];
    return {
      type: 'looseleaf',
      size,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 32,
      gridSizePx: 0,
      lineColor: '#bfdbfe', // Light blue looseleaf lines
      marginLineColor: '#fca5a5',
      hasLeftMargin: true,
      leftMarginPx: 120, // Extra margin for holes
      topMarginPx: 88,
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#ffffff',
      paperTexture: 'pure-white',
      showHoles: true,
    };
  },
  exam: (size: PaperSize) => {
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[size];
    return {
      type: 'exam',
      size,
      widthMm,
      heightMm,
      dpi: 96,
      lineSpacingPx: 34,
      gridSizePx: 0,
      lineColor: '#94a3b8',
      marginLineColor: '#475569',
      hasLeftMargin: true,
      leftMarginPx: 96,
      topMarginPx: 160, // Space for exam header block
      rightMarginPx: 48,
      bottomMarginPx: 64,
      backgroundColor: '#fafaf9',
      paperTexture: 'subtle-cream',
      showHeaderInfo: true,
    };
  },
  plain: (size: PaperSize) => {
    const { widthMm, heightMm } = PAPER_DIMENSIONS_MM[size];
    return {
      type: 'plain',
      size,
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
  const factory = DEFAULT_PAPER_TEMPLATES[type] || DEFAULT_PAPER_TEMPLATES.ruled;
  return factory(size);
}
