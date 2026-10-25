import { describe, expect, it } from 'vitest';
import { HANDWRITING_FONTS, NEATNESS_PRESETS, getFontFamilyById } from './fonts';
import { DEFAULT_PAPER_TEMPLATES, createPaperConfig, getCanvasDimensions } from './paper-templates';
import { DEFAULT_PENS, getPenStyle } from './pens';

describe('AI Handwriting Studio Feature Verification', () => {
  it('loads all handwriting fonts from library', () => {
    expect(HANDWRITING_FONTS.length).toBeGreaterThanOrEqual(8);
    const caveat = HANDWRITING_FONTS.find((f) => f.id === 'caveat');
    expect(caveat).toBeDefined();
    expect(caveat?.name).toContain('Caveat');
    expect(getFontFamilyById('kalam')).toContain('Kalam');
  });

  it('provides neatness presets with distinct jitter metrics', () => {
    expect(NEATNESS_PRESETS.neat.baselineJitter).toBeLessThan(NEATNESS_PRESETS.natural.baselineJitter!);
    expect(NEATNESS_PRESETS.natural.baselineJitter).toBeLessThan(NEATNESS_PRESETS.expressive.baselineJitter!);
  });

  it('supports multi-pen tools (blue, black, red, green, pencils, highlighter)', () => {
    expect(DEFAULT_PENS['ballpoint-blue'].color).toBe('#1d4ed8');
    expect(DEFAULT_PENS['ballpoint-black'].color).toBe('#18181b');
    expect(DEFAULT_PENS['ballpoint-red'].color).toBe('#dc2626');
    expect(DEFAULT_PENS['pencil'].isPencil).toBe(true);
    expect(DEFAULT_PENS['pencil-mechanical'].isPencil).toBe(true);
    expect(DEFAULT_PENS['pencil-4b'].isPencil).toBe(true);
    expect(DEFAULT_PENS['highlighter'].isHighlighter).toBe(true);
  });

  it('allows customizing pen colors', () => {
    const custom = getPenStyle('ballpoint-blue', { blue: '#0284c7' });
    expect(custom.color).toBe('#0284c7');
  });

  it('generates accurate canvas dimensions and margins for A4, A5, and Folio', () => {
    const a4 = getCanvasDimensions('A4');
    const a5 = getCanvasDimensions('A5');
    const folio = getCanvasDimensions('Folio');
    expect(a4.widthPx).toBeGreaterThan(a5.widthPx);
    expect(a4.heightPx).toBeGreaterThan(a5.heightPx);
    expect(folio.heightPx).toBeGreaterThan(a4.heightPx);

    const ruled = createPaperConfig('ruled', 'A4');
    expect(ruled.type).toBe('ruled');
    expect(ruled.hasLeftMargin).toBe(true);

    const folioPaper = createPaperConfig('folio', 'Folio');
    expect(folioPaper.type).toBe('folio');
    expect(folioPaper.hasRightMargin).toBe(true);

    const lined3 = createPaperConfig('lined-3', 'A5');
    expect(lined3.type).toBe('lined-3');

    const exam = createPaperConfig('exam', 'A4');
    expect(exam.showHeaderInfo).toBe(true);
  });
});
