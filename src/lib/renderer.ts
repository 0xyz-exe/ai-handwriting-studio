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

  // 2. Paper line drawings (Only drawn if explicitly enabled)
  const shouldDrawLines = paperConfig.showLines === true;
  const shouldDrawMargins = paperConfig.showMargins === true;

  if (shouldDrawLines) {
    ctx.save();
    ctx.globalAlpha = paperConfig.lineOpacity ?? 0.5;
    if (paperConfig.lineStyle === 'dashed') ctx.setLineDash([6, 4]);
    else if (paperConfig.lineStyle === 'dotted') ctx.setLineDash([2, 3]);
    else ctx.setLineDash([]);

    if (paperConfig.type === 'ruled' || paperConfig.type === 'looseleaf') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = paperConfig.lineColor || '#93c5fd';

      const startY = paperConfig.topMarginPx || 96;
      const endY = heightPx - (paperConfig.bottomMarginPx || 64);
      const lineSpacing = paperConfig.lineSpacingPx || 32;

      // Double top header line
      ctx.beginPath();
      ctx.moveTo(0, startY - 8);
      ctx.lineTo(widthPx, startY - 8);
      ctx.moveTo(0, startY - 4);
      ctx.lineTo(widthPx, startY - 4);
      ctx.stroke();

      for (let y = startY; y <= endY; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();
      }
    } else if (paperConfig.type === 'folio') {
      // Double Folio Bergaris
      ctx.lineWidth = 1;
      ctx.strokeStyle = paperConfig.lineColor || '#93c5fd';

      const startY = paperConfig.topMarginPx || 80;
      const endY = heightPx - (paperConfig.bottomMarginPx || 64);
      const lineSpacing = paperConfig.lineSpacingPx || 30;

      for (let y = startY; y <= endY; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();
      }
    } else if (paperConfig.type === 'lined-3') {
      // Buku Garis 3 (Tulis Halus / Huruf Tegak Bersambung)
      const startY = paperConfig.topMarginPx || 96;
      const endY = heightPx - (paperConfig.bottomMarginPx || 64);
      const lineSpacing = paperConfig.lineSpacingPx || 38;

      for (let y = startY; y <= endY; y += lineSpacing) {
        // Main top and bottom lines
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = paperConfig.lineColor || '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();

        // Middle dashed helper line
        ctx.save();
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = paperConfig.subLineColor || '#93c5fd';
        ctx.beginPath();
        ctx.moveTo(0, y - lineSpacing * 0.5);
        ctx.lineTo(widthPx, y - lineSpacing * 0.5);
        ctx.stroke();
        ctx.restore();
      }
    } else if (paperConfig.type === 'grid' || paperConfig.type === 'grid-large') {
      const grid = paperConfig.gridSizePx || (paperConfig.type === 'grid-large' ? 42 : 26);
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = paperConfig.lineColor || '#cbd5e1';

      for (let x = 0; x <= widthPx; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
      }

      for (let y = 0; y <= heightPx; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();
      }
    } else if (paperConfig.type === 'millimeter') {
      // Kertas Milimeter Blok
      const subGrid = paperConfig.gridSizePx || 10;
      const majorGrid = subGrid * 5;

      // Minor lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = paperConfig.subLineColor || '#fdba74';
      for (let x = 0; x <= widthPx; x += subGrid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
      }
      for (let y = 0; y <= heightPx; y += subGrid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();
      }

      // Major lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = paperConfig.lineColor || '#f97316';
      for (let x = 0; x <= widthPx; x += majorGrid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, heightPx);
        ctx.stroke();
      }
      for (let y = 0; y <= heightPx; y += majorGrid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();
      }
    } else if (paperConfig.type === 'music') {
      // 5-line Stave systems
      const staveSpacing = 8;
      const systemSpacing = paperConfig.lineSpacingPx || 48;
      const startY = paperConfig.topMarginPx || 90;
      const endY = heightPx - (paperConfig.bottomMarginPx || 70);

      ctx.lineWidth = 1;
      ctx.strokeStyle = paperConfig.lineColor || '#1e293b';

      for (let sysY = startY; sysY <= endY; sysY += systemSpacing) {
        for (let s = 0; s < 5; s++) {
          const lineY = sysY + s * staveSpacing;
          ctx.beginPath();
          ctx.moveTo(40, lineY);
          ctx.lineTo(widthPx - 40, lineY);
          ctx.stroke();
        }
      }
    } else if (paperConfig.type === 'exam') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = paperConfig.lineColor || '#94a3b8';
      const startY = paperConfig.topMarginPx || 170;
      const endY = heightPx - (paperConfig.bottomMarginPx || 64);
      const lineSpacing = paperConfig.lineSpacingPx || 34;

      for (let y = startY; y <= endY; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(widthPx, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Margin line drawings (Only drawn if explicitly enabled)
  if (shouldDrawMargins) {
    ctx.save();
    ctx.globalAlpha = paperConfig.lineOpacity ? Math.min(1.0, paperConfig.lineOpacity * 1.3) : 0.65;
    if (paperConfig.hasLeftMargin && paperConfig.marginLineColor !== 'transparent') {
      ctx.strokeStyle = paperConfig.marginLineColor || '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(paperConfig.leftMarginPx || 105, 0);
      ctx.lineTo(paperConfig.leftMarginPx || 105, heightPx);
      ctx.stroke();
    }

    if (paperConfig.type === 'folio' && paperConfig.hasRightMargin) {
      const rightM = widthPx - (paperConfig.rightMarginPx || 60);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(rightM, 0);
      ctx.lineTo(rightM, heightPx);
      ctx.stroke();
    }
    ctx.restore();
  }

  if (paperConfig.type === 'exam') {

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
    if (pen.isPencil) {
      ctx.shadowColor = pen.color;
      ctx.shadowBlur = 0.6;
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

      if (pen.isPencil) {
        // Natural graphite texture simulation
        ctx.globalAlpha = (pen.opacity || 0.85) * (0.85 + prng() * 0.2);
        ctx.fillText(char, 0, 0);
        if (charSeed > 0.5) {
          ctx.globalAlpha = 0.18;
          ctx.fillText(char, (prng() - 0.5) * 0.5, (prng() - 0.5) * 0.5);
        }
      } else {
        ctx.fillText(char, 0, 0);
        // Natural stroke thickness simulation (slight multi-draw for ballpoint pressure variation)
        if (handwritingConfig.strokeVariation > 0.1 && (charSeed > 0.6 || span.isBold)) {
          ctx.globalAlpha = pen.opacity * 0.25;
          ctx.fillText(char, 0.4, 0.2);
        }
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
