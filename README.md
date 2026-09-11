# Perfect Pointing — website

Static site for Perfect Pointing (Scott Higginson). Built with [Eleventy](https://www.11ty.dev), edited through
[Sveltia CMS](https://github.com/sveltia/sveltia-cms) at `/admin/`, hosted free on Netlify with the contact form
handled by Netlify Forms.

Scott edits **everything** — text, photos, services, jobs, reviews, prices, phone number — from `/admin/`.
No code involved. Each save publishes the site automatically within about a minute.

---

## One-time setup (Jon, ~20 minutes)

### 1. GitHub
1. Create a new **private or public** repo called `perfect-pointing` under your account (CustomGPTer).
2. Unzip this folder and push it:
   ```bash
   cd perfect-pointing
   git init && git add . && git commit -m "Perfect Pointing site"
   git branch -M main
   git remote add origin https://github.com/CustomGPTer/perfect-pointing.git
   git push -u origin main
   ```
3. If the repo isn't `CustomGPTer/perfect-pointing`, update `backend.repo` in `src/admin/config.yml`.

### 2. Netlify (hosting + forms)
1. https://app.netlify.com → **Add new project → Import an existing project → GitHub** → pick `perfect-pointing`.
2. Build settings are read from `netlify.toml` (build `npm run build`, publish `_site`). Click **Deploy**.
3. You get a `something.netlify.app` URL. Rename it under **Project configuration → General → Project details → Change project name** (e.g. `perfect-pointing`).
4. **Forms:** Project configuration → **Forms** → Enable form detection. Then **Form notifications → Add notification → Email** → Scott's email address. Every quote request lands in his inbox (100/month free).

### 3. GitHub sign-in for the editor (Netlify OAuth)
This is what lets Scott log in at `/admin/` with a GitHub account instead of an email/password.

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Perfect Pointing CMS`
   - Homepage URL: `https://www.perfectpointing.co.uk` (or the netlify.app URL for now)
   - Authorization callback URL: **`https://api.netlify.com/auth/done`**
   - Register → **Generate a new client secret**. Copy the Client ID and secret.
2. Netlify → Project configuration → **Access & security → OAuth → Install provider → GitHub** → paste Client ID and secret → Install.
3. Scott creates a free GitHub account (github.com → Sign up, two minutes).
4. GitHub → repo → **Settings → Collaborators → Add people** → Scott's GitHub username → role **Write**. He accepts the invite email.
5. Test: go to `https://<site>/admin/`, click **Sign in with GitHub**. You'll see the editor.

### 4. Domain
1. Buy `perfectpointing.co.uk` (Cloudflare Registrar or Namecheap — cheaper than the host and portable).
2. Netlify → **Domain management → Add a domain** → follow the DNS instructions (two records). SSL is automatic.
3. Once live, in `/admin/` → Business details → set **Website address** to `https://www.perfectpointing.co.uk`.
   Also update `site_url` / `display_url` in `src/admin/config.yml` and the OAuth app's Homepage URL.

### 5. Google
- Set up / claim the **Google Business Profile** for Perfect Pointing (free) — this is what puts him on Maps.
- Google Search Console → add the domain → submit `https://www.perfectpointing.co.uk/sitemap.xml`.
- Paste the Business Profile "write a review" link into **Business details → Google review link** in `/admin/`.

---

## Scott's editing guide (give him this bit)

Go to **yourdomain.co.uk/admin/** and sign in with GitHub.

| Want to… | Go to |
|---|---|
| Change the phone number, hours, areas, insurance, footer | **Business details** |
| Change any text or photo on the home page | **Home page** |
| Change text/photos on Services, Our work, About, Reviews, Contact | **Other pages** |
| Add / edit / remove a service or change a price | **Services** |
| Add a photo of a finished job | **Our work (jobs) → New job** |
| Add a customer review | **Reviews → New review** |
| Add a question & answer | **Questions & answers** |
| Add a town you now cover (gets a map pin + its own page) | **Areas we cover → New area** |
| Edit a pointing style page | **Pointing styles** |
| Write an advice article | **Advice articles → New article** |

- **Save** stores your edit. It goes live automatically in about a minute — refresh the site to see it.
- Photos: click the image box → **Upload** from your phone or computer. Big photos are shrunk automatically.
- **Order** fields: 1 shows first. Give a new job order 1 to put it at the top.
- Tick **Show on home page** on up to three reviews to feature them.
- You can't break anything. Every change is saved as a version — Jon can undo any edit.

---

## Working on it locally (optional)
```bash
npm install
npm start          # http://localhost:8080
```

## Structure
```
src/_data/site.yml      business details            → Business details
src/_data/home.yml      home page content           → Home page
src/_data/pages.yml     other page content          → Other pages
src/services/*.md       one file per service        → Services  (also generates /services/<slug>/)
src/jobs/*.md           one file per job photo      → Our work
src/reviews/*.md        one file per review         → Reviews
src/faqs/*.md           one file per Q&A            → Questions & answers
src/areas/*.md          one file per town           → Areas we cover  (generates /repointing-<town>/ + map pin)
src/styles/*.md         one file per joint profile  → Pointing styles (generates /pointing-styles/<style>/)
src/advice/*.md         one file per article        → Advice articles (generates /advice/<slug>/)
src/images/uploads/     all photos (CMS uploads here)
src/admin/config.yml    the CMS field definitions
src/_includes/          page templates
src/css/style.css       styling
```

## SEO — what's built in
- One page per town (`/repointing-rochdale/` etc.) with unique local copy, map pin, local jobs and reviews — this is what ranks for "repointing <town>".
- One page per service and per pointing style, four advice articles, all cross-linked.
- LocalBusiness schema (founded 2000, geo, opening hours, services, areas served), BreadcrumbList on every inner page, FAQPage on Services.
- Unique title + meta description on every page, editable in the CMS. Sitemap at `/sitemap.xml`, robots.txt.
- All photos are real `<img>` tags with alt text and lazy loading.
- Map is Leaflet + OpenStreetMap: free, no API key.

Still to do off-site (the part that matters most for local search): claim the **Google Business Profile**, set the address area to Rochdale, add the website link, and get reviews on it.

## Before going live — replace the placeholders
All photos are free stock (CC0, no credit needed) and should be swapped for Scott's own via the CMS.
These figures were written as sensible fillers and need Scott's real ones: guide prices, the six reviews, the job list and locations, insurance level, guarantee length, opening hours, Scott's email for form notifications.
Once he has a Google Business Profile, fill in **Google rating / review count / review link** in Business details and the badge appears.
