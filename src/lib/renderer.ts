import { HandwritingStyleConfig, PageLayout, PaperConfig, RenderedLine, StudentProject } from '@/types';
import { getFontFamilyById } from './fonts';
import { getCanvasDimensions } from './paper-templates';

// Simple deterministic Mulberry32 PRNG
export function createPRNG(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawPaperBackground(
  ctx: CanvasRenderingContext2D,
  paperConfig: PaperConfig,
  studentMeta?: StudentProject['studentMeta']
) {
  const { widthPx, heightPx } = getCanvasDimensions(paperConfig.size);

  // 1. Base paper fill
  ctx.save();
  ctx.fillStyle = paperConfig.backgroundColor;
  ctx.fillRect(0, 0, widthPx, heightPx);

  // Subtle paper texture simulation (noise/warmth)
  if (paperConfig.paperTexture === 'vintage' || paperConfig.paperTexture === 'subtle-cream') {
    ctx.fillStyle = 'rgba(180, 150, 100, 0.03)';
    for (let i = 0; i < 500; i++) {
      const rx = (i * 97) % widthPx;
      const ry = (i * 139) % heightPx;
      ctx.fillRect(rx, ry, 2, 2);
    }
  }

  // 2. Ruled lines or Grid lines
  if (paperConfig.type === 'ruled' || paperConfig.type === 'looseleaf') {
    ctx.lineWidth = 1;
    ctx.strokeStyle = paperConfig.lineColor;

    const startY = paperConfig.topMarginPx;
    const endY = heightPx - paperConfig.bottomMarginPx;
    const lineSpacing = paperConfig.lineSpacingPx;

    // Double top header line if ruled
    ctx.beginPath();
    ctx.moveTo(0, startY - 6);
    ctx.lineTo(widthPx, startY - 6);
    ctx.stroke();

    for (let y = startY; y <= endY; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(widthPx, y);
      ctx.stroke();
    }

    // Left vertical margin line
    if (paperConfig.hasLeftMargin && paperConfig.marginLineColor !== 'transparent') {
      ctx.strokeStyle = paperConfig.marginLineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(paperConfig.leftMarginPx, 0);
      ctx.lineTo(paperConfig.leftMarginPx, heightPx);
      ctx.stroke();
    }
  } else if (paperConfig.type === 'grid') {
    const grid = paperConfig.gridSizePx || 28;
    ctx.lineWidth = 0.75;
    ctx.strokeStyle = paperConfig.lineColor;

    // Vertical lines
    for (let x = 0; x <= widthPx; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, heightPx);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= heightPx; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(widthPx, y);
      ctx.stroke();
    }

    // Optional left margin
    if (paperConfig.hasLeftMargin) {
      ctx.strokeStyle = paperConfig.marginLineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(paperConfig.leftMarginPx, 0);
      ctx.lineTo(paperConfig.leftMarginPx, heightPx);
      ctx.stroke();
    }
  } else if (paperConfig.type === 'dot') {
    const grid = paperConfig.gridSizePx || 30;
    ctx.fillStyle = paperConfig.lineColor;
    for (let x = grid; x < widthPx; x += grid) {
      for (let y = grid; y < heightPx; y += grid) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (paperConfig.type === 'exam') {
    // Ruled lines below header
    ctx.lineWidth = 1;
    ctx.strokeStyle = paperConfig.lineColor;
    const startY = paperConfig.topMarginPx;
    const endY = heightPx - paperConfig.bottomMarginPx;
    const lineSpacing = paperConfig.lineSpacingPx;

    for (let y = startY; y <= endY; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(widthPx, y);
      ctx.stroke();
    }

    // Left margin line
    ctx.strokeStyle = paperConfig.marginLineColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(paperConfig.leftMarginPx, startY);
    ctx.lineTo(paperConfig.leftMarginPx, heightPx);
    ctx.stroke();

    // Formal Exam Header Box
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 24, widthPx - 64, 110);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('LEMBAR JAWABAN TUGAS / UJIAN', 48, 48);

    ctx.font = '12px sans-serif';
    ctx.fillText(`Nama       : ${studentMeta?.studentName || '...........................................'}`, 48, 72);
    ctx.fillText(`Kelas / No : ${studentMeta?.studentClass || '.......................'}`, 48, 96);
    ctx.fillText(`Mapel      : ${studentMeta?.subject || '...........................................'}`, widthPx / 2 + 20, 72);
    ctx.fillText(`Tanggal    : ${studentMeta?.date || '.......................'}`, widthPx / 2 + 20, 96);

    ctx.strokeRect(widthPx - 130, 34, 80, 80);
    ctx.font = '11px sans-serif';
    ctx.fillText('Nilai:', widthPx - 105, 52);
  }

  // 3. Loose-leaf binder punched holes
  if (paperConfig.showHoles) {
    const holeX = 38;
    const holeRadius = 14;
    const holePositions = [heightPx * 0.2, heightPx * 0.5, heightPx * 0.8];

    for (const hy of holePositions) {
      ctx.save();
      // Outer subtle shadow
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.arc(holeX + 1, hy + 1, holeRadius + 1, 0, Math.PI * 2);
      ctx.fill();

      // Punch hole cutout
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(holeX, hy, holeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Hole border ring
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.restore();
}

export function renderHandwritingLine(
  ctx: CanvasRenderingContext2D,
  line: RenderedLine,
  paperConfig: PaperConfig,
  handwritingConfig: HandwritingStyleConfig,
  prng: () => number
) {
  const startX = paperConfig.hasLeftMargin ? paperConfig.leftMarginPx + 14 : paperConfig.leftMarginPx;
  let currentX = startX;

  const fontFamily = getFontFamilyById(handwritingConfig.fontId);
  const baseFontSize = handwritingConfig.fontSize;
  const baselineJitterMax = handwritingConfig.baselineJitter;
  const slantBase = (handwritingConfig.slantAngle * Math.PI) / 180;

  // First pass: Draw highlighters behind text
  for (const span of line.spans) {
    if (span.pen.isHighlighter) {
      ctx.save();
      ctx.fillStyle = span.pen.color;
      ctx.globalAlpha = span.pen.opacity || 0.4;
      const spanWidth = ctx.measureText(span.text).width || span.text.length * baseFontSize * 0.5;
      // Soft highlighter bar
      ctx.fillRect(currentX - 2, line.y - baseFontSize * 0.85, spanWidth + 4, baseFontSize * 1.05);
      ctx.restore();
    }
  }

  currentX = startX;

  // Second pass: Draw handwriting characters with natural jitter
  for (const span of line.spans) {
    const pen = span.pen;

    ctx.save();
    ctx.fillStyle = pen.color;
    ctx.globalAlpha = pen.opacity;

    // Pencil graphite stipple effect
    if (pen.id === 'pencil') {
      ctx.shadowColor = pen.color;
      ctx.shadowBlur = 0.5;
    }

    const chars = Array.from(span.text);

    for (let c = 0; c < chars.length; c++) {
      const char = chars[c];

      // Jitter values per glyph
      const charSeed = prng();
      const yJitter = (charSeed - 0.5) * 2 * baselineJitterMax;
      const sizeJitter = 1 + (prng() - 0.5) * 2 * handwritingConfig.sizeJitter;
      const angleJitter = slantBase + (prng() - 0.5) * 0.08;
      const spaceJitter = (prng() - 0.5) * handwritingConfig.spacingJitter;

      const charFontSize = Math.round(baseFontSize * sizeJitter * (span.isBold ? 1.08 : 1.0));
      ctx.font = `${span.isBold ? '600' : '400'} ${charFontSize}px ${fontFamily}`;

      ctx.save();
      ctx.translate(currentX, line.y + yJitter);
      ctx.rotate(angleJitter);

      ctx.fillText(char, 0, 0);

      // Natural stroke thickness simulation (slight multi-draw for ballpoint pressure variation)
      if (handwritingConfig.strokeVariation > 0.1 && (charSeed > 0.6 || span.isBold)) {
        ctx.globalAlpha = pen.opacity * 0.25;
        ctx.fillText(char, 0.4, 0.2);
      }

      ctx.restore();

      const metrics = ctx.measureText(char);
      const charWidth = metrics.width || charFontSize * 0.5;
      currentX += charWidth + handwritingConfig.letterSpacing + spaceJitter;
    }

    ctx.restore();
  }
}

export function renderPageToCanvas(
  canvas: HTMLCanvasElement,
  page: PageLayout,
  paperConfig: PaperConfig,
  handwritingConfig: HandwritingStyleConfig,
  studentMeta?: StudentProject['studentMeta']
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { widthPx, heightPx } = getCanvasDimensions(paperConfig.size);

  // Set real canvas pixel resolution
  if (canvas.width !== widthPx || canvas.height !== heightPx) {
    canvas.width = widthPx;
    canvas.height = heightPx;
  }

  // Draw paper template
  drawPaperBackground(ctx, paperConfig, studentMeta);

  // Initialize deterministic PRNG with seed offset by page index
  const pageSeed = (handwritingConfig.randomSeed + page.pageNumber * 10007) >>> 0;
  const prng = createPRNG(pageSeed);

  // Render each handwriting line
  for (const line of page.lines) {
    renderHandwritingLine(ctx, line, paperConfig, handwritingConfig, prng);
  }

  // Draw page number in footer
  ctx.save();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Hal. ${page.pageNumber}`, widthPx - paperConfig.rightMarginPx, heightPx - 24);
  ctx.restore();
}
