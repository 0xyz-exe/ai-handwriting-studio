import { describe, expect, it } from 'vitest';
import { calculateDocumentLayout, parseLineToSpans, wrapSpansToLines } from './layout-engine';
import { createPaperConfig } from './paper-templates';

describe('Layout Engine & Multi-Pen Parser', () => {
  it('parses markdown headers with blue pen style by default', () => {
    const parsed = parseLineToSpans('# Judul Bab 1: Biologi Sel', {
      activeDefaultPen: 'ballpoint-black',
    });
    expect(parsed.isHeader).toBe(true);
    expect(parsed.spans.length).toBe(1);
    expect(parsed.spans[0].text).toBe('Judul Bab 1: Biologi Sel');
    expect(parsed.spans[0].pen.id).toBe('ballpoint-blue');
  });

  it('parses multi-pen inline tags correctly', () => {
    const raw = 'Catatan ini [red]penting sekali[/red] dan rumus [pencil]F = m * a[/pencil]';
    const parsed = parseLineToSpans(raw, {
      activeDefaultPen: 'ballpoint-black',
    });

    expect(parsed.spans.length).toBe(4);
    expect(parsed.spans[0].text).toBe('Catatan ini ');
    expect(parsed.spans[0].pen.id).toBe('ballpoint-black');

    expect(parsed.spans[1].text).toBe('penting sekali');
    expect(parsed.spans[1].pen.id).toBe('ballpoint-red');

    expect(parsed.spans[2].text).toBe(' dan rumus ');
    expect(parsed.spans[2].pen.id).toBe('ballpoint-black');

    expect(parsed.spans[3].text).toBe('F = m * a');
    expect(parsed.spans[3].pen.id).toBe('pencil');
  });

  it('parses math formulas enclosed in $ signs', () => {
    const raw = 'Rumus kuadrat: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ selesai';
    const parsed = parseLineToSpans(raw, {
      activeDefaultPen: 'ballpoint-black',
    });
    const mathSpan = parsed.spans.find((s) => s.isMath);
    expect(mathSpan).toBeDefined();
    expect(mathSpan?.mathFormula).toBe('x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
  });

  it('wraps long lines into multiple lines based on printable width', () => {
    const parsed = parseLineToSpans(
      'Ini adalah sebuah paragraf yang sangat panjang sekali ditulis oleh siswa untuk menguji apakah kata-kata akan otomatis terbungkus rapi tanpa keluar dari garis kertas buku tulis.',
      { activeDefaultPen: 'ballpoint-black' }
    );

    const wrapped = wrapSpansToLines(parsed.spans, 250, 22, 0.5);
    expect(wrapped.length).toBeGreaterThan(1);
  });

  it('calculates document layout and paginates overflow text across multiple pages', () => {
    const paper = createPaperConfig('ruled', 'A5'); // Smaller A5 paper to easily test pagination
    // Generate 60 lines of text
    const lines = Array.from({ length: 60 }, (_, i) => `Baris catatan nomor ${i + 1} dengan informasi penting.`);
    const content = lines.join('\n');

    const layout = calculateDocumentLayout(content, paper, 20, 0.5, {
      activeDefaultPen: 'ballpoint-black',
    });

    expect(layout.totalPages).toBeGreaterThan(1);
    expect(layout.pages[0].lines.length).toBeGreaterThan(10);
    expect(layout.pages[1].lines.length).toBeGreaterThan(0);
  });
});
