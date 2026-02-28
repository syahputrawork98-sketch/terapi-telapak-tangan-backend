# terapi-telapak-tangan-backend

Backend API untuk Terapi Telapak Tangan (MVP).

## Status
- Modul Auth sudah diimplementasi:
  - `POST /auth/register` (`REQ-AUTH-001`)
  - `POST /auth/login` (`REQ-AUTH-002`)
  - `GET /auth/me` (`REQ-AUTH-003`)

## Setup
1. `npm install`
2. `copy .env.example .env`
3. `npm start`

## Working Rules
- Perubahan API/business logic MUST update spec terlebih dahulu.
- Perubahan backend MUST refer ke `REQ-*` dan `STEP-*`.
- Catatan perubahan backend MUST ditulis di `CHANGELOG.md`.

## Key References
- Spec index: `../terapi-telapak-tangan-spec/00-index/README.md`
- API contract: `../terapi-telapak-tangan-spec/04-data-api/api-contract.md`
- Backend checklist: `../terapi-telapak-tangan-spec/04-data-api/backend-implementation-checklist.md`
