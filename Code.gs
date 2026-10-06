// Google Apps Script: terima data absensi, simpan ke Google Sheets, foto ke Google Drive.
const NAMA_SHEET = 'Absensi';
const NAMA_FOLDER = 'Foto Absensi HMTE';

function doGet() {
  return json({ok: true, info: 'Absensi HMTE aktif'});
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    const kegiatan = String(d.kegiatan || '').trim().slice(0, 100);
    const nama = String(d.nama || '').trim().slice(0, 80);
    const nim = String(d.nim || '').trim();
    const foto = String(d.foto || '');

    if (!kegiatan || !nama) return json({ok: false, error: 'Data belum lengkap.'});
    if (!/^\d{6,14}$/.test(nim)) return json({ok: false, error: 'NIM tidak valid.'});
    if (!/^data:image\/jpeg;base64,/.test(foto) || foto.length > 600000) return json({ok: false, error: 'Foto tidak valid.'});

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(NAMA_SHEET);
    if (!sh) {
      sh = ss.insertSheet(NAMA_SHEET);
      sh.appendRow(['Waktu', 'Kegiatan', 'Nama', 'NIM', 'Foto']);
      sh.setFrozenRows(1);
      sh.getRange('D:D').setNumberFormat('@'); // NIM sebagai teks
    }

    // Tolak absen ganda: kegiatan + NIM yang sama
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase() === kegiatan.toLowerCase() && String(data[i][3]) === nim) {
        return json({ok: false, error: 'NIM ini sudah absen di kegiatan tersebut.'});
      }
    }

    const it = DriveApp.getFoldersByName(NAMA_FOLDER);
    const folder = it.hasNext() ? it.next() : DriveApp.createFolder(NAMA_FOLDER);
    const bytes = Utilities.base64Decode(foto.split(',')[1]);
    const file = folder.createFile(Utilities.newBlob(bytes, 'image/jpeg', nim + '_' + Date.now() + '.jpg'));

    sh.appendRow([new Date(), kegiatan, nama, "'" + nim, file.getUrl()]);
    return json({ok: true});
  } catch (err) {
    return json({ok: false, error: 'Kesalahan server: ' + err.message});
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
