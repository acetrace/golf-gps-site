# Astro Migration + Dusk Redesign

**Supersedes** `docs/plans/2026-05-21-astro-migration.md` (kept on disk for reference). All structural Astro decisions from the prior plan still hold; this plan rewrites the per-section content/styling tasks to match the actual mobile app's `dusk` theme and surfaces the five real marketing screenshots.

## Context

The current `golfgps.ai` marketing site is a Vite + React 18 SPA scaffolded by Lovable. It uses a bright green SaaS palette, four generic icon cards, a runtime YAML fetch, and a `placeholder.svg` in the hero — none of it visually related to the actual product. The actual product is a React Native / Expo golf-GPS app at `~/my/GolfGPS/` shipping two themes: `dusk` (dark navy `#1A1A2E` + gold `#E8A838`, used as the marketing default) and `sandstone` (cream + terracotta). The team has already produced **five marketing screenshots** at `~/my/GolfGPS/screenshots/aigen/final/`:

1. `slide1-rangefinder.png` — "GOLF GPS RANGEFINDER · Real distance to any pin"
2. `slide2-scorecard.png` — "LIVE SCORECARD WITH TIGHT TRACKING · Track every stroke, hole by hole"
3. `slide3-shot-tracker.png` — "SHOT BY SHOT · Log every stroke from tee to cup"
4. `slide4-courses-nearby.png` — "30,000+ COURSES MAPPED · Find golf courses near you"
5. `slide5-stats-history.png` — "YOUR GOLF JOURNEY WITH TIGHT TRACKING · Stats, history, and handicap"

