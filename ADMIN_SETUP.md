# Admin panel setup

## 1. Database and tables

Tables are created by the **backend** when it starts:

- `admin_users` – admin login
- `site_sections` – section config (e.g. hero `data.videoUrl`)
- `section_items` – repeatable items (e.g. offer banner texts)
- `media` – optional log of Blob uploads

From project root, start the backend once so it runs `initializeDatabase()`:

```bash
cd backend && npm run dev
```

(Or run your backend start command. Ensure `DATABASE_URL` or `DATABASE_URL_PRIVATE` is set in backend env.)

## 2. First admin user (seed)

With the Next.js app running and `ADMIN_SEED_TOKEN` set in `.env.local`:

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_SEED_TOKEN" \
  -d '{"email":"admin@example.com","password":"your-secure-password"}'
```

Then remove or unset `ADMIN_SEED_TOKEN`.

## 3. Admin login

1. Open `/admin/login`.
2. Sign in with the seeded email and password.
3. Use the dashboard to edit **Hero** (video URL / upload) and **Offer banner** (items).

## 4. Vercel Blob (video/image uploads)

1. In Vercel: Project → Storage → Create Database/Blob store (Blob).
2. Copy `BLOB_READ_WRITE_TOKEN` into the project env (and `.env.local` for local).
3. In admin, Hero section: upload a video; it is stored in Vercel Blob and the Blob URL is saved in the hero section data.

## 5. Adding a new section (full-stack rule)

For every new feature, add:

1. **DB** – Use `site_sections` (single config) and/or `section_items` (list of items). Add a row or items via admin or a seed if needed.
2. **Admin** – Add a link in the admin nav and a section editor under `app/admin/sections/[sectionKey]/` that calls `PUT /api/admin/sections/:key` and/or section-items CRUD.
3. **Public UI** – Fetch from `GET /api/sections/:key` and/or `GET /api/section-items?sectionKey=...` and render.
4. **Media** – If the section has video/image, use `POST /api/admin/upload` (multipart) and store the returned `url` in section `data` or item `data`.

No frontend-only sections: each section is manageable from admin and backed by the database (and Blob when media is used).
