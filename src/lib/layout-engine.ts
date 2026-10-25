import { FormattedSpan, PageLayout, PaperConfig, PenStyle, PenType, RenderedLine } from '@/types';
import { getCanvasDimensions } from './paper-templates';
import { DEFAULT_PENS, getPenStyle } from './pens';

// Fast character width approximation when canvas context is unavailable (e.g. SSR or headless tests)
export function estimateTextWidth(text: string, fontSize: number, letterSpacing = 0): number {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === ' ') {
      width += fontSize * 0.35;
    } else if (/[ijlI1.,;!'|]/.test(char)) {
      width += fontSize * 0.28;
    } else if (/[mwMW@%#]/.test(char)) {
      width += fontSize * 0.85;
    } else if (/[A-Z]/.test(char)) {
      width += fontSize * 0.65;
    } else {
      width += fontSize * 0.52;
    }
    width += letterSpacing;
  }
  return width;
}

export interface ParseOptions {
  activeDefaultPen: PenType;
  customPenColors?: { blue?: string; black?: string; red?: string };
}

// Parses raw markup text into array of formatted spans per line
export function parseLineToSpans(rawLine: string, options: ParseOptions): { isHeader: boolean; spans: FormattedSpan[] } {
  let line = rawLine;
  let isHeader = false;
  let defaultPen = getPenStyle(options.activeDefaultPen, options.customPenColors);

  // Markdown headers auto-styled with Blue Pen for student notebook title convention
  if (line.startsWith('# ')) {
    isHeader = true;
    line = line.substring(2).trim();
    defaultPen = getPenStyle('ballpoint-blue', options.customPenColors);
  } else if (line.startsWith('## ')) {
    isHeader = true;
    line = line.substring(3).trim();
    defaultPen = getPenStyle('ballpoint-blue', options.customPenColors);
  } else if (line.startsWith('### ')) {
    isHeader = true;
    line = line.substring(4).trim();
    defaultPen = getPenStyle('ballpoint-green', options.customPenColors);
  }

  // Regex to match tags like [blue]...[/blue], [red]...[/red], [pencil]...[/pencil], [hl]...[/hl], $math$
  // Tokenizer for tags and regular text
  const tagRegex = /(\[(?:blue|black|red|green|pencil|pencil-mech|pencil-4b|pencil-red|pencil-blue|hl(?::[a-z]+)?)\][\s\S]*?\[\/(?:blue|black|red|green|pencil|pencil-mech|pencil-4b|pencil-red|pencil-blue|hl)\]|\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;

  const parts = line.split(tagRegex);
  const spans: FormattedSpan[] = [];

  for (const part of parts) {
    if (!part) continue;

    // Check if it's a math expression
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const formula = part.slice(2, -2).trim();
      spans.push({
        text: formula,
        pen: defaultPen,
        isMath: true,
        mathFormula: formula,
      });
      continue;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1).trim();
      spans.push({
        text: formula,
        pen: defaultPen,
        isMath: true,
        mathFormula: formula,
      });
      continue;
    }

    // Check if it's a tagged pen block
    const penMatch = part.match(/^\[(blue|black|red|green|pencil|pencil-mech|pencil-4b|pencil-red|pencil-blue|hl(?::([a-z]+))?)\]([\s\S]*?)\[\/(?:blue|black|red|green|pencil|pencil-mech|pencil-4b|pencil-red|pencil-blue|hl)\]$/);
    if (penMatch) {
      const tag = penMatch[1];
      const innerText = penMatch[3];
      let pen: PenStyle = defaultPen;

      if (tag === 'blue') pen = getPenStyle('ballpoint-blue', options.customPenColors);
      else if (tag === 'black') pen = getPenStyle('ballpoint-black', options.customPenColors);
      else if (tag === 'red') pen = getPenStyle('ballpoint-red', options.customPenColors);
      else if (tag === 'green') pen = getPenStyle('ballpoint-green', options.customPenColors);
      else if (tag === 'pencil') pen = getPenStyle('pencil', options.customPenColors);
      else if (tag === 'pencil-mech') pen = getPenStyle('pencil-mechanical', options.customPenColors);
      else if (tag === 'pencil-4b') pen = getPenStyle('pencil-4b', options.customPenColors);
      else if (tag === 'pencil-red') pen = getPenStyle('pencil-colored-red', options.customPenColors);
      else if (tag === 'pencil-blue') pen = getPenStyle('pencil-colored-blue', options.customPenColors);
      else if (tag.startsWith('hl')) {
        pen = getPenStyle('highlighter', options.customPenColors);
        const colorName = penMatch[2];
        if (colorName === 'green') pen.color = '#bbf7d0';
        else if (colorName === 'pink') pen.color = '#fbcfe8';
        else if (colorName === 'blue') pen.color = '#bae6fd';
        else if (colorName === 'yellow') pen.color = '#fef08a';
      }

      spans.push({
        text: innerText,
        pen,
        isBold: isHeader,
      });
      continue;
    }

    // Default plain text span
    spans.push({
      text: part,
      pen: defaultPen,
      isBold: isHeader,
    });
  }

  return { isHeader, spans };
}

