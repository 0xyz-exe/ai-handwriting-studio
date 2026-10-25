import { PaperType, StudentProject } from '@/types';
import { DEFAULT_HANDWRITING_CONFIG } from './fonts';
import { createPaperConfig } from './paper-templates';

export interface SampleTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  paperType: PaperType;
  fontId: string;
  content: string;
  meta: StudentProject['studentMeta'];
}

export const SAMPLE_TEMPLATES: SampleTemplate[] = [
  {
    id: 'biologi-sel',
    title: 'Catatan Biologi: Struktur Sel',
    category: 'Sains SMA',
    description: 'Catatan multi-pena dengan judul biru, definisi merah, dan stabilo kuning.',
    paperType: 'ruled',
    fontId: 'caveat',
    meta: {
      studentName: 'Ahmad Faiz',
      studentClass: 'XI MIPA 2',
      subject: 'Biologi',
      date: '26 Oktober 2026',
    },
    content: `# BAB 3: STRUKTUR DAN FUNGSI SEL

Sel merupakan [red]unit struktural dan fungsional terkecil[/red] dari makhluk hidup.

### 1. Komponen Utama Sel
- [blue]Membran Plasma[/blue]: Mengatur keluar masuknya zat dan melindungi isi sel.
- [blue]Sitoplasma[/blue]: Cairan sel tempat berlangsungnya metabolisme.
- [blue]Nukleus[/blue]: Pusat kendali aktivitas sel dan pembawa materi genetik ([red]DNA[/red]).

### 2. Perbedaan Sel Tumbuhan & Sel Hewan
[hl]Sel Tumbuhan memiliki Dinding Sel dan Kloroplas[/hl], sedangkan sel hewan memiliki sentriol untuk pembelahan.

[pencil]Catatan tambahan: Kloroplas berperan penting dalam proses fotosintesis dengan bantuan cahaya matahari.[/pencil]`,
  },
  {
    id: 'matematika-kuadrat',
    title: 'Tugas Matematika: Persamaan Kuadrat',
    category: 'Matematika',
    description: 'Buku kotak dengan penulisan rumus matematika dan rumus kuadrat.',
    paperType: 'grid',
    fontId: 'kalam',
    meta: {
      studentName: 'Nabila Putri',
      studentClass: 'X SMA',
      subject: 'Matematika Wajib',
      date: '26 Oktober 2026',
    },
    content: `# TUGAS PERSAMAAN KUADRAT

Bentuk umum persamaan kuadrat:
[blue]a*x^2 + b*x + c = 0[/blue], dengan syarat [red]a != 0[/red].

### Soal 1:
Tentukan akar-akar dari [blue]x^2 - 5x + 6 = 0[/blue]

Langkah Penyelesaian:
1. Faktorkan persamaan kuadrat:
   (x - 2)(x - 3) = 0
2. Cari nilai x yang memenuhi:
   x - 2 = 0  => [red]x1 = 2[/red]
   x - 3 = 0  => [red]x2 = 3[/red]

Jadi himpunan penyelesaian adalah: [hl]{ 2, 3 }[/hl]`,
  },
  {
    id: 'lembar-ujian',
    title: 'Lembar Jawaban Ujian Harian',
    category: 'Ujian / Tugas',
    description: 'Format lembar jawaban resmi lengkap dengan tabel identitas dan nilai.',
    paperType: 'exam',
    fontId: 'patrick-hand',
    meta: {
      studentName: 'Rian Pratama',
      studentClass: 'XII IPS 1',
      subject: 'Ekonomi Bisnis',
      date: '26 Oktober 2026',
    },
    content: `1. Jelaskan yang dimaksud dengan hukum permintaan!
Jawaban:
[blue]Hukum permintaan menyatakan bahwa ketika harga suatu barang naik, maka jumlah barang yang diminta akan turun[/blue], ceteris paribus (faktor lain dianggap tetap).

2. Sebutkan faktor-faktor yang mempengaruhi penawaran:
a. [red]Biaya produksi[/red] (semakin tinggi biaya, penawaran cenderung berkurang)
b. Kemajuan teknologi yang digunakan
c. Pajak dan subsidi dari pemerintah
d. Jumlah produsen di pasar

3. Kesimpulan:
[hl]Keseimbangan pasar (Equilibrium) tercapai saat kurva permintaan berpotongan dengan kurva penawaran.[/hl]`,
  },
  {
    id: 'sejarah-indonesia',
    title: 'Rangkuman Sejarah: Sumpah Pemuda',
    category: 'Sosial & Sejarah',
    description: 'Gaya tulisan rapi pada kertas loose leaf binder.',
    paperType: 'looseleaf',
    fontId: 'indie-flower',
    meta: {
      studentName: 'Siti Rahma',
      studentClass: 'X-C',
      subject: 'Sejarah Indonesia',
      date: '28 Oktober 1928',
    },
    content: `# PERISTIWA SUMPAH PEMUDA 1928

Kongres Pemuda II diselenggarakan pada tanggal [red]27 - 28 Oktober 1928[/red] di Batavia.

### Isi Tiga Ikrar Sumpah Pemuda:
1. Kami putra dan putri Indonesia, mengaku [blue]bertumpah darah yang satu, tanah air Indonesia[/blue].
2. Kami putra dan putri Indonesia, mengaku [blue]berbangsa yang satu, bangsa Indonesia[/blue].
3. Kami putra dan putri Indonesia, menjunjung [blue]bahasa persatuan, bahasa Indonesia[/blue].

[pencil]Ketua Kongres: Sugondo Djojopuspito[/pencil]
[pencil]Lagu Kebangsaan Indonesia Raya pertama kali diperdengarkan oleh W.R. Supratman.[/pencil]`,
  },
];

export function createProjectFromTemplate(template: SampleTemplate): StudentProject {
  const paper = createPaperConfig(template.paperType, 'A4');
  return {
    id: `project-${Date.now()}`,
    title: template.title,
    content: template.content,
    paperConfig: paper,
    handwritingConfig: {
      ...DEFAULT_HANDWRITING_CONFIG,
      fontId: template.fontId,
    },
    activePen: 'ballpoint-black',
    customPenColors: {
      blue: '#1d4ed8',
      black: '#18181b',
      red: '#dc2626',
    },
    studentMeta: { ...template.meta },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
