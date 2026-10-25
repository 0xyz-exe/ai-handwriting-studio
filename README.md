# AI Handwriting Studio ✍️

> **Studio Tulisan Tangan Digital Interaktif untuk Pelajar, Mahasiswa, Guru, dan Dosen.**  
> Mengubah teks, catatan, jawaban soal, rangkuman, dan materi pembelajaran menjadi simulasi tulisan tangan digital yang realistis pada berbagai jenis buku tulis bergaris, folio, loose leaf binder, kotak matematika, dan lembar ujian resmi.

---

## 📸 Tampilan Aplikasi & Preview Hasil

![Preview Catatan Tulisan Tangan Digital](docs/screenshots/preview-catatan-biologi.png)
*Contoh hasil catatan Biologi Sel dengan kombinasi Bolpoin Biru (Judul), Bolpoin Hitam (Isi Catatan), Bolpoin Merah (Kata Kunci), Stabilo Kuning, dan Pensil 2B pada kertas bergaris rapi.*

---

## 🚀 Panduan & Tata Cara Penggunaan

Aplikasi ini dirancang sebagai studio catatan tulisan tangan digital yang fleksibel. Berikut langkah-langkah penggunaannya:

### 1. Memasukkan Materi & Memilih Alat Tulis
- Tulis langsung materi catatan pada panel **Editor** di sebelah kiri, atau tempel (*paste*) teks dari dokumen lain.
- **Kombinasi Multi-Pena & Pensil**:
  - Blok kata/kalimat yang ingin diubah gayanya, lalu klik tombol alat tulis di atas editor:
    - **Pena Biru (`[blue]`)**: Standar untuk Judul Bab atau Sub-judul.
    - **Pena Hitam (`[black]`)**: Standar untuk isi materi catatan umum.
    - **Pena Merah (`[red]`)**: Untuk istilah penting, kata kunci, rumus, atau poin koreksi.
    - **Pena Hijau (`[green]`)**: Untuk klasifikasi atau sub-bab.
    - **Pensil 2B (`[pencil]`)**: Untuk catatan ringan atau sketsa dengan tekstur grafit realistis.
    - **Pensil Mekanik 0.5mm (`[pencil-mech]`)**: Goresan tipis, tajam, dan presisi tinggi.
    - **Pensil 4B Gelap (`[pencil-4b]`)**: Goresan tebal dan empuk bertekstur.
    - **Pensil Warna Merah / Biru (`[pencil-red]` / `[pencil-blue]`)**: Untuk sketsa diagram & grafik.
    - **Stabilo Kuning (`[hl]`)**: Menandai baris/kalimat penting yang wajib dihafal.
  - **Rumus Matematika**: Masukkan rumus dengan sintaks KaTeX `$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$`.
  - **Bagi Halaman Manual**: Masukkan pemisah baris `---` untuk memulai halaman baru.

### 2. Navigasi Kanvas & Kursor Geser Bebas (*Free Drag-to-Pan*)
- **Mode Tampilan**:
  - `1 Halaman`: Tampilan fokus per halaman tunggal.
  - `2 Halaman (Buku)`: Simulasi buku catatan terbuka berdampingan lengkap dengan efek bayangan lipatan tengah (*spine shadow*).
  - `Semua`: Tampilan vertikal seluruh lembar halaman.
- **Geser Bebas (Free Hand Pan)**:
  - Tekan dan tahan tombol mouse (kiri) di area kanvas, lalu geser (*drag*) ke segala arah secara bebas untuk memposisikan kertas.
  - Gunakan kontrol zoom (`+` dan `-`) untuk mengatur pembesaran dari 35% hingga 180%.
  - Klik tombol **Reset Posisi & Zoom** (`RotateCcw`) untuk mengembalikan posisi kanvas ke tengah layar.

### 3. Memilih Jenis Kertas & Kustomisasi Garis Buku
Pilih kertas langsung melalui **Quick Paper Bar** di atas kanvas atau melalui tab **Kertas & Ukuran** di sidebar kanan:
1. **Buku Tulis SIDU (Sekolah)**: Garis biru beraturan dengan garis margin merah kiri.
2. **Kertas Double Folio Bergaris**: Standar tugas sekolah & kuliah (margin kiri ganda & garis tepi kanan).
3. **Kertas Loose Leaf Binder Kampus**: Dilengkapi 26 lubang ring binder khas mahasiswa.
4. **Buku Kotak Matematika (5mm)**: Grid kotak presisi untuk perhitungan sains dan rumus.
5. **Buku Kotak Besar (10mm)**: Grid kotak besar untuk anak SD, angka, dan aksara/hanzi.
6. **Buku Garis 3 Tulis Halus**: Garis bantu tengah putus-putus untuk huruf tegak bersambung.
7. **Lembar Ujian Resmi (UTS/UAS)**: Tabel formal identitas siswa, mapel, tanggal, dan kotak nilai.
8. **Kertas Milimeter Blok**: Kertas grafik oranye mikro untuk praktikum teknik & fisika.
9. **Kertas Not Balok Musik**: 5 garis paranada (*stave lines*) seni budaya.
10. **Kertas Polos Ivory HVS**: Kertas bersih tanpa garis untuk catatan bebas & diagram.

