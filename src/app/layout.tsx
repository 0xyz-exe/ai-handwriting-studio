import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Handwriting Studio — Studio Tulisan Tangan Digital Siswa & Mahasiswa',
  description:
    'Ubah catatan, tugas, rangkuman, dan jawaban soal menjadi tulisan tangan digital realistis pada berbagai buku tulis bergaris, kotak, loose leaf, dan lembar ujian resmi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
