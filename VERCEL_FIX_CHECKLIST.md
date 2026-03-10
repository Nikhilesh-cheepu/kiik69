# Fix Vercel build (keep project + Blob)

If your deployment fails with a build step mentioning an unexpected tool (for example trying to build a static SPA with `index.html`), the project is still using old build settings. Fix it **without deleting** the project so you keep Blob storage and env vars.

## Checklist (do in order)

1. **Open the project in Vercel**  
   Dashboard → your kiik69 project.

2. **Settings → General**
   - **Root Directory**: leave **empty** (or `/`).  
   - If it shows a folder (e.g. `frontend`, `client`, `kiik609`), **clear it** and save.  
   This makes Vercel use the repo root where `package.json` has `"build": "next build"`.

3. **Settings → Build & Output**
   - **Framework Preset**: set to **Next.js**.
   - **Build Command**: set to **`npm run build`** (overwrite any wrong value).
   - **Output Directory**: leave default (Next.js uses `.next`).
   - **Install Command**: leave default or `npm install`.
   - Save.

4. **Redeploy**
   - Deployments → three dots on latest → **Redeploy**, or push a small commit to trigger a new build.
   - Build logs should show `next build` for this project.

5. **Environment variables**  
   Already set? Leave them. If you created a new project by mistake, re-add them in Settings → Environment Variables (see ENVIRONMENT_SETUP.md).

---

After this, the same GitHub repo builds as Next.js and your Blob storage stays intact.
