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
- `POST /auth/register` (`REQ-AUTH-001`)
- `POST /auth/login` (`REQ-AUTH-002`)
- `GET /auth/me` (`REQ-AUTH-003`)

## Notes
- Storage user saat ini masih in-memory (`UsersStore`) untuk menjaga migrasi bertahap.
- Prisma schema sudah disiapkan sebagai baseline migrasi ke DB.
