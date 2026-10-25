import { HandwritingFont, HandwritingPreset, HandwritingStyleConfig } from '@/types';

export const HANDWRITING_FONTS: HandwritingFont[] = [
  {
    id: 'caveat',
    name: 'Caveat (Catatan Santai)',
    fontFamily: '"Caveat", cursive',
    category: 'casual',
    description: 'Tulisan tangan santai dan natural, sangat populer untuk catatan kuliah.',
  },
  {
    id: 'kalam',
    name: 'Kalam (Bolpoin Rapi)',
    fontFamily: '"Kalam", cursive',
    category: 'neat',
    description: 'Bentuk huruf tegas seperti ditulis bolpoin gel, sangat jelas dan terbaca.',
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand (Buku Pelajaran)',
    fontFamily: '"Patrick Hand", cursive',
    category: 'neat',
    description: 'Tulisan cetak rapi seperti siswa teladan, ideal untuk tugas sekolah.',
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower (Bulat Bersahabat)',
    fontFamily: '"Indie Flower", cursive',
    category: 'casual',
    description: 'Bentuk huruf bulat, ceria, dan mudah dibaca pada buku bergaris.',
  },
  {
    id: 'shadows-into-light',
    name: 'Shadows Into Light (Catatan Cepat)',
    fontFamily: '"Shadows Into Light", cursive',
    category: 'casual',
    description: 'Gaya goresan cepat seperti mencatat penjelasan dosen di kelas.',
  },
  {
    id: 'architects-daughter',
    name: 'Architects Daughter (Catatan Teknik)',
    fontFamily: '"Architects Daughter", cursive',
    category: 'architect',
    description: 'Huruf balok tegas ala gambar teknik dan matematika.',
  },
  {
    id: 'homemade-apple',
    name: 'Homemade Apple (Sambung Klasik)',
    fontFamily: '"Homemade Apple", cursive',
    category: 'cursive',
    description: 'Tulisan tegak bersambung tradisional dan elegan.',
  },
  {
    id: 'marck-script',
    name: 'Marck Script (Sambung Halus)',
    fontFamily: '"Marck Script", cursive',
    category: 'cursive',
    description: 'Gaya kursif halus dengan lekukan tinta pena kaligrafi.',
  },
  {
    id: 'reenie-beanie',
    name: 'Reenie Beanie (Pensil Ringan)',
    fontFamily: '"Reenie Beanie", cursive',
    category: 'casual',
    description: 'Goresan tipis memanjang, cocok untuk simulasi pensil mekanik.',
  },
];

export const NEATNESS_PRESETS: Record<HandwritingPreset, Partial<HandwritingStyleConfig>> = {
  neat: {
    neatness: 'neat',
    baselineJitter: 0.4,
    sizeJitter: 0.02,
    spacingJitter: 0.3,
    strokeVariation: 0.05,
    slantAngle: 1,
  },
  natural: {
    neatness: 'natural',
    baselineJitter: 1.5,
    sizeJitter: 0.06,
    spacingJitter: 1.0,
    strokeVariation: 0.15,
    slantAngle: 3,
  },
  expressive: {
    neatness: 'expressive',
    baselineJitter: 2.8,
    sizeJitter: 0.12,
    spacingJitter: 2.2,
    strokeVariation: 0.28,
    slantAngle: 6,
  },
  custom: {
    neatness: 'custom',
  },
};

export const DEFAULT_HANDWRITING_CONFIG: HandwritingStyleConfig = {
  fontId: 'caveat',
  fontSize: 22,
  lineHeightMultiplier: 1.0,
  slantAngle: 2,
  neatness: 'natural',
  baselineJitter: 1.2,
  sizeJitter: 0.05,
  spacingJitter: 0.8,
  strokeVariation: 0.12,
  wordSpacing: 8,
  letterSpacing: 0.5,
  randomSeed: 12345,
};

export function getFontFamilyById(fontId: string): string {
  const font = HANDWRITING_FONTS.find((f) => f.id === fontId);
  return font ? font.fontFamily : '"Caveat", cursive';
}
