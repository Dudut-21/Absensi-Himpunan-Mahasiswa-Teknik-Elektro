# Absensi Kegiatan HMTE

Web absensi statis (GitHub Pages). Data masuk ke Google Sheets, foto selfie tersimpan di Google Drive.

## 1. Siapkan Google Sheets + Apps Script
1. Buat Google Sheet baru (nama bebas).
2. Menu **Ekstensi → Apps Script**, hapus isi bawaan, tempel isi `Code.gs`, lalu simpan.
3. Klik **Deploy → Deployment baru → jenis: Aplikasi web**.
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
4. Klik **Deploy**, setujui izin akses Sheets dan Drive, lalu salin **URL aplikasi web** (berakhiran `/exec`).

## 2. Hubungkan ke halaman web
Buka `index.html`, ganti nilai `SCRIPT_URL` di bagian atas script dengan URL tadi.

## 3. Upload ke GitHub dan aktifkan Pages
1. Buat repository baru, upload `index.html`, `Code.gs`, dan `README.md`.
2. **Settings → Pages → Branch: main, folder: / (root)** lalu simpan.
3. Alamat web: `https://<username>.github.io/<nama-repo>/`

## Tips
- Isi nama kegiatan otomatis lewat link: `.../?kegiatan=Rapat%20Kerja%20HMTE`. Cocok untuk dibuatkan QR code per acara.
- Rekap ada di sheet **Absensi** (kolom Waktu, Kegiatan, Nama, NIM, Foto). Link foto hanya bisa dibuka akun Google pemilik Sheet.
- Kalau `Code.gs` diubah, buat **Deployment baru** (atau kelola deployment → versi baru), dan URL `/exec` tetap dipakai.
- URL web app bersifat publik. Siapa pun yang tahu URL-nya bisa mengirim data, jadi jangan tempel URL itu di tempat umum selain di `index.html`.
