export type PaperType =
  | 'ruled' // Buku Tulis SIDU biasa
  | 'folio' // Kertas Double Folio Bergaris (Standar Tugas Sekolah & Kuliah)
  | 'looseleaf' // Kertas Loose Leaf Binder Kampus (26/30 Ring)
  | 'grid' // Buku Kotak Matematika (5mm)
  | 'grid-large' // Buku Kotak Besar (10mm)
  | 'lined-3' // Buku Garis 3 (Tulis Halus / Tegak Bersambung)
  | 'exam' // Lembar Jawaban Ujian Resmi (UTS/UAS)
  | 'millimeter' // Kertas Milimeter Blok (Grafik Teknik/Sains)
  | 'music' // Kertas Not Balok Musik (5 Garis Paranada)
  | 'plain'; // Kertas Polos Ivory HVS

export type PaperSize = 'A4' | 'A5' | 'Letter' | 'B5' | 'Folio';
export type ViewMode = 'single' | 'double' | 'grid';
export type HandwritingPreset = 'neat' | 'natural' | 'expressive' | 'custom';

export type PenType =
  | 'ballpoint-blue'
  | 'ballpoint-black'
  | 'ballpoint-red'
  | 'ballpoint-green'
  | 'pencil' // Pensil 2B Standar
  | 'pencil-mechanical' // Pensil Mekanik 0.5mm
  | 'pencil-4b' // Pensil 4B Gelap
  | 'pencil-colored-red' // Pensil Warna Merah
  | 'pencil-colored-blue' // Pensil Warna Biru
  | 'highlighter';

export interface PenStyle {
  id: PenType;
  name: string;
  color: string;
  opacity: number;
  thickness: number; // multiplier e.g. 1.0, 1.2
  roughness: number; // 0 for smooth gel, 0.4 for pencil
  isHighlighter?: boolean;
  isPencil?: boolean;
}

export interface HandwritingFont {
  id: string;
  name: string;
  fontFamily: string;
  sourceUrl?: string;
  category: 'neat' | 'cursive' | 'casual' | 'architect';
  description: string;
}

export interface PaperConfig {
  type: PaperType;
  size: PaperSize;
  widthMm: number;
  heightMm: number;
  dpi: number;
  lineSpacingPx: number; // Ruled line height
  gridSizePx: number; // For grid / dot
  lineColor: string;
  subLineColor?: string;
  marginLineColor: string;
  hasLeftMargin: boolean;
  hasRightMargin?: boolean;
  leftMarginPx: number;
  topMarginPx: number;
  rightMarginPx: number;
  bottomMarginPx: number;
  backgroundColor: string;
  paperTexture: 'smooth' | 'subtle-cream' | 'vintage' | 'pure-white';
  showLines?: boolean;
  showMargins?: boolean;
  showHoles?: boolean; // Loose leaf rings
  showHeaderInfo?: boolean; // Exam header
}

export interface HandwritingStyleConfig {
  fontId: string;
  fontSize: number; // base font size in px
  lineHeightMultiplier: number;
  slantAngle: number; // in degrees, e.g. -5 to 15
  neatness: HandwritingPreset;
  baselineJitter: number; // px variation vertically
  sizeJitter: number; // % variation in glyph size
  spacingJitter: number; // px variation in letter spacing
  strokeVariation: number; // stroke width fluctuation
  wordSpacing: number; // px
  letterSpacing: number; // px
  randomSeed: number;
}

export interface FormattedSpan {
  text: string;
  pen: PenStyle;
  isBold?: boolean;
  isItalic?: boolean;
  isMath?: boolean;
  mathFormula?: string;
}

export interface RenderedLine {
  pageIndex: number;
  lineIndex: number; // Ruled line index on the page
  y: number; // baseline y in canvas pixels
  spans: FormattedSpan[];
  isHeader?: boolean;
}

export interface PageLayout {
  pageNumber: number;
  width: number;
  height: number;
  lines: RenderedLine[];
  overflow: boolean;
}

export interface StudentProject {
  id: string;
  title: string;
  content: string; // raw text with markdown/tags
  paperConfig: PaperConfig;
  handwritingConfig: HandwritingStyleConfig;
  activePen: PenType;
  customPenColors: {
    blue: string;
    black: string;
    red: string;
  };
  studentMeta: {
    studentName: string;
    studentClass: string;
    subject: string;
    date: string;
  };
  createdAt: number;
  updatedAt: number;
}
