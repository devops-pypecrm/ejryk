# Zenitzu site (Maze design + thunder motion)

Next.js 15 site that re-creates the **Maze** agency template (white pill navbar, black hero with oversized light type,
bordered grids, pill marquees, accordion FAQ) in the brand palette: indigo / purple / yellow, set in Plus Jakarta Sans.

- `npm run dev` -> http://localhost:3100 (`npm run build && npm start` for production)
- Company name + contact details: `src/data/site.ts` (also holds stats, process, FAQ, testimonials, team)
- Services (4 disciplines, 21 services): `src/data/services.ts`
- Work case studies: `src/data/work.ts` (sample projects, replace with real ones)
- Blog posts: `src/data/blog.ts`
- Template CSS (copied from Maze, accent swapped): `src/app/styles/maze/*`
- Brand layer, mega menu, mobile menu, service pages, reveal animations: `src/app/styles/maze-theme.css`
- Accent colours: `--green`, `--purple`, `--yellowish` at the top of `maze-theme.css`; font: `--font`
- Images: `public/maze` (photos in `public/maze/p`, stock photography). `scripts/maze-assets.cjs` rebuilds them.
- The contact form opens the visitor's mail app (no backend yet).
- Animations: scroll reveals + hero entrance in `src/app/components/MazeFx.tsx`; marquees are CSS. No cursor effects.

## Private admin area (`/admin`)

Login-protected team area: a leads inbox (filled by the contact form) and a task board.

- Set `AUTH_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD` (see `.env.example`). Without them the login stays disabled.
- Middleware blocks `/admin/*` and `/api/admin/*` without a valid signed, HttpOnly session cookie (12 h). Login is rate-limited and mutating calls are same-origin only.
- Data lives in `.data/*.json` (or `DATA_DIR`). It needs a host with a persistent disk; on serverless hosting replace `src/lib/store.ts` with a database.

## Chatbots, marketing and automation (admin)
- **Claude** (`ANTHROPIC_API_KEY`) is the only AI: the site chat widget, the admin Claude assistant, the Studio, lead reply drafts and the automation workflows. Optional `CLAUDE_MODEL` (default `claude-opus-5-5`).
- **Studio** (`/admin/studio`): blog, social, ads, SEO copy, outreach, proposal, case study and content ideas, written by Claude. Results can be saved to `zenitzu-ops/outputs/` or sent to the **Calendar**.
- **Leads**: each enquiry creates a follow-up task and (optionally) a Telegram/Discord/webhook alert; draft replies with Claude, send by email or WhatsApp, export CSV.
- **SEO & automation** (`/admin/tools`): page checker, UTM builder, status of GA4 / Clarity / alerts. `sitemap.xml` and `robots.txt` are generated.
- All env vars are listed in `.env.example`.
- **Automation** (`/admin/automation`): Lead autopilot (AI reply drafted into each new lead), stale-lead nudges, weekly content plan into the calendar, auto-drafts for upcoming content, and a weekly digest. They run on a built-in scheduler (needs a long-running Node server); on serverless hosts use `POST /api/cron` with `CRON_SECRET`. Outputs are drafts for review, nothing is sent to customers or published automatically.
- **Post automation**: the Content calendar publishes to X, LinkedIn, Facebook Page, Telegram, Discord or a webhook (Zapier/Make/n8n for Instagram and others). Only items you set to **Scheduled** are posted (by the Auto-publisher workflow on their date, or with **Publish now**). Over-length text is refused, never cut; failures return to Draft with the reason. Credentials are listed in `.env.example`.
