import { HandwritingFont, HandwritingPreset, HandwritingStyleConfig } from '@/types';

export const HANDWRITING_FONTS: HandwritingFont[] = [
  // 1. Rapi & Siswa Teladan (Neat)
  {
    id: 'kalam',
    name: 'Kalam (Bolpoin Gel Rapi)',
    fontFamily: '"Kalam", cursive',
    category: 'neat',
    description: 'Bentuk huruf tegas seperti ditulis bolpoin gel, sangat jelas dan terbaca.',
  },
  {
    id: 'patrick-hand',
    name: 'Patrick Hand (Buku Sekolah)',
    fontFamily: '"Patrick Hand", cursive',
    category: 'neat',
    description: 'Tulisan cetak rapi seperti siswa teladan, ideal untuk tugas sekolah.',
  },
  {
    id: 'dekko',
    name: 'Dekko (Catatan Rapi Terbaca)',
    fontFamily: '"Dekko", cursive',
    category: 'neat',
    description: 'Gaya tulisan tangan tegak rapi, nyaman untuk materi panjang.',
  },
  {
    id: 'pangolin',
    name: 'Pangolin (Cetak Bulat Teratur)',
    fontFamily: '"Pangolin", cursive',
    category: 'neat',
    description: 'Bentuk bulat simetris ala catatan tugas sekolah menengah.',
  },
  {
    id: 'neucha',
    name: 'Neucha (Tegak Alami & Jelas)',
    fontFamily: '"Neucha", cursive',
    category: 'neat',
    description: 'Tulisan tangan tegak lurus dengan keterbacaan tinggi.',
  },
  {
    id: 'klee-one',
    name: 'Klee One (Buku Teks Terstruktur)',
    fontFamily: '"Klee One", cursive',
    category: 'neat',
    description: 'Huruf dengan proporsi presisi ala buku cetak catatan resmi.',
  },
  {
    id: 'covered-by-your-grace',
    name: 'Covered By Your Grace (Spidol Halus)',
    fontFamily: '"Covered By Your Grace", cursive',
    category: 'neat',
    description: 'Gaya goresan tegas seperti ditulis spidol marker tipis.',
  },

  // 2. Santai & Catatan Kuliah (Casual)
  {
    id: 'caveat',
    name: 'Caveat (Catatan Santai)',
    fontFamily: '"Caveat", cursive',
    category: 'casual',
    description: 'Tulisan tangan santai dan natural, sangat populer untuk catatan kuliah.',
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower (Bulat Ceria)',
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
    id: 'nanum-pen',
    name: 'Nanum Pen (Pulpen Halus)',
    fontFamily: '"Nanum Pen Script", cursive',
    category: 'casual',
    description: 'Goresan pulpen natural dengan ritme tulisan tangan santai.',
  },
  {
    id: 'nothing-you-could-do',
    name: 'Nothing You Could Do (Natural Mahasiswa)',
    fontFamily: '"Nothing You Could Do", cursive',
    category: 'casual',
    description: 'Tulisan catatan kuliah autentik dengan variasi goresan bebas.',
  },
  {
    id: 'gochi-hand',
    name: 'Gochi Hand (Catatan Komik Ceria)',
    fontFamily: '"Gochi Hand", cursive',
    category: 'casual',
    description: 'Tulisan tangan bulat modern dengan ujung tumpul yang ramah.',
  },
  {
    id: 'over-the-rainbow',
    name: 'Over the Rainbow (Bebas Ekspresif)',
    fontFamily: '"Over the Rainbow", cursive',
    category: 'casual',
    description: 'Tulisan tangan santai mengalir tanpa batas garis yang kaku.',
  },
  {
    id: 'reenie-beanie',
    name: 'Reenie Beanie (Pensil Ringan)',
    fontFamily: '"Reenie Beanie", cursive',
    category: 'casual',
    description: 'Goresan tipis memanjang, cocok untuk simulasi pensil mekanik.',
  },
  {
    id: 'waiting-for-the-sunrise',
    name: 'Waiting for Sunrise (Pensil Ramping)',
    fontFamily: '"Waiting for the Sunrise", cursive',
    category: 'casual',
    description: 'Huruf tinggi dan tipis ala catatan pensil di pinggir kertas.',
  },
  {
    id: 'just-another-hand',
    name: 'Just Another Hand (Catatan Rapat)',
    fontFamily: '"Just Another Hand", cursive',
    category: 'casual',
    description: 'Gaya tulisan sempit dan padat untuk rangkuman satu lembar.',
  },

  // 3. Sambung Tradisional & Kursif (Cursive)
  {
    id: 'homemade-apple',
    name: 'Homemade Apple (Sambung Klasik)',
    fontFamily: '"Homemade Apple", cursive',
    category: 'cursive',
    description: 'Tulisan tegak bersambung tradisional dan elegan.',
  },
  {
    id: 'marck-script',
    name: 'Marck Script (Sambung Kaligrafi)',
    fontFamily: '"Marck Script", cursive',
    category: 'cursive',
    description: 'Gaya kursif halus dengan lekukan tinta pena kaligrafi.',
  },
  {
    id: 'cedarville-cursive',
    name: 'Cedarville Cursive (Sambung Cepat Guru)',
    fontFamily: '"Cedarville Cursive", cursive',
    category: 'cursive',
    description: 'Gaya tulisan sambung mengalir khas guru saat menulis di buku nilai.',
  },
  {
    id: 'bad-script',
    name: 'Bad Script (Kursif Miring Ramping)',
    fontFamily: '"Bad Script", cursive',
    category: 'cursive',
    description: 'Tulisan kursif modern dengan sudut kemiringan alami.',
  },
  {
    id: 'dawning-of-a-new-day',
    name: 'Dawning of a New Day (Sambung Ringkas)',
    fontFamily: '"Dawning of a New Day", cursive',
    category: 'cursive',
    description: 'Tulisan sambung ramping dengan ekor huruf panjang.',
  },

  // 4. Huruf Balok & Gambar Teknik (Architect / Expressive)
  {
    id: 'architects-daughter',
    name: 'Architects Daughter (Catatan Teknik)',
    fontFamily: '"Architects Daughter", cursive',
    category: 'architect',
    description: 'Huruf balok tegas ala gambar teknik dan matematika.',
  },
  {
    id: 'gloria-hallelujah',
    name: 'Gloria Hallelujah (Papan Tulis Guru)',
    fontFamily: '"Gloria Hallelujah", cursive',
    category: 'expressive',
    description: 'Bentuk huruf tebal tegas khas tulisan guru di papan tulis.',
  },
  {
    id: 'walter-turncoat',
    name: 'Walter Turncoat (Kapur Tulis)',
    fontFamily: '"Walter Turncoat", cursive',
    category: 'expressive',
    description: 'Goresan bertekstur kapur tulis dengan karakter kuat.',
  },
  {
    id: 'amatic-sc',
    name: 'Amatic SC (Balok Rangkuman)',
    fontFamily: '"Amatic SC", cursive',
    category: 'architect',
    description: 'Huruf kapital tinggi ramping untuk judul bab atau mind map.',
  },
  {
    id: 'rock-salt',
    name: 'Rock Salt (Spidol Ekspresif)',
    fontFamily: '"Rock Salt", cursive',
    category: 'expressive',
    description: 'Gaya goresan spidol permanen yang berani dan mencolok.',
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
