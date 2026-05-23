# Test Credentials — Agroplaza

## Merchant Account (seeded)
- Email: `merchant@test.gr`
- Password: `password`
- Role: `merchant`
- Login URL: `/login`
- After login redirects to: `/merchant/dashboard`

## Notes
- Seeded via `/app/backend/seed.py`.
- Auth endpoints: `POST /api/auth/login`, `POST /api/auth/signup`, `GET /api/auth/me`, `POST /api/auth/logout`.
- JWT token returned in `token` field and stored in `localStorage` as `session_token`.
- Google OAuth: Emergent-managed (frontend hookup pending).