// Breaks a set of spans into multiple lines if they exceed max printable width
export function wrapSpansToLines(
  spans: FormattedSpan[],
  maxPrintableWidth: number,
  fontSize: number,
  letterSpacing: number,
  measureTextFn?: (text: string) => number
): FormattedSpan[][] {
  const measure = measureTextFn || ((t: string) => estimateTextWidth(t, fontSize, letterSpacing));

  const wrappedLines: FormattedSpan[][] = [];
  let currentLineSpans: FormattedSpan[] = [];
  let currentLineWidth = 0;

  for (const span of spans) {
    if (span.isMath) {
      // Treat math block as an atomic unit or measure
      const mathWidth = measure(span.text);
      if (currentLineWidth + mathWidth > maxPrintableWidth && currentLineSpans.length > 0) {
        wrappedLines.push(currentLineSpans);
        currentLineSpans = [span];
        currentLineWidth = mathWidth;
      } else {
        currentLineSpans.push(span);
        currentLineWidth += mathWidth;
      }
      continue;
    }

    // Split words in text span
    const words = span.text.split(/(\s+)/); // Keep whitespace separators
    let accumulatedText = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;

      const wordWidth = measure(word);

      if (currentLineWidth + wordWidth > maxPrintableWidth && (currentLineSpans.length > 0 || accumulatedText.length > 0)) {
        if (accumulatedText.length > 0) {
          currentLineSpans.push({ ...span, text: accumulatedText });
          accumulatedText = '';
        }
        wrappedLines.push(currentLineSpans);
        currentLineSpans = [];
        currentLineWidth = 0;

        // If it starts with spaces at the start of a wrapped line, trim them
        if (word.trim() === '') {
          continue;
        }
      }

      accumulatedText += word;
      currentLineWidth += wordWidth;
    }

    if (accumulatedText.length > 0) {
      currentLineSpans.push({ ...span, text: accumulatedText });
    }
  }

  if (currentLineSpans.length > 0 || wrappedLines.length === 0) {
    wrappedLines.push(currentLineSpans);
  }

  return wrappedLines;
}

export interface SmartPageFitResult {
  pages: PageLayout[];
  totalPages: number;
  totalLines: number;
}

// Smart Page Fitting: Fits text onto notebook ruled lines and divides into pages
export function calculateDocumentLayout(
  content: string,
  paperConfig: PaperConfig,
  fontSize: number,
  letterSpacing: number,
  options: ParseOptions,
  measureTextFn?: (text: string) => number
): SmartPageFitResult {
  const { widthPx, heightPx } = getCanvasDimensions(paperConfig.size);

  const leftMargin = paperConfig.leftMarginPx;
  const rightMargin = paperConfig.rightMarginPx;
  const topMargin = paperConfig.topMarginPx;
  const bottomMargin = paperConfig.bottomMarginPx;
  const lineSpacing = paperConfig.lineSpacingPx;

  const printableWidth = Math.max(100, widthPx - leftMargin - rightMargin);
  const printableHeight = Math.max(100, heightPx - topMargin - bottomMargin);

  // Maximum ruled lines that fit physically on this paper page
  const maxLinesPerPage = Math.max(1, Math.floor(printableHeight / lineSpacing));

  const rawParagraphs = content.split('\n');
  const pages: PageLayout[] = [];

  let currentPageIndex = 0;
  let currentLines: RenderedLine[] = [];
  let currentLineIndex = 0; // index on current page (0 to maxLinesPerPage - 1)

  const flushPage = () => {
    pages.push({
      pageNumber: currentPageIndex + 1,
      width: widthPx,
      height: heightPx,
      lines: currentLines,
      overflow: false,
    });
    currentPageIndex++;
    currentLines = [];
    currentLineIndex = 0;
  };

  for (let p = 0; p < rawParagraphs.length; p++) {
    const rawLine = rawParagraphs[p];

    // Explicit manual page break marker
    if (rawLine.trim() === '---' || rawLine.trim() === '[pagebreak]') {
      if (currentLines.length > 0) {
        flushPage();
      }
      continue;
    }

    // Blank line in notes: take up one blank ruled line
    if (rawLine.trim() === '') {
      if (currentLineIndex >= maxLinesPerPage) {
        flushPage();
      }
      currentLines.push({
        pageIndex: currentPageIndex,
        lineIndex: currentLineIndex,
        y: topMargin + currentLineIndex * lineSpacing + lineSpacing * 0.75,
        spans: [],
      });
      currentLineIndex++;
      continue;
    }

    const { isHeader, spans } = parseLineToSpans(rawLine, options);
    const wrappedLines = wrapSpansToLines(spans, printableWidth, fontSize, letterSpacing, measureTextFn);

    for (let w = 0; w < wrappedLines.length; w++) {
      const lineSpans = wrappedLines[w];

      // Page boundary check: If page is full, start new page
      if (currentLineIndex >= maxLinesPerPage) {
        flushPage();
      }

      // Baseline y position perfectly sits on or right above the notebook ruled line
      const baselineY = topMargin + currentLineIndex * lineSpacing + lineSpacing * 0.78;

      currentLines.push({
        pageIndex: currentPageIndex,
        lineIndex: currentLineIndex,
        y: baselineY,
        spans: lineSpans,
        isHeader,
      });

      currentLineIndex++;
    }
  }

  // Flush remaining page
  flushPage();

  return {
    pages,
    totalPages: pages.length,
    totalLines: pages.reduce((acc, p) => acc + p.lines.length, 0),
  };
}
