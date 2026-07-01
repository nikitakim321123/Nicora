# Nicora Website

Production rebuild of the Nicora marketing site, based on the Claude Design
export (`Nicora Website.dc.html`). Static HTML/CSS/vanilla JS single-page app
with client-side routing — no build step, no framework, no dependencies.

Pages: **Home** (`/`), **Models** (`/models`), **Product** (`/models/nicora-m9`),
**About** (`/about`), **Contacts** (`/contacts`). Fully responsive: nav collapses
to a hamburger menu, all grids/heroes stack for mobile below 860px.

## Run locally

Any static file server works. From this directory:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Note: a plain static server won't resolve `/models` or `/models/nicora-m9`
directly (only `/`) unless it falls back unknown paths to `index.html`. Vercel
handles this automatically via `vercel.json`. `npx serve -s .` also works locally.

## Deploy to Vercel

1. Create a new GitHub repo (e.g. `nicora-website`) and push this code:
   ```bash
   git init
   git add -A
   git commit -m "Initial Nicora website"
   git branch -M main
   git remote add origin https://github.com/<you>/nicora-website.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the `nicora-website`
   GitHub repo.
3. Framework preset: **Other** (static site — no build command, no output
   directory override needed). Click **Deploy**.
4. You'll get a `nicora-website.vercel.app` URL — verify all 5 pages and the
   mobile layout there before connecting the domain.

## Connect nicora.kz

1. In the Vercel project: **Settings → Domains → Add** → enter `nicora.kz`
   (and optionally `www.nicora.kz`).
2. Vercel will show you the exact DNS records to add. At your domain
   registrar / DNS provider for `nicora.kz`, add:
   - **Apex domain** (`nicora.kz`): an `A` record → `76.76.21.21`
     (Vercel's anycast IP — use whatever value Vercel's dashboard shows you,
     since this can change).
   - **www subdomain** (`www.nicora.kz`): a `CNAME` record → `cname.vercel-dns.com`
   - If your registrar supports `ALIAS`/`ANAME` records instead of `A` for the
     apex, you can use that with the same target Vercel provides.
3. DNS propagation can take a few minutes to a few hours. Vercel's dashboard
   will show the domain status flip from "Invalid Configuration" to "Valid"
   once it detects the records, and will auto-provision an SSL certificate.
4. Decide whether `nicora.kz` or `www.nicora.kz` is canonical and set a
   redirect for the other in the Domains settings (Vercel does this for you
   with one click).

## Structure

```
index.html        All 5 pages (toggled via JS, one per <div data-page="...">)
css/styles.css     All styles, incl. mobile breakpoints at 1024px / 860px / 420px
js/app.js          Router (History API), mobile menu, typewriter effect, contact form
vercel.json        SPA rewrite so direct links to /models, /about etc. resolve
```
