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

## STEP-BE-005 - NestJS Migration Baseline
- Date: 2026-02-28
- Spec References:
  - STEP-007
  - REQ-AUTH-001
  - REQ-AUTH-002
  - REQ-AUTH-003
- Added:
  - Migrasi runtime backend ke NestJS + TypeScript.
  - Modul auth NestJS (`AuthModule`, `AuthController`, `AuthService`).
  - Global exception filter dengan envelope error standar.
  - Prisma schema baseline (`prisma/schema.prisma`) untuk PostgreSQL.
- Updated:
  - Script npm (`build`, `start`, `start:dev`, `prisma:*`).
  - README backend sesuai stack lock terbaru.
- Removed:
  - Legacy scaffold Express/JavaScript di folder `src`.
- Breaking Changes:
  - Entry point backend berubah dari `node src/server.js` ke `ts-node-dev src/main.ts` / `node dist/main.js`.
- Notes:
  - Data user masih in-memory selama fase migrasi bertahap ke Prisma repository.

## STEP-BE-006 - Health and Slot Module Implementation
- Date: 2026-02-28
- Spec References:
  - STEP-004
  - STEP-007
  - REQ-SLOT-001
  - REQ-SLOT-002
  - REQ-SLOT-003
  - REQ-SLOT-004
- Added:
  - Endpoint `GET /health` pada NestJS module khusus health.
  - Modul `Slots` dengan endpoint public/admin sesuai API contract.
  - Role-based guard (`ADMIN|SUPER_ADMIN`) untuk endpoint `/admin/slots/*`.
  - Validasi slot (format waktu/tanggal, capacity, status, no overlap).
- Updated:
  - README backend: daftar endpoint implemented terbaru.
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Slot storage masih in-memory, akan dipindah ke Prisma repository pada step berikutnya.
## STEP-BE-007 - Dev SUPER_ADMIN Seed
- Date: 2026-02-28
- Spec References:
  - STEP-007
  - REQ-ADMIN-001
  - REQ-ADMIN-002
  - REQ-ADMIN-003
- Added:
  - `DevSeedService` untuk auto-create akun `SUPER_ADMIN` saat startup (mode dev).
  - Konfigurasi seed di env (`DEV_SEED_ENABLED`, `DEV_SUPER_ADMIN_*`).
- Updated:
  - `README.md` backend dengan panduan login admin lokal.
  - `.env.example` dengan variabel seed testing.
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Seed hanya untuk kebutuhan development/testing lokal.