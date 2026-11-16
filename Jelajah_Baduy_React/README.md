# Jelajah Baduy — Animasi React.js

Versi ini mempertahankan tampilan dan fitur situs asli, lalu menambahkan animasi dengan **React.js**.

## Cara menjalankan

1. Ekstrak ZIP.
2. Buka `index.html` di browser, atau jalankan server lokal dari folder ini: `python -m http.server 8000`, lalu kunjungi `http://localhost:8000`.
3. Untuk update di **Cloudflare Pages** (unggah langsung), unggah seluruh isi folder ini. Untuk GitHub, salin seluruh file ke folder root yang dijadikan sumber deploy.

Tidak perlu `npm install` atau proses build. Situs tetap berupa website statis, karena React di sini digunakan sebagai lapisan animasi yang tidak merusak halaman HTML, CSS, dan JavaScript asli.

## Komponen dan animasi baru

- `react-animations.js`: komponen React, state progress scroll, tombol kembali ke atas, dan IntersectionObserver untuk animasi masuk.
- `react-motion.css`: animasi hero, efek reveal saat scroll, efek hover kartu/foto/tombol, dan transisi responsif.
- `react-runtime.js`: memuat React dan komponen animasi. Saat ada jaringan, memakai React 18.3.1 dari CDN UNPKG. Jika CDN tidak tersedia, menggunakan React lokal yang dibundel (fallback kompatibilitas).
- `vendor/`: library fallback dari paket React yang tersedia secara lokal; kode library berlisensi MIT.
- `script.js`: logika kartu destinasi, dialog, navigasi, dan peta Leaflet **dipertahankan**.

Peta interaktif tetap membutuhkan layanan Leaflet/OpenStreetMap saat online. Geolokasi umumnya memerlukan HTTPS/localhost dan izin browser.

## Referensi titik peta

Dicocokkan pada 10 November 2026. Marker, tautan popup, dan tombol Google Maps menggunakan pasangan lintang/bujur yang sama. Klik marker juga memperbarui pilihan destinasi dan tombol peta.

| Titik Google Maps | Lintang | Bujur | Referensi |
| --- | --- | --- | --- |
| Wisata Suku Baduy Luar | -6.5958483 | 106.2256021 | [Pin Google Maps](https://maps.app.goo.gl/shmm6xuk7fjrLCx6A) |
| Wisata Kampung Marengo Baduy Luar | -6.6078819 | 106.2224494 | [Pin Google Maps](https://maps.app.goo.gl/51wzLEWwCBtxNg7k7) |
| Terminal Ciboleger | -6.5940006 | 106.2251326 | [Dinas Pariwisata Banten, tautan Google Maps pada ulasan](https://excitingbanten.id/belanja/jasa-perjalanan/terminal-ciboleger) |

Koordinat diambil dari data pin `!3d`/`!4d` dalam URL Google Maps, bukan dari pusat tampilan peta setelah `@`. Peta dasar tetap OpenStreetMap; label dan gambar petanya dapat berbeda dari Google Maps.

Ciboleger memakai koordinat tetap, sehingga tidak bergantung pada hasil pencarian nama di OpenStreetMap. Baduy Dalam tetap tidak ditandai sesuai pembatasan akses pada data proyek. Aktivitas umum seperti trekking, sungai, dan budaya tidak diberi koordinat buatan karena belum memiliki titik spesifik yang terverifikasi; tombol peta untuk entri tersebut melakukan pencarian nama kawasan.

## Catatan aksesibilitas

Animasi mengikuti pengaturan sistem **Reduce Motion**: saat pengguna mengaktifkannya, efek gerak dikurangi atau dinonaktifkan. Navigasi, tautan peta, dan tombol tetap dapat digunakan lewat keyboard.
