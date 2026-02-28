# terapi-telapak-tangan-backend

Backend API untuk Terapi Telapak Tangan (MVP).

## Stack (Locked)
- Node.js + NestJS + TypeScript
- PostgreSQL + Prisma

## Setup
1. Install dependency: `npm install`
2. Copy env file: `copy .env.example .env`
3. Generate Prisma client: `npm run prisma:generate`
4. Run dev server: `npm run start:dev`

## Implemented
- `GET /health`
- `POST /auth/register` (`REQ-AUTH-001`)
- `POST /auth/login` (`REQ-AUTH-002`)
- `GET /auth/me` (`REQ-AUTH-003`)
- `GET /slots` (`REQ-SLOT-001`)
- `POST /admin/slots` (`REQ-SLOT-002`)
- `PATCH /admin/slots/:id` (`REQ-SLOT-003`)
- `DELETE /admin/slots/:id` (`REQ-SLOT-004`)

## Dev Seed (SUPER_ADMIN)
Saat `DEV_SEED_ENABLED=true`, aplikasi otomatis membuat akun `SUPER_ADMIN` untuk testing lokal:
- Email: `DEV_SUPER_ADMIN_EMAIL`
- Password: `DEV_SUPER_ADMIN_PASSWORD`

Default lokal:
- Email: `superadmin@local.test`
- Password: `superadmin123`

## Notes
- Storage slot dan user masih in-memory untuk menjaga migrasi bertahap.
- Prisma schema sudah disiapkan sebagai baseline migrasi penuh ke DB repository.