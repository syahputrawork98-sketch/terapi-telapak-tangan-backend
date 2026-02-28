# Backend Changelog Archive Rules

Folder ini menyimpan changelog backend lama setelah `CHANGELOG.md` melewati batas 200 baris.

## Naming Convention
- `changelog-001.md`
- `changelog-002.md`
- dst.

## Rollover Procedure
1. Cek jumlah baris `CHANGELOG.md`.
2. Jika > 200 baris, pindahkan seluruh isi file aktif ke file arsip baru.
3. Reset `CHANGELOG.md` dengan step terbaru yang masih aktif.
4. Tambahkan catatan rollover pada `CHANGELOG.md` aktif.