This plan ports the site to Astro (per the prior plan's structural decisions) **and** rebuilds every visible surface in the dusk theme with the five screenshots as the heart of the site. Single PR, single cutover, no wasted port-then-redesign work.

## Approach

**Stack** (unchanged from prior plan): Astro 4 + Tailwind 3 + `@astrojs/react` (NavBar island only) + `@rollup/plugin-yaml`. No sitemap integration. NavBar stays a React island for mobile menu + scroll state.

**Design decisions locked during brainstorming:**

- **Aesthetic:** all-in `dusk` — `#1A1A2E` background, `#E8A838` gold accent, `#F4F1DE` warm cream ink. Screenshots blend into the page because they share the palette. No theme toggle.
- **Page structure:** Hero + **five feature spotlights** (one per slide, alternating left/right phone position) + Testimonials + CTA + Footer. Drops the existing 4-icon `FeaturesSection` entirely — the screenshots ARE the features.
- **Typography:** Big Shoulders Display Black (uppercase, tracking +0.02em) for section headers, Manrope for body, JetBrains Mono uppercase for stats. All Google Fonts — self-host via `@fontsource-variable/*` to avoid CDN-flakiness warnings from `applesocial.s3.amazonaws.com` (the current site's font CDN).
- **Motion signature:** dotted gold yardage-line SVG threading the page; `stroke-dashoffset` driven by scroll progress. Stat numbers count up (`0 → 30,000+`, `0 → 142`, `0 → 12.4`) via `IntersectionObserver` + `requestAnimationFrame`. One orchestrated page-load stagger. `prefers-reduced-motion` respected.
- **Spatial:** `py-32` section rhythm, asymmetric two-column at `lg:`, screenshots on a `cardLight` plinth with a gold-tinted shadow. Subtle SVG film-grain at 3% opacity site-wide.

**Reuse audit:**

- `tailwind.config.ts` keyframes (`fade-in-up`, `float`, `pulse-subtle`) — keep, still useful.
- Tailwind color palette — drop `ace`/`sand`/`sky` entirely (none referenced after content rewrite); add `dusk`/`gold`/`ink` derived from `~/my/GolfGPS/theme/index.ts`.
- `src/index.css` font `@font-face` blocks for SF Pro — drop (replaced by self-hosted Big Shoulders / Manrope / JetBrains Mono).
- `src/index.css` `.glass`, `.reveal`, `.progressive-img`, scrollbar styles — keep, useful.
- All `@radix-ui/*`, `@tanstack/react-query`, `react-router-dom`, `react-hook-form`, `zod`, `recharts`, etc. — drop, never imported.
- Existing testimonials in `public/data/testimonials.yaml` — keep content; restyle in dusk.
- App screenshots — copy from `~/my/GolfGPS/screenshots/aigen/final/` into `public/screenshots/`.
- App icon — copy `~/my/GolfGPS/assets/images/icon.png` into `public/` as `favicon-512.png`; derive a `favicon.ico` from it.

**Alternatives considered, rejected:**

- *Redesign on current Vite stack, migrate later.* Throws away every redesigned component when we migrate — port twice. Rejected.
- *Sandstone theme as default with dusk toggle.* Dual-mode work for marginal benefit; screenshots are gold-on-navy and would look wrong on cream. Rejected.
- *Editorial/magazine direction with serif display.* Higher creative risk; disconnects from app's own UI. Rejected — dusk all-in wins coherence.
- *Single long scroll-snap "app tour" page.* Cinematic but cliché when not perfect; harder to land. Rejected.
- *Full-cinematic motion (parallax + custom cursor + view-transition + landscape bg).* Maximalist; risks Webflow-demo feel. Rejected — yardage-line + counters is the single memorable signature.

**Known regressions accepted:**

- Below-fold sections currently fade-in on scroll via `IntersectionObserver` + `.reveal.active`. After migration the staggered load-in handles the visible viewport; the yardage-line + counter animations cover the scroll experience. No per-section fade-on-scroll.
- The current hero parallax disappears entirely. It was janky (no `requestAnimationFrame`) and didn't serve the new spotlights model.

**Out of scope:**

- Adding FAQ back (not rendered today).
- Dark/light mode toggle.
- Reintroducing shadcn primitives.
- Localisation, blog, course-search functionality on the marketing site.

## Files

### New files

- `astro.config.mjs` — Astro config, `@/` alias, `@rollup/plugin-yaml` plugin.
- `src/layouts/Layout.astro` — global shell, head meta, font preload, film-grain overlay.
- `src/styles/global.css` — moved & rewritten from `src/index.css` (dusk palette, drop SF Pro, keep utility classes).
- `src/styles/yardage-line.css` — SVG line scroll-driven styles (just dash + transform vars).
- `src/components/NavBar.tsx` — re-styled (dusk colors, gold logo accent), React island. Drops `react-router-dom`.
- `src/components/Hero.astro` — new dusk hero, slide 1 (rangefinder) screenshot, download buttons (App Store + Google Play).
- `src/components/Spotlight.astro` — generic spotlight section, props `{title, kicker, body, screenshot, stat, side}`. Used 5×.
- `src/components/StatCounter.astro` — JetBrains Mono number that counts up on viewport-enter. Uses a tiny inline `<script>`. Falls back to the final value when `prefers-reduced-motion: reduce`.
- `src/components/YardageLine.astro` — fixed-position SVG dotted line; scroll-progress driven via CSS custom property + tiny inline script.
- `src/components/FilmGrain.astro` — inline SVG `<filter type="turbulence">` overlay at 3% opacity.
- `src/components/Testimonials.astro` — dusk-themed cards, build-time YAML import.
- `src/components/CTA.astro` — final download section, gold-on-navy with golf-course landscape PNG as a darkened bg.
- `src/components/SiteFooter.astro` — dusk-themed footer, current year build-time.
- `src/data/testimonials.ts` — `Testimonial` interface export.
- `src/data/testimonials.yaml` — moved from `public/data/`.
- `src/types/yaml.d.ts` — typed module declaration: `declare module '*/testimonials.yaml' { const value: import('../data/testimonials').Testimonial[]; export default value; }`.
- `src/pages/index.astro` — composes Hero + 5 spotlights + Testimonials + CTA + Footer + YardageLine.
- `src/pages/privacy-policy.astro` — prose ported, dusk-themed, NavBar + Footer.
- `src/pages/terms-of-service.astro` — prose ported, dusk-themed.
- `src/pages/404.astro` — minimal "off the fairway" 404.
- `public/screenshots/rangefinder.png`, `scorecard.png`, `shot-tracker.png`, `courses-nearby.png`, `stats-history.png` — copied from `~/my/GolfGPS/screenshots/aigen/final/`.
- `public/golf-course-landscape.png` — copied from `~/my/GolfGPS/assets/images/golf_course_landscape.png`, used as darkened bg in CTA.
- `public/favicon-512.png` — copied from `~/my/GolfGPS/assets/images/icon.png`.

### Modified files

- `package.json` — Astro scripts; drop dead deps; add `astro`, `@astrojs/react`, `@astrojs/tailwind`, `@rollup/plugin-yaml`, `@fontsource-variable/big-shoulders-display`, `@fontsource-variable/manrope`, `@fontsource-variable/jetbrains-mono`. Update `"name"`.
- `tailwind.config.ts` — content glob includes `*.astro`; drop `ace`/`sand`/`sky`; add `dusk`/`gold`/`ink`/`bone` palettes derived from `~/my/GolfGPS/theme/index.ts`; convert `require("tailwindcss-animate")` to ESM `import`.
- `tsconfig.json` — extend `astro/tsconfigs/strict`; `@/*` alias.
- `.github/workflows/deploy.yml` — `static_site_generator: astro`.

### Deleted files

- `src/App.tsx`, `src/main.tsx`, `src/index.css` (after copy), `src/pages/Index.tsx`, `src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`, `src/pages/NotFound.tsx`
- `src/components/HeroSection.tsx`, `FeaturesSection.tsx`, `TestimonialsSection.tsx`, `CtaSection.tsx`, `Footer.tsx`, `FaqSection.tsx`, `AppDemoSection.tsx`
- `src/components/ui/` (entire directory, 47 unused primitives)
- `src/components/ui-custom/` (entire directory; `Badge`, `PhoneMockup`, `FeatureCard`, `AnimatedButton` — Hero/Spotlight/CTA inline what they need)
- `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `components.json`, `postcss.config.js`, `deploy.sh`, `bun.lockb`
- `public/data/testimonials.yaml` (moved to `src/data/`)

## Tasks

### Task 1: Install Astro toolchain and rewrite package.json

- [ ] Replace `package.json` scripts with `dev: astro dev`, `build: astro build`, `preview: astro preview`, `astro: astro`. Set `"name": "golf-gps-site"`.
- [ ] Drop deps: every `@radix-ui/*`, `@hookform/resolvers`, `@tanstack/react-query`, `react-router-dom`, `react-hook-form`, `zod`, `recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `input-otp`, `react-day-picker`, `next-themes`, `sonner`, `react-resizable-panels`, `date-fns`, `class-variance-authority`, `@types/js-yaml`, `js-yaml`, `lovable-tagger`, `autoprefixer`, `postcss`, `vite`, `@vitejs/plugin-react-swc`, all `eslint*`.
- [ ] Keep: `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `tailwindcss-animate`.
- [ ] Add: `astro@^4`, `@astrojs/react@^3`, `@astrojs/tailwind@^5`, `@rollup/plugin-yaml@^4`, `@fontsource-variable/big-shoulders-display@^5`, `@fontsource-variable/manrope@^5`, `@fontsource-variable/jetbrains-mono@^5`.
- [ ] `rm -rf node_modules package-lock.json bun.lockb && npm install`.
- [ ] **DoD:** `npx astro --version` returns a v4 version. `node_modules/@fontsource-variable/big-shoulders-display` exists.

### Task 2: Astro config, tsconfig, delete legacy scaffolding

- [ ] Write `astro.config.mjs` with `site: 'https://golfgps.ai'`, integrations `[tailwind(), react()]`, `vite.plugins: [yaml()]`, `@/` alias resolving to `./src`.
- [ ] Rewrite `tsconfig.json` to extend `astro/tsconfigs/strict`, add `paths: { "@/*": ["src/*"] }`, `jsx: "react-jsx"`.
- [ ] Delete `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `postcss.config.js`, `components.json`, `eslint.config.js`, `index.html`.
- [ ] **DoD:** `npx astro check` runs (errors against not-yet-ported files OK; what fails is config-load).

### Task 3: Rebuild Tailwind theme in dusk palette

- [ ] In `tailwind.config.ts`:
  - Replace content glob with `["./src/**/*.{astro,html,ts,tsx,mdx}"]`.
  - Convert `require("tailwindcss-animate")` to ESM `import tailwindcssAnimate from "tailwindcss-animate"` (file is `.ts` under `"type": "module"`).
  - Replace `ace`/`sand`/`sky` color extensions with this palette (derived from `~/my/GolfGPS/theme/index.ts` `duskTheme`):
    ```ts
    dusk: { DEFAULT: '#1A1A2E', 50: '#3A3A52', 100: '#38384A', 800: '#252542', 900: '#1A1A2E', 950: '#13131F' },
    gold: { DEFAULT: '#E8A838', dim: 'rgba(232,168,56,0.15)', strong: '#F4C26A', deep: '#B8821F' },
    ink:  { DEFAULT: '#F4F1DE', muted: '#9A8C98', dim: '#6B6578' },
    sage: '#81B29A',
    terra: '#E07A5F',
    ```
  - Replace `fontFamily.sans` with `['"Manrope Variable"', 'system-ui', 'sans-serif']`; add `display: ['"Big Shoulders Display Variable"', 'system-ui', 'sans-serif']` and `mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace']`.
- [ ] **DoD:** `tailwind.config.ts` parses; `grep -rE "ace-|sand-|sky-" src` returns nothing once the rebuild finishes.

### Task 4: Move + rewrite global CSS (dusk shell, fonts, film grain)

- [ ] `mkdir -p src/styles && mv src/index.css src/styles/global.css`.
- [ ] In `src/styles/global.css`:
  - Drop the SF Pro `@font-face` blocks entirely.
  - At the top, import `'@fontsource-variable/big-shoulders-display'`, `'@fontsource-variable/manrope'`, `'@fontsource-variable/jetbrains-mono'`.
  - Replace `:root` and `.dark` CSS-variable blocks with a single dark-only set:
    ```css
    :root {
      --background: 240 22% 14%; /* #1A1A2E */
      --foreground: 49 53% 91%;  /* #F4F1DE */
      --card: 240 27% 20%;       /* #252542 */
      --card-foreground: 49 53% 91%;
      --muted: 240 19% 24%;
      --muted-foreground: 290 8% 57%; /* #9A8C98 */
      --accent: 40 79% 56%;      /* #E8A838 */
      --accent-foreground: 240 22% 14%;
      --border: 240 11% 25%;     /* #38384A */
      --ring: 40 79% 56%;
      --radius: 1rem;
    }
    html { color-scheme: dark; }
    ```
  - Keep `.glass` (re-tune for dusk: `bg-dusk-800/60 backdrop-blur-md border border-gold/10`), `.section-transition`, `.progressive-img`, scrollbar (gold-tinted), `page-transition-in` keyframe.
  - Drop `.reveal` — load-stagger uses Tailwind `animate-fade-in-up` with `animation-delay`.
  - Add `body { @apply bg-dusk text-ink antialiased font-sans; }` and `h1,h2,h3 { @apply font-display tracking-tight; }`.
- [ ] **DoD:** `src/index.css` is gone; `src/styles/global.css` imports the three font packages and defines the dusk variables.

### Task 5: Build base Layout with film grain

- [ ] Create `src/components/FilmGrain.astro`:
  ```astro
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay">
    <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>
  </div>
  ```
- [ ] Create `src/layouts/Layout.astro` with `<html lang="en">`, font preconnect (Google Fonts not used — fontsource self-hosts), title + description + og + twitter meta, `<body class="bg-dusk text-ink antialiased">`, `<FilmGrain />`, `<slot />`.
- [ ] Import `src/styles/global.css` at top of layout.
- [ ] **DoD:** Layout file exists; no `gptengineer` or `golfshot-navigator` references anywhere in repo.

### Task 6: Copy app screenshots and brand assets

- [ ] `mkdir -p public/screenshots`.
- [ ] Copy and rename, dropping the slide-number prefix so URLs read clean:
  ```
  ~/my/GolfGPS/screenshots/aigen/final/slide1-rangefinder.png       → public/screenshots/rangefinder.png
  ~/my/GolfGPS/screenshots/aigen/final/slide2-scorecard.png         → public/screenshots/scorecard.png
  ~/my/GolfGPS/screenshots/aigen/final/slide3-shot-tracker.png      → public/screenshots/shot-tracker.png
  ~/my/GolfGPS/screenshots/aigen/final/slide4-courses-nearby.png    → public/screenshots/courses-nearby.png
  ~/my/GolfGPS/screenshots/aigen/final/slide5-stats-history.png     → public/screenshots/stats-history.png
  ```
- [ ] Copy `~/my/GolfGPS/assets/images/golf_course_landscape.png` → `public/golf-course-landscape.png`.
- [ ] Copy `~/my/GolfGPS/assets/images/icon.png` → `public/favicon-512.png`. Keep existing `public/favicon.ico`.
- [ ] Delete `public/placeholder.svg` (no longer referenced).
- [ ] **DoD:** `ls public/screenshots/ | wc -l` returns 5; `du -sh public/screenshots/` shows non-zero bytes.

### Task 7: Build NavBar React island (dusk-themed)

- [ ] Rewrite `src/components/NavBar.tsx` from scratch in dusk style:
  - Logo wordmark "GOLF GPS" in `font-display` `text-ink` + "ACE TRACE" in `text-gold` underneath, smaller.
  - Scroll-state: at `scrollY > 20`, background goes `bg-dusk/80 backdrop-blur-md` with a `border-b border-gold/10`.
  - Desktop nav: "Features" (anchors `#rangefinder`), "Why It's Different" (`#testimonials`), Privacy, Terms, Instagram icon.
  - Mobile menu: native `useState`-driven panel; same items.
  - Download buttons: two pill buttons inline-svg App Store + Google Play badges (use `lucide-react`'s `Apple` icon + custom Play SVG), both `<button type="button">` placeholders (no real store URL yet).
  - Drop `react-router-dom` Link entirely — Astro filesystem routes work with `<a href>`.
  - Drop `class-variance-authority` — `cn()` from `@/lib/utils` is enough.
- [ ] **DoD:** `grep -r "react-router-dom" src` returns zero; the React island compiles via `npx astro check`.

### Task 8: Build the Spotlight component + StatCounter + YardageLine

These three are shared across the 5 feature sections. Build them first so each spotlight can be wired identically.

- [ ] `src/components/StatCounter.astro`:
  - Props: `value: number`, `suffix?: string`, `prefix?: string`, `decimals?: number`, `format?: 'comma'|'plain'`.
  - Renders `<span data-counter data-target={value} data-decimals={decimals} class="font-mono tabular-nums text-gold">0</span>` plus `prefix`/`suffix`.
  - Includes a single `<script is:inline>` at the bottom (de-duped via Astro's hoisting) that finds all `[data-counter]` elements, uses `IntersectionObserver` to fire a `requestAnimationFrame` ease-out tween from 0 → target over 1200ms. Respects `prefers-reduced-motion`.
- [ ] `src/components/YardageLine.astro`:
  - Renders a fixed SVG centred at `left: 50%` on `lg+`, `left: 1.5rem` on mobile, `width: 2px`, full document height. Stroke is gold, dasharray `4 4`, `stroke-dashoffset` controlled via CSS custom property `--yardage-progress`.
  - Tiny `<script is:inline>` listens to scroll and updates `document.documentElement.style.setProperty('--yardage-progress', String(window.scrollY / (document.body.scrollHeight - window.innerHeight)))`. Throttled via `requestAnimationFrame`.
  - Hides on `prefers-reduced-motion` and on `<lg` screens (replaced by a static gold rule between sections).
- [ ] `src/components/Spotlight.astro`:
  - Props: `id: string`, `kicker: string` (e.g. "§01"), `title: string` (uppercase), `body: string`, `screenshot: string` (path), `screenshotAlt: string`, `stats: Array<{value:number, label:string, suffix?:string, decimals?:number}>`, `side: 'left' | 'right'`.
  - Renders `<section id={id} class="relative py-32 lg:py-40">` containing a 2-column grid that flips via `side` (`lg:flex-row-reverse`).
  - Left col (or right when flipped): kicker in `font-mono text-gold uppercase tracking-widest`, title in `font-display text-5xl lg:text-7xl uppercase text-ink`, body in `text-ink-muted text-lg max-w-md`, stats grid using `<StatCounter>`.
  - Right col (or left): phone screenshot on a `cardLight` plinth — rounded `rounded-[2.5rem]`, ring `ring-1 ring-gold/20`, gold-tinted shadow `shadow-[0_30px_60px_-15px_rgba(232,168,56,0.25)]`.
  - Adds `animate-fade-in-up` with staggered delays.
- [ ] **DoD:** `npx astro check` passes against the three new files.

### Task 9: Compose the Hero (rangefinder spotlight, plus headline + CTAs)

- [ ] Create `src/components/Hero.astro`. Layout: full-viewport (`min-h-[92vh]`), 2-column at `lg:`.
  - Left col: tiny gold kicker "RANGEFINDER · GPS · SCORECARDS"; `<h1 class="font-display text-6xl lg:text-8xl uppercase leading-[0.92] text-ink">GOLF GPS<br/><span class="text-gold">RANGEFINDER</span></h1>`; sub `Real distance to any pin. Visualise the course, plan the shot, lower the score.` in `text-ink-muted text-xl`; two download buttons (App Store + Google Play SVG badges, dusk style with gold hover ring); below, a tiny "From the makers of Ace Trace" line in `font-mono text-xs text-ink-dim uppercase tracking-widest`.
  - Right col: `<img src="/screenshots/rangefinder.png">` on a `cardLight` plinth with the same shadow/ring treatment as `Spotlight`. `loading="eager"` since it's above the fold.
  - Background: subtle radial gradient `bg-[radial-gradient(ellipse_at_top_right,rgba(232,168,56,0.08),transparent_60%)]`.
- [ ] **DoD:** Hero renders the rangefinder screenshot; no broken images in dev.

### Task 10: Compose the 5 spotlight sections + Testimonials + CTA + Footer

- [ ] In `src/pages/index.astro`, compose:
  ```astro
  <Layout title="Golf GPS – Ace Trace · Rangefinder, Scorecards, Shot Tracking">
    <NavBar client:load />
    <Hero />
    <YardageLine />
    <Spotlight id="scorecard" kicker="§01" title="LIVE SCORECARD" body="Track every stroke, hole by hole. Tap a hole, log the score, keep playing." screenshot="/screenshots/scorecard.png" screenshotAlt="Scorecard with 18-hole grid and stats" side="left" stats={[{value:18, label:'HOLES'}, {value:25, label:'PUTTS LOGGED'}]} />
    <Spotlight id="shot-tracker" kicker="§02" title="SHOT BY SHOT" body="Log every stroke from tee to cup. See the shape of your round." screenshot="/screenshots/shot-tracker.png" screenshotAlt="Shot trajectory overlay on aerial course view" side="right" stats={[{value:262, label:'YD DRIVE'}, {value:8, label:'° LAUNCH'}]} />
    <Spotlight id="courses" kicker="§03" title="30,000+ COURSES" body="From muni to championship — find a course near you, anywhere." screenshot="/screenshots/courses-nearby.png" screenshotAlt="Map of nearby courses with pin markers" side="left" stats={[{value:30000, label:'COURSES MAPPED', suffix:'+', format:'comma'}]} />
    <Spotlight id="stats" kicker="§04" title="YOUR GOLF JOURNEY" body="Handicap, history, and the curves that say how the season's going." screenshot="/screenshots/stats-history.png" screenshotAlt="Stats dashboard with handicap and last-10 rounds chart" side="right" stats={[{value:12.4, label:'HANDICAP', decimals:1}, {value:47, label:'ROUNDS'}]} />
    <Spotlight id="rangefinder-detail" kicker="§05" title="ENGINEERED FOR THE FAIRWAY" body="Front, middle, back. Pin distance with sub-yard accuracy from your phone's GPS." screenshot="/screenshots/rangefinder.png" screenshotAlt="Rangefinder showing 156 yards to pin" side="left" stats={[{value:156, label:'YDS TO PIN'}, {value:1, label:'YD ACCURACY', prefix:'±'}]} />
    <Testimonials />
    <CTA />
    <SiteFooter />
  </Layout>
  ```
- [ ] Build `src/components/Testimonials.astro` with build-time YAML import; dusk card style: `bg-dusk-800/60 backdrop-blur-md ring-1 ring-gold/10 hover:ring-gold/30`. Stars in `text-gold`. Avatar circle has a gold ring.
- [ ] Build `src/components/CTA.astro` with darkened landscape PNG bg (`bg-[url('/golf-course-landscape.png')] bg-cover bg-center` + `bg-dusk/80` overlay), giant `font-display` "READY TO PLAY?" headline, the same two download badges, sage-colored "iOS & Android · Free" subtext.
- [ ] Build `src/components/SiteFooter.astro` in dusk: logo wordmark, social, year, legal links. `currentYear` in frontmatter (build-time).
- [ ] **DoD:** `npm run dev` boots, `/` renders all 7 sections, scrolling reveals the yardage line, stats count up.

### Task 11: Move testimonials to build-time + port prose pages + 404

- [ ] `mkdir -p src/data && mv public/data/testimonials.yaml src/data/testimonials.yaml && rmdir public/data`.
- [ ] Create `src/data/testimonials.ts`:
  ```ts
  export interface Testimonial {
    id: string;
    name: string;
    rating: number;
    text: string;
    imagePrompt: string;
  }
  ```
- [ ] Create `src/types/yaml.d.ts`:
  ```ts
  declare module '*/testimonials.yaml' {
    const value: import('../data/testimonials').Testimonial[];
    export default value;
  }
  ```
- [ ] Create `src/pages/privacy-policy.astro` — Layout (dusk) + NavBar island + `<main class="container max-w-3xl mx-auto px-6 pt-32 pb-24 prose prose-invert prose-headings:font-display prose-headings:uppercase prose-headings:text-ink prose-a:text-gold">` wrapping the prose from `src/pages/PrivacyPolicy.tsx:17-93` (verbatim text content, just port markup) + SiteFooter. Build-time `lastUpdated`.
- [ ] Create `src/pages/terms-of-service.astro` — same shell, port `TermsOfService.tsx`.
- [ ] Create `src/pages/404.astro` — minimal "Off the fairway." 404 with link home.
- [ ] **DoD:** All three secondary pages render in dev; testimonials baked into `dist/index.html` after a build (grep at least 2 names).

### Task 12: Delete the old React source

- [ ] `rm src/App.tsx src/main.tsx`.
- [ ] `rm src/pages/Index.tsx src/pages/PrivacyPolicy.tsx src/pages/TermsOfService.tsx src/pages/NotFound.tsx`.
- [ ] `rm src/components/HeroSection.tsx FeaturesSection.tsx TestimonialsSection.tsx CtaSection.tsx Footer.tsx FaqSection.tsx AppDemoSection.tsx`.
- [ ] `rm -rf src/components/ui src/components/ui-custom src/hooks`.
- [ ] `grep -rE "react-router-dom|js-yaml|@tanstack|@radix-ui|@hookform" src` → 0 hits.
- [ ] `find src -name "*.tsx" | wc -l` → 1 (only `NavBar.tsx`).
- [ ] **DoD:** `npx astro check` exits 0. `npm run build` succeeds.

### Task 13: Update GitHub Pages workflow, delete deploy.sh

- [ ] Edit `.github/workflows/deploy.yml`: `static_site_generator: custom` → `static_site_generator: astro`. Leave CNAME step.
- [ ] `rm deploy.sh`.
- [ ] **DoD:** workflow file diff is a single line.

### Task 14: Final validation — build + agent-browser walkthrough + screenshots

This is the user's explicit goal: validate end-to-end with the agent-browser tool **and** captured screenshots.

- [ ] `rm -rf dist && npm run build`. Confirm exit 0. Confirm `dist/index.html`, `dist/privacy-policy/index.html`, `dist/terms-of-service/index.html`, `dist/404.html`, all five `/screenshots/*.png`, `golf-course-landscape.png` present.
- [ ] `du -sh dist/_astro/*.js` — single NavBar-sized JS bundle (no react-router, no radix, no js-yaml).
- [ ] Automated greps:
  - `grep -rE "gptengineer|lovable|golfshot-navigator|placeholder.svg" src dist .github` → 0.
  - `grep -c "John Doe" dist/index.html` ≥ 1 AND `grep -c "Sarah Johnson" dist/index.html` ≥ 1.
  - `grep -c "GOLF GPS" dist/index.html` ≥ 1; `grep -c "RANGEFINDER" dist/index.html` ≥ 1.
- [ ] `npx astro check` exits 0.
- [ ] Boot `npm run preview` in the background; serves on `http://localhost:4321`.
- [ ] Use the `agent-browser` skill to:
  1. Open `/` at desktop viewport (1440×900). Wait for fonts (Big Shoulders) to load. Capture a full-page screenshot to `/tmp/golfgps-desktop-home.png`.
  2. Open `/` at mobile viewport (390×844). Capture `/tmp/golfgps-mobile-home.png`.
  3. Open `/privacy-policy/` desktop. Capture `/tmp/golfgps-privacy.png`.
  4. Open `/terms-of-service/` desktop. Capture `/tmp/golfgps-terms.png`.
  5. Open `/nonexistent` to hit the 404. Capture `/tmp/golfgps-404.png`.
  6. From `/`, scroll to `#scorecard`, `#shot-tracker`, `#courses`, `#stats` — confirm each Spotlight's screenshot renders crisply (capture `/tmp/golfgps-spotlight-{N}.png` for each).
  7. On mobile viewport `/`: click hamburger → mobile menu opens; confirm all links visible. Capture.
  8. Confirm DevTools console errors = 0 and network 5xx = 0 across every scenario.
- [ ] **Pass criteria** for the goal hook to clear:
  - `npm run build` and `npx astro check` exit 0.
  - All 5 app screenshots visible in their respective spotlights at desktop and mobile widths.
  - Yardage-line SVG visible threading sections at desktop.
  - Stat counters count up from 0 to their target when scrolled into view.
  - NavBar mobile menu opens/closes; scroll-state background appears after 20px scroll.
  - Direct loads of `/privacy-policy/` and `/terms-of-service/` work (no 404, no SPA fallback).
  - At least one captured screenshot per scenario above, saved to `/tmp/golfgps-*.png`.
  - No console errors anywhere. SF Pro font warnings are gone (fonts now self-hosted).
- [ ] Stop the preview server.

**Overall pass criteria:** Build succeeds; all 8 agent-browser scenarios captured with screenshots; zero console errors; the five app screenshots are surfaced as the spine of the site; the yardage-line motif and stat counters work; the page reads as dusk navy + gold (not the current green-SaaS look).
