# Backend Change Log

## STEP-BE-001 - Repository Bootstrap
- Date: 2026-02-28
- Spec References:
  - STEP-005
  - STEP-006
- Added:
  - Struktur awal backend (`src/`, config, middleware, utils, modules, store).
  - `package.json` dengan dependency `express`.
  - `.env.example` untuk baseline konfigurasi runtime.
- Updated:
  - `README.md` backend untuk setup, rules, dan referensi spec.
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Persistensi data masih in-memory untuk fase awal.

## STEP-BE-002 - Auth Endpoints Implementation
- Date: 2026-02-28
- Spec References:
  - STEP-005
  - REQ-AUTH-001
  - REQ-AUTH-002
  - REQ-AUTH-003
- Added:
  - Endpoint `POST /auth/register`.
  - Endpoint `POST /auth/login`.
  - Endpoint `GET /auth/me`.
  - Endpoint `GET /health` untuk health check.
- Updated:
  - Validasi payload auth agar konsisten dengan rule minimum spec.
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Role default saat register adalah `USER`.

## STEP-BE-003 - Auth Security and Envelope Standardization
- Date: 2026-02-28
- Spec References:
  - STEP-004
  - STEP-005
- Added:
  - Password hashing/verifikasi berbasis `crypto.scryptSync`.
  - Bearer token signing + verification (HMAC SHA256, JWT-like format).
  - `require-auth` middleware untuk endpoint protected.
  - Error handler terpusat dengan standar `error_code`.
  - Response helper sukses/error sesuai envelope spec.
- Updated:
  - Alur error auth agar konsisten (`VALIDATION_ERROR`, `AUTH_UNAUTHORIZED`).
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Mekanisme token saat ini cukup untuk MVP internal, dapat diganti ke library JWT standar pada fase hardening.

## STEP-BE-004 - Backend Changelog Policy Activation
- Date: 2026-02-28
- Spec References:
  - STEP-006
- Added:
  - Standar log backend step-based per perubahan implementasi.
- Updated:
  - Aturan referensi lintas repo (`STEP-*`, `REQ-*`) di setiap entry.
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Setiap perubahan backend berikutnya wajib tambah step baru, bukan overwrite step lama.
