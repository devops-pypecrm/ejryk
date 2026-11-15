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
