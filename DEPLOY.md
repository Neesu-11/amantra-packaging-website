# Deploying Amantra Packaging Website on Vercel

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (sign in with GitHub)
- [Web3Forms](https://web3forms.com) access key (free) for newsletter and sample kit forms

## 1. Configure forms (required before go-live)

1. Sign up at [https://web3forms.com](https://web3forms.com) and create an access key.
2. Open `js/config.js` and replace `YOUR_ACCESS_KEY_HERE` with your key:

```javascript
window.AMANTRA_WEB3FORMS_KEY = "your-actual-access-key";
```

3. Test locally (see below): submit the newsletter form and the “Free Sample Kit” modal.

> **Note:** `js/config.example.js` is a template. For production you may keep the key in `config.js` or inject it at build time via a Vercel environment variable and a small build script later.

## 2. Preview locally

From the project root:

```powershell
cd d:\Coding\Amantra\amantra-packaging-website-updated
npx --yes serve .
```

Open the URL shown in the terminal (usually `http://localhost:3000`). Test:

- Homepage loads (CSS/JS in Network tab — no 404s for `/css/`, `/js/`, `/images/`)
- Mobile menu (resize below 1200px width)
- Newsletter subscribe and sample kit form (with Web3Forms key set)

## 3. Push to GitHub

```powershell
git init
git add .
git commit -m "Prepare static site for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/amantra-packaging-website.git
git push -u origin main
```

## 4. Import on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. **Import** your GitHub repository.
3. Project settings:
   - **Framework Preset:** Other
   - **Root Directory:** `.` (repository root)
   - **Build Command:** leave empty
   - **Output Directory:** `.` (static files at root; `index.html` is the homepage)
4. Click **Deploy**.

`vercel.json` enables clean URLs (no `.html` in paths).

## 5. Custom domain (optional)

1. Vercel project → **Settings** → **Domains**.
2. Add your domain (e.g. `amantrapackaging.com`).
3. Update DNS at your registrar using the records Vercel provides (A/CNAME).

## 6. Post-deploy checklist

- [ ] Site loads on `*.vercel.app`
- [ ] Black/gold theme appears consistently
- [ ] Mobile navigation opens and closes
- [ ] Newsletter submission appears in Web3Forms dashboard
- [ ] Sample kit submission appears in Web3Forms dashboard
- [ ] External nav links (About, Portfolio, etc.) behave as expected — they still point to the legacy live site until separate pages are added

## Project layout

```
index.html          Homepage
vercel.json         Vercel static config
css/                Stylesheets (amantra-theme.css loads last)
js/                 Scripts (config.js, forms.js)
images/             Images and icons
fonts/              Font Awesome fonts
media/              SVGs and mirrored media assets
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Unstyled page | Check Network tab for 404s on `/css/` paths |
| Forms show “not configured” | Set `AMANTRA_WEB3FORMS_KEY` in `js/config.js` |
| Missing portfolio/service images | Those files were not in the static mirror; add assets under `media/portfolio/` and `media/services/` |
| Google Translate not loading | Requires internet access to `translate.google.com` |
