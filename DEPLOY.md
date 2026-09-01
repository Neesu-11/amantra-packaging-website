# Deploying Amantra Packaging Website on Vercel

The site is a static single page. There is no server and no build step on Vercel:
`index.html` and the asset folders are served straight from the CDN.

## Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (sign in with GitHub)
- [Web3Forms](https://web3forms.com) access key (free) for the newsletter and sample kit forms
- Python 3.12+ only if you need to re-run the asset pipeline (see below)

## 1. Configure forms (required before go-live)

1. Sign up at [https://web3forms.com](https://web3forms.com) and create an access key.
2. Open `js/config.js` and set your key:

```javascript
window.AMANTRA_WEB3FORMS_KEY = "your-actual-access-key";
```

`js/config.example.js` is the template. The Web3Forms access key is designed to be
public and is safe to commit.

## 2. Preview locally

From the project root:

```powershell
npx --yes serve .
```

Open the URL shown in the terminal (usually `http://localhost:3000`) and check:

- Homepage loads with no 404s in the Network tab
- Hero video plays, and its poster frame shows before playback starts
- All four portfolio carousel tabs render images
- Mobile menu works below 1200px width
- Newsletter and sample kit forms submit (with the Web3Forms key set)

## 3. Push to GitHub

```powershell
git add .
git commit -m "Your message"
git push
```

## 4. Import on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. **Import** your GitHub repository.
3. Project settings:
   - **Framework Preset:** Other
   - **Root Directory:** `.`
   - **Build Command:** leave empty
   - **Output Directory:** `.`
4. Click **Deploy**.

`vercel.json` sets clean URLs, cache headers, and basic security headers.

## 5. Custom domain

The canonical URL is `https://amantrapackaging.in/`, hard-coded in the `canonical`
tag, the OpenGraph tags, `sitemap.xml`, `robots.txt`, and the JSON-LD block in
`index.html`. If the domain changes, update all five.

1. Vercel project -> **Settings** -> **Domains**.
2. Add the domain and update DNS at your registrar with the records Vercel provides.

## Asset pipeline

Photography and video are optimised by `build.py`. This runs on your machine, never
on Vercel. Optimised assets are committed; the original PNGs and the pre-encoded
video were removed and remain recoverable from git history.

```powershell
pip install -r requirements.txt
python build.py                 # convert new images, leave sources in place
python build.py --prune         # convert, then delete the sources
python build.py --force         # rebuild everything, including re-encoding the hero
```

To add a new portfolio or service image, drop the PNG or JPEG into
`media/portfolio/` or `media/services/`, run `python build.py --prune`, then point an
`<img>` tag at the generated `-400w.webp` / `-800w.webp` (portfolio) or
`-600w.webp` / `-1200w.webp` (services) files with a matching `srcset`. Widths in
`asset-manifest.json` are the true pixel widths to use in the `srcset` descriptors.

`build.py` re-encodes the hero video in place, so it records a marker in
`asset-manifest.json` and will not re-encode a second time unless you pass `--force`.
That guard exists to stop repeated runs from progressively degrading quality.

Because asset filenames are not content-hashed, `/media` and `/images` are cached for
30 days. If you replace an image and need it live immediately, give the new file a
different name rather than overwriting the old one.

## Project layout

```
index.html            Homepage (the only page)
build.py              Image and video optimisation, run locally
requirements.txt      Build-time Python dependencies
asset-manifest.json   Generated: dimensions and byte sizes per asset
vercel.json           Clean URLs, cache and security headers
robots.txt            Crawler rules, points at the sitemap
sitemap.xml           Single-page sitemap
css/                  Stylesheets (amantra-theme.css loads last and overrides)
js/                   Scripts (config.js, forms.js, nav.js, amantra.js + vendor)
images/               Logo, icons, generated og-image.jpg
media/                Hero video and poster, portfolio and service WebP images
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Unstyled page | Check the Network tab for 404s on `/css/` paths |
| Forms show "not configured" | Set `AMANTRA_WEB3FORMS_KEY` in `js/config.js` |
| New image not appearing | Run `python build.py` and confirm the `srcset` points at the generated `.webp` files |
| Updated image still stale | Filenames are not hashed and are cached 30 days; rename the file |
| Google Translate not loading | Requires internet access to `translate.google.com` |
