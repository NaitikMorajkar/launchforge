<div align="center">
<img width="1200" height="475" alt="LaunchForge banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# LaunchForge

A cinematic product-launch platform (Vite + React 19 + TypeScript + Tailwind v4) backed by
**Supabase** for real authentication and shared, persistent data.

- Email/password sign-up, sign-in, sign-out and password reset (Supabase Auth)
- Real shared projects, upvotes and comments stored in Postgres with Row Level Security
- Owner-only edit/delete, duplicate-like prevention, server-side validation
- In-app dark/light theme, Cmd/Ctrl+K search, cinematic 3D hero
- **Interactive demo gallery**: 8 working website templates previewable inside the app
  (sandboxed, local, no backend required)

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values (see below)
npm run dev                  # http://localhost:3000
```

Without Supabase credentials the app runs in **demo mode**: it renders clearly-labelled
sample projects, and sign-in / launch / upvote / comment are disabled with an explanatory
notice. Nothing is faked.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check (`tsc --noEmit`) |
| `npm run setup:check` | Validate Supabase env, connectivity and schema (never prints secrets) |
| `npm test` | jsdom tests: all 8 demo pages + gallery/preview components (82 checks) |

---

## 2. Backend setup (Supabase) — step by step

### Step 1 — Create a project
1. Go to <https://supabase.com> → **New project**.
2. Choose a region, set a database password, and wait for provisioning.

### Step 2 — Apply the database schema
Open **SQL Editor** in the dashboard and run the contents of
[`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) in full.

(Or with the Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`.)

This creates `profiles`, `projects`, `project_likes`, `project_comments`, plus indexes,
counter triggers and **Row Level Security** policies.

### Step 3 — Get your API credentials
**Project Settings → API** and copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

Put them in `.env.local`. The `anon` key is safe for the browser. **Never** put a
`service_role` key in a `VITE_`-prefixed variable — it would be bundled into the client.

### Step 4 — Configure authentication
**Authentication → Providers**:
- Enable **Email** (default). For the smoothest flow you can disable "Confirm email"
  during development so new accounts sign in immediately; otherwise users must click the
  confirmation link first.
- Optional **GitHub / Google** OAuth: create an OAuth app, then paste the client id/secret
  here. The "Continue with GitHub/Google" buttons are disabled in the UI until Supabase is
  configured, so they never fake a login.

**Authentication → URL Configuration**:
- Add `http://localhost:3000` (and your production origin) to the redirect allow-list.

### Step 5 — Restart & verify

Restart `npm run dev` and confirm in the terminal:

```bash
npm run setup:check
```

This verifies (without printing your keys) that the env file exists, the URL/key are
well-formed, the project is reachable, and the `projects` table answers queries. When it
prints ✅, the amber "Demo mode" banner in the app disappears and sign-in, Start Project
and upvotes go live.

Afterwards, sign up, launch a project, upvote and comment — then reload and/or open a
second browser to confirm the data persists and is shared across accounts.

### Troubleshooting — "Why do I see Demo mode?"

The app runs in demo mode whenever `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are
missing or malformed. The banner's **Connect Supabase** button (also shown by Start
Project, sign-in, upvote and comment) opens an in-app setup guide with a copyable
`.env.local` snippet. Checklist:

1. File is `.env.local` (or `.env`) in the project root — not `.env.example`.
2. Both variables are present and start with `https://` / `eyJ` respectively.
3. You copied the **anon public** key, not the `service_role` key.
4. `0001_init.sql` was run to completion in the SQL Editor (no red errors).
5. The dev server was **restarted** after editing env files (Vite only reads them at boot).

---

## 3. Data model & security

| Table | Purpose | Key rules (RLS) |
|---|---|---|
| `profiles` | Public profile per user | Public read; user can insert/update only their own row |
| `projects` | Launches | Public read; insert/update/delete restricted to owner; owners cannot forge `like_count`/`comment_count`/`view_count`/`featured`/`trending`/`is_sample` (enforced by RLS + a guard trigger) |
| `project_likes` | Upvotes | Composite PK `(project_id, user_id)` makes duplicate likes impossible; users add/remove only their own |
| `project_comments` | Feedback | Public read; author-only create/edit/delete; 1–1000 chars |

Counters (`like_count`, `comment_count`, `view_count`) are maintained by database triggers,
so the client is never trusted for statistics. URL and length constraints are enforced both
client-side and as database `CHECK` constraints.

**What stays in `localStorage`:** only the UI theme preference. No user data, tokens,
passwords or secrets are stored there (Supabase manages its own session storage).

---

## 4. Environment variables

See [`.env.example`](.env.example). Required:

```
VITE_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR-PUBLIC-ANON-KEY"
```

---

## 5. Notes & limitations

- **Sample content:** the built-in showcase projects (`src/data/mockProjects.ts`) are
  badged "Sample"/"Sample showcase" everywhere they appear. They use fictional demo creator
  personas, their `demoUrl` values point at LOCAL pages under `public/demos/`, their
  bundled discussion is labelled as illustrative (composer is read-only), and they can't be
  upvoted or deleted. With Supabase configured, real launches are listed first with the
  sample catalogue appended after them.
- **Search** filters the currently loaded project list on the client (name, tagline,
  description, category, creator, tags). For very large datasets move this to a Postgres
  full-text `RPC` (an index is already provided).
- **Rate limiting:** Supabase applies default anonymous/authenticated request limits. For
  stricter abuse protection add per-user quotas (e.g. via a `project_comments` insert
  trigger or an edge function).
- **OAuth provider setup** requires you to register apps with GitHub/Google — this cannot be
  pre-configured without your credentials.
- **Visual QA:** component/demo behaviour is covered by `npm test`; pixel-level checks
  (mobile/desktop breakpoints, animation feel) still warrant a quick manual pass in a
  browser.

---

## 6. Interactive demo gallery

A dedicated section (`#demos`, navbar: **Demos**) showcases eight fully working website
templates. Everything is local and self-contained — no third-party embeds, no dead links,
and no Supabase required.

| Demo | Page | Interactions |
|---|---|---|
| Portfolio | `public/demos/portfolio.html` | tabbed nav, skill chips, contact form |
| Storefront | `public/demos/ecommerce.html` | filters, add-to-cart, cart drawer, checkout |
| SaaS landing | `public/demos/saas.html` | monthly/yearly pricing toggle, plan CTAs |
| Analytics dashboard | `public/demos/analytics.html` | sidebar views, date ranges, animated charts |
| AI chatbot | `public/demos/chatbot.html` | typing indicator, quick prompts, scripted replies |
| Developer showcase | `public/demos/devshowcase.html` | language filter, repo cards, heatmap |
| Agency site | `public/demos/agency.html` | marquee, portfolio tiles, contact CTA |
| Learning platform | `public/demos/education.html` | live search, filters, lesson checklists |

**How previews are hosted** (`src/components/DemoPreviewModal.tsx`):

- Opens inside LaunchForge in a sandboxed `<iframe>` (`allow-scripts` but **no**
  `allow-same-origin`), so the embedded page cannot touch the parent app.
- The loading skeleton clears on the frame's real `load` event; if a frame genuinely
  fails to load, an error card offers *Try again* / *Open in new tab* — never an
  endless fake spinner.
- Sample project cards route their **Live Preview** to the same in-app host instead of
  navigating away; the modal supports Escape (toolbar close button keeps focus), reload,
  and a new-tab fallback.
- Gallery metadata lives in `src/data/demoGallery.ts`; add a new demo by dropping an HTML
  file into `public/demos/` and appending an entry there.