- **Kustomisasi Garis**:
  - Matikan garis melalui tombol **`Garis: Mati`** di toolbar jika menginginkan kertas bersih tanpa garis yang mengganggu.
  - Jika garis dinyalakan, pilih dari **8 variasi warna garis** (Biru SIDU, Abu Minimalis Kokuyo, Cokelat Sepia Moleskine, Hijau Sains, Oranye Milimeter, Lavender, Arang Hitam, Koral Merah).
  - Atur slider **Kepekatan Garis (Opasitas)** dari 10% (sangat samar) hingga 100% (tegas).

### 4. Bantuan AI Catatan Studio & OCR Dokumen
- Klik tombol **AI Catatan** pada navbar:
  - *Rapikan Struktur Catatan*: Mengubah teks mentah menjadi outline terstruktur dengan judul dan poin-poin rapi.
  - *Perbaiki Ejaan (PUEBI)*: Memperbaiki kesalahan ketik, tanda baca, huruf kapital, dan partikel bahasa Indonesia.
  - *Buat Rangkuman Inti*: Meringkas materi panjang menjadi poin-poin catatan penting.
  - *Format Soal & Jawaban*: Menyusun daftar soal latihan dan langkah pembahasannya.
  - *Parafrase Gaya Siswa*: Menulis ulang teks dengan bahasa catatan siswa yang natural.
  - Dilengkapi perbandingan *Diff View* (Teks Asli vs Hasil AI) sebelum diterapkan ke editor.
- Klik tombol **Import / OCR**:
  - Ekstrak dokumen Word (`.docx`) atau teks polos (`.txt`).
  - OCR foto lembar soal atau papan tulis dengan **Tesseract.js** (mendukung Bahasa Indonesia dan English) dengan progress bar real-time.

### 5. Ekspor Dokumen & Siap Cetak
- Klik tombol **Ekspor PDF** di kanan atas:
  - **Unduh PDF**: Menghasilkan dokumen PDF multi-halaman sesuai ukuran fisik kertas yang dipilih (A4, A5, Folio F4, Letter, B5).
  - **Unduh Gambar PNG**: Menyimpan setiap halaman menjadi gambar berkualitas tinggi (300 DPI equivalent).
  - **Mode Cetak Langsung (Print Mode)**: Membuka dialog print browser untuk langsung mencetak ke kertas fisik.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Rendering Engine**: HTML5 Canvas rendering dengan simulasi goresan tinta, variasi sudut kemiringan (*slant*), variasi garis dasar (*baseline jitter*), variasi ukuran karakter, dan tekstur grafit pensil.
- **Handwriting Fonts**: 9 webfont tulisan tangan (Caveat, Kalam, Patrick Hand, Indie Flower, Shadows Into Light, Architects Daughter, Homemade Apple, Marck Script, Reenie Beanie).
- **OCR Engine**: Tesseract.js (Client-side worker dengan dukungan bahasa Indonesia & Inggris).
- **Document Parser**: Mammoth.js untuk ekstraksi dokumen DOCX.
- **Math Engine**: KaTeX untuk pemrosesan notasi matematika.
- **PDF Engine**: jsPDF dengan penyesuaian dimensi milimeter fisik kertas asli.
- **Penyimpanan**: LocalStorage dengan sistem auto-save debounced.

---

## 📦 Panduan Instalasi & Menjalankan

### Prasyarat
- Node.js >= 18.x
- npm atau pnpm

### 1. Kloning Repository
```bash
git clone https://github.com/0xyz-exe/ai-handwriting-studio.git
cd ai-handwriting-studio
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser pada alamat: **`http://localhost:3000`**

### 4. Menjalankan Pengujian Otomatis (Automated Tests)
```bash
npm test
```

### 5. Build Produksi
```bash
npm run build
npm start
```

### 6. Menjalankan dengan Docker Compose
```bash
docker compose up -d
```
Aplikasi akan aktif di `http://localhost:3000`.

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi open-source [ISC](LICENSE).
Aset font menggunakan font open-source dari Google Fonts yang memiliki lisensi SIL Open Font License (OFL).
