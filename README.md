# AI Handwriting Studio

Studio tulisan tangan digital interaktif untuk pelajar, mahasiswa, dan guru. Mengubah catatan teks, tugas, rangkuman, dan jawaban soal menjadi simulasi tulisan tangan realistis pada beragam jenis kertas buku tulis bergaris, kotak-kotak matematika, loose-leaf binder, dan lembar jawaban ujian resmi.

## Fitur Utama

1. **Handwriting Style Library**
   - 9 pilihan jenis gaya tulisan tangan realistis (Caveat, Kalam, Patrick Hand, Indie Flower, Shadows Into Light, Architects Daughter, Homemade Apple, Marck Script, Reenie Beanie).
   - Preset kerapian (Rapi, Alami, Cepat/Ekspresif) dan pengaturan kustom.
   - Pengaturan ukuran font, kemiringan tulisan (slant), variasi garis dasar (baseline jitter), jarak antarhuruf, dan variasi tekanan tinta.
   - Tombol **Acak Ulang Variasi Tulisan** dengan random seed deterministik.

2. **Smart Page Fitting**
   - Penyesuaian otomatis teks pada garis buku tulis tanpa terpotong atau keluar dari batas halaman.
   - Paginasi otomatis multi-halaman saat baris tulisan melebihi kapasitas kertas.
   - Mendukung ukuran fisik A4, A5, Letter, dan B5.

3. **Multi-Pen Writing**
   - Mendukung bolpoin biru (judul/header), bolpoin hitam (isi catatan), bolpoin merah (poin penting/koreksi), bolpoin hijau, pensil 2B bertekstur, dan stabilo kuning (highlight).
   - Penggunaan tag inline seperti `[blue]judul[/blue]`, `[red]koreksi[/red]`, `[pencil]sketsa[/pencil]`, `[hl]penting[/hl]`.
   - Rumus matematika `$x = ...$` dan pembagi halaman manual `---`.

4. **Paper Preview & Print Mode**
   - Pilihan tampilan: 1 Halaman (fokus), 2 Halaman Berdampingan (buku terbuka dengan bayangan lipatan buku/spine tengah), dan Semua Halaman.
   - Pilihan kertas:
     - Buku Bergaris Sekolah (SIDU) dengan margin merah
     - Buku Kotak Matematika (Grid 5mm)
     - Kertas Loose Leaf Binder (dengan 3 lubang ring binder)
     - Lembar Jawaban Tugas / Ujian Resmi (dengan tabel Nama, Kelas, Mapel, Tanggal, dan Nilai)
     - Kertas Polos Krem Vintage
   - Ekspor: Unduh PDF resmi sesuai ukuran kertas, unduh gambar PNG resolusi tinggi, dan Mode Cetak Langsung (Print Mode).

5. **AI Catatan Studio**
   - Asisten AI cerdas untuk:
     - Merapikan struktur catatan
     - Memperbaiki ejaan & tanda baca (PUEBI)
     - Membuat rangkuman materi
     - Memformat soal & pembahasan
     - Parafrase gaya bahasa siswa
   - Dilengkapi fallback offline cerdas tanpa membutuhkan API key eksternal.

6. **Import Dokumen & OCR Foto Soal**
   - Ekstraksi dokumen `.docx` (Word) dan `.txt`.
   - OCR foto lembar soal atau papan tulis dengan Tesseract.js (Bahasa Indonesia & English) lengkap dengan progress bar.

7. **Penyimpanan Lokal & Galeri Template**
   - Autosave real-time ke penyimpanan browser (LocalStorage).
   - Contoh template siswa: Biologi Sel, Tugas Matematika Kuadrat, Lembar Ujian Resmi, Sejarah Sumpah Pemuda.

---

## Panduan Instalasi & Menjalankan

### Prasyarat
- Node.js >= 18
- npm atau pnpm

### Instalasi Dependensi
```bash
npm install
```

### Menjalankan Mode Development
```bash
npm run dev
```
Akses di browser pada: `http://localhost:3000`

### Menjalankan Pengujian (Testing)
```bash
npm test
```

### Build Produksi
```bash
npm run build
npm start
```

### Menjalankan dengan Docker
```bash
docker compose up -d
```
