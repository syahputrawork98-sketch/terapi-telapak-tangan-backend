# Backend Change Log

## STEP-BE-011 - Super Admin Admin-Management Endpoints
- Date: 2026-02-28
- Spec References:
  - STEP-004
  - STEP-007
  - REQ-ADMIN-001
  - REQ-ADMIN-002
  - REQ-ADMIN-003
- Added:
  - Modul `SuperAdmin` dengan endpoint:
    - `POST /super-admin/admins`
    - `GET /super-admin/admins`
    - `PATCH /super-admin/admins/:id`
  - DTO payload create/update admin.
- Updated:
  - `UsersStore` ditambah capability list/update user untuk kebutuhan super-admin flow.
  - `AuthModule` mengekspor `UsersStore` agar dipakai lintas modul.
  - `AppModule` import `SuperAdminModule`.
  - README backend daftar endpoint implemented terbaru.
- Removed:
  - None.
- Breaking Changes:
  - None.
- Notes:
  - Endpoint update dibatasi pada akun ber-role `ADMIN` untuk menjaga scope manajemen akun admin.
  - Rollover dilakukan pada 2026-02-28 karena file changelog sebelumnya melebihi 200 baris.
  - Arsip: `archive/changelog-001.md`.
