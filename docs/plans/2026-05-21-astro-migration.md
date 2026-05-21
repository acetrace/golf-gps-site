# Astro Migration

## Context

The `golfgps.ai` site is a marketing landing page (one main page + Privacy + ToS). It currently ships as a Vite + React 18 SPA scaffolded by Lovable, with `react-router-dom` for routing and 60+ MB of `node_modules` dependencies (50+ Radix/shadcn primitives, `@tanstack/react-query`, `react-hook-form`, `zod`, `recharts`, `embla-carousel`, etc.) of which the **rendered site uses none**.

The actual interactive surface is:

- `NavBar` — mobile menu toggle + scroll-state background swap
- `HeroSection` — parallax + fade-in (can be CSS-only)
- A handful of `IntersectionObserver` class toggles for fade-in-on-scroll (can be CSS-only)

Everything else is static marketing markup. `TestimonialsSection` fetches `public/data/testimonials.yaml` at runtime and runs `js-yaml` in the browser purely to render four hard-coded cards. `FaqSection.tsx` and `AppDemoSection.tsx` exist on disk but are not rendered. There are two competing deploy paths (`deploy.sh` force-pushing to `gh-pages` and `.github/workflows/deploy.yml` using the Pages artifact flow). The Lovable boilerplate is still present in `index.html` (`gptengineer.js` script, `"golfshot-navigator"` title, `"Lovable Generated Project"` description) and `package.json` (`"name": "vite_react_shadcn_ts"`).

The goal: serve the same pixels with a static-template stack — Astro, with React used only as an island where it earns its weight. Reduce JS shipped to the browser to roughly the NavBar's worth. Produce real `index.html` files per route so direct loads of `/privacy-policy` work on GitHub Pages without SPA fallback.

## Approach

**Target stack:** Astro 4 + Tailwind 3 + `@astrojs/react` (NavBar island only) + `@rollup/plugin-yaml` (build-time testimonials). No sitemap integration — 3 static URLs don't justify it; revisit when there are >10 routes.

**Reuse audit — what is kept verbatim:**

- `tailwind.config.ts` — keep entire theme block (ace/sand/sky palettes, keyframes, animations, fontFamily, backgroundImage). Only the `content` glob grows to include `*.astro`.
- `src/index.css` — moves verbatim to `src/styles/global.css`. CSS variables, glassmorphism utilities, scrollbar styling, `reveal`/`section-transition`, `progressive-img`, font `@font-face` blocks all stay untouched.
- `public/` assets — `favicon.ico`, `og-image.png`, `placeholder.svg`, `images/testimonials/*.jpg` keep their paths and resolve identically under Astro.
- `public/data/testimonials.yaml` content — moves to `src/data/testimonials.yaml` unchanged.
- `lucide-react` icons — usable in `.astro` files via direct import; same components (`Target`, `Compass`, `MapPin`, `Eye`, `ArrowDown`, `ArrowRight`, `Instagram`, `Menu`, `X`) keep their names.
- `cn()` helper at `src/lib/utils.ts` — keep, still used by NavBar island.
- `NavBar.tsx` JSX body — kept as a React island; only `react-router-dom <Link>` swaps for `<a>`.
- Per-section JSX markup — ported verbatim into `.astro` files; only the `useEffect`/`useRef` plumbing is dropped.

**What disappears (no replacement needed):**

- `react-router-dom` — Astro is filesystem-routed.
- `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`, `recharts`, `embla-carousel-react`, `cmdk`, `vaul`, `input-otp`, `react-day-picker`, `next-themes`, `sonner`, `react-resizable-panels`, `date-fns`, `class-variance-authority` — never imported by any rendered component.
- Every `@radix-ui/*` package — `Toaster`/`Sonner`/`TooltipProvider` are mounted in `App.tsx` but never triggered; no FAQ on the page means no `Accordion`.
- `js-yaml` + `@types/js-yaml` — YAML resolves at build time.
- `lovable-tagger` + `gptengineer.js` script — Lovable scaffolding.
- `src/components/ui/*` — 47 unused shadcn primitives.
- `FaqSection.tsx`, `AppDemoSection.tsx` — not rendered today; delete rather than port.
- `App.tsx`, `main.tsx`, `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `components.json`, `deploy.sh` — Astro provides equivalents or the GitHub Action covers the deploy.

**Alternatives considered:**

- *Stay on Vite, just delete the dead deps.* Rejected — still ships a React runtime + SPA shell for what is genuinely static content, and direct `/privacy-policy` loads on Pages need an SPA fallback (Astro produces a real `privacy-policy/index.html`).
- *Go fully React-free (no `@astrojs/react`, rewrite NavBar in `.astro` + inline JS).* Rejected as the default but viable — saves the React integration entirely (~few KB), but requires rewriting NavBar's mobile-menu state and scroll-listener as vanilla JS. Keeping the island preserves the existing JSX byte-for-byte, which is the minimum-code path. Revisit only if the React island ships an unacceptable bundle (>15 KB gzipped).
- *Next.js static export.* Rejected — heavier framework for a four-page marketing site; Astro's island model is the better fit when ~95% of the content is static.
- *Rewrite the section markup "while we're in there".* Rejected — out of scope. Port verbatim, ship, then iterate.

**Constraints that actually apply:**

- Domain is `golfgps.ai` via root `CNAME`; the workflow must keep emitting `dist/CNAME`.
- The GitHub Pages workflow currently uses `actions/configure-pages@v4` with `static_site_generator: custom` — Astro is supported as `static_site_generator: astro` and the build step (`npm run build` → `./dist`) stays identical.
- Build runs on Node 20 in CI (set in the workflow).
- Two `Toaster` providers and a `TooltipProvider` are mounted but never triggered — deleting them is a safe no-op.

**Out of scope (do not slip in):**

- Visual redesign of any section.
- Adding the FAQ section back (it isn't rendered today).
- Reintroducing shadcn primitives until a concrete second use case exists.
- Dark-mode toggle (the CSS variables exist for it but nothing toggles `.dark`).

**Known regression accepted by this migration:** Sections below the fold (`FeaturesSection`, `TestimonialsSection`, `CtaSection`) currently fade in on scroll via `IntersectionObserver` + `.reveal.active`. After migration their fade-in animation runs on initial paint instead — so a user scrolling down sees them already faded-in, no animation. This is intentional: the current observer setup costs JS and a `.reveal { opacity: 0 }` initial state that hurts perceived performance. If the visual loss matters, reinstate later with CSS `animation-timeline: view()` (Chromium-only, graceful degrade) — not in this plan.

## Files

### New files

- `astro.config.mjs` — Astro config: `site: 'https://golfgps.ai'`, integrations (`@astrojs/tailwind`, `@astrojs/react`), `vite.plugins: [yaml()]`, `@/` alias.
- `src/layouts/Layout.astro` — `<html>`/`<head>`/`<body>` shell, meta tags, `og:image`, `global.css` import, `<slot />`.
- `src/styles/global.css` — exact content of current `src/index.css` (moved, not rewritten).
- `src/pages/index.astro` — composes Layout + NavBar island + section components.
- `src/pages/privacy-policy.astro` — Layout + NavBar + prose (ported verbatim from `PrivacyPolicy.tsx`).
- `src/pages/terms-of-service.astro` — Layout + NavBar + prose (ported verbatim from `TermsOfService.tsx`).
- `src/pages/404.astro` — minimal "Page not found" with link back to `/`.
- `src/components/HeroSection.astro` — hero markup; parallax via CSS scroll-linked animation, fade-in via existing `animate-fade-in-up` / `animate-fade-in` Tailwind keyframes with `animation-delay`.
- `src/components/FeaturesSection.astro` — section markup; staggered fade-in via Tailwind keyframes + `delay-100`/`delay-200`/etc. utilities already defined in `global.css`.
- `src/components/CtaSection.astro` — section markup; fade-in via CSS animation, no JS.
- `src/components/TestimonialsSection.astro` — section markup; build-time YAML import.
- `src/components/Footer.astro` — footer markup; `const currentYear = new Date().getFullYear();` in frontmatter (build-time).
- `src/components/Badge.astro` — span markup, pure ports.
- `src/components/PhoneMockup.astro` — markup port; drop the JS loading spinner, rely on `loading="lazy"` + `decoding="async"`.
- `src/components/FeatureCard.astro` — markup port; remove IntersectionObserver — staggered animation via `style={`animation-delay: ${delay}ms`}` on the existing CSS keyframe.
- `src/data/testimonials.yaml` — moved from `public/data/`.
- `src/data/testimonials.ts` — exports the `Testimonial` interface so the YAML module declaration can reference it without resorting to `unknown`.
- `src/types/yaml.d.ts` — typed module declaration: `declare module '*/testimonials.yaml' { const value: import('../data/testimonials').Testimonial[]; export default value; }`. Per the user's no-`any`/no-`unknown` rule.

### Modified files

- `package.json` — replace scripts (`dev: astro dev`, `build: astro build`, `preview: astro preview`); strip dropped deps; add `astro`, `@astrojs/react`, `@astrojs/tailwind`, `@rollup/plugin-yaml`. Update `"name"` to `golf-gps-site`.
- `tailwind.config.ts` — content glob becomes `["./src/**/*.{astro,html,ts,tsx,mdx}"]`. Remove the `pages/`, `components/`, `app/` legacy globs. **Also convert `plugins: [require("tailwindcss-animate")]` to ESM `import tailwindcssAnimate from "tailwindcss-animate"` + `plugins: [tailwindcssAnimate]`** — the `require()` inside an ESM `"type": "module"` package fails under Astro's config loader.
- `tsconfig.json` — extend `astro/tsconfigs/strict`; keep `@/*` path alias mapping to `src/*`.
- `.github/workflows/deploy.yml` — change `static_site_generator: custom` to `static_site_generator: astro`. Build step and CNAME step otherwise unchanged.
- `src/components/NavBar.tsx` — swap `react-router-dom <Link to="...">` for `<a href="...">`; otherwise keep JSX verbatim. Continues to use `cn` from `@/lib/utils`, `lucide-react` icons, and a Tailwind-only `AnimatedButton` (replace import path: `./ui-custom/AnimatedButton` → use a small inline button or duplicate the relevant 10-line markup; do not re-import the React `AnimatedButton` since it's deleted).

### Deleted files

- `src/App.tsx`, `src/main.tsx`
- `src/pages/Index.tsx`, `src/pages/PrivacyPolicy.tsx`, `src/pages/TermsOfService.tsx`, `src/pages/NotFound.tsx`
- `src/components/HeroSection.tsx`, `FeaturesSection.tsx`, `TestimonialsSection.tsx`, `CtaSection.tsx`, `Footer.tsx`
- `src/components/FaqSection.tsx`, `AppDemoSection.tsx` (unrendered)
- `src/components/ui/` (entire directory — 47 unused shadcn primitives)
- `src/components/ui-custom/AnimatedButton.tsx`, `Badge.tsx`, `PhoneMockup.tsx`, `FeatureCard.tsx`
- `src/hooks/` (if it exists — `use-toast` and `use-mobile` aren't referenced)
- `public/data/testimonials.yaml` (moved to `src/data/`)
- `index.html`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`
- `components.json`
- `postcss.config.js` (the `@astrojs/tailwind` integration handles PostCSS wiring)
- `deploy.sh`
- `bun.lockb` (keep only `package-lock.json`; the workflow uses npm)

## Tasks

### Task 1: Install Astro toolchain and rewrite package.json

Replace the Vite/React-SPA scripts and dependencies with the Astro stack. Do this first so subsequent tasks can use `npm run dev` immediately.

- [ ] Replace `package.json` scripts block with:
  ```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
  ```
- [ ] Set `"name": "golf-gps-site"`, keep `"type": "module"`, drop `"private": true` only if you actually want to publish (leave it as `true`).
- [ ] Remove every dependency except: `react`, `react-dom` (needed for the NavBar island), `lucide-react`, `clsx`, `tailwind-merge`, `tailwindcss-animate`.
- [ ] Remove every devDependency except: `@types/react`, `@types/react-dom`, `@types/node`, `tailwindcss`, `typescript`. Drop `autoprefixer`, `postcss`, `vite`, `@vitejs/plugin-react-swc`, `lovable-tagger`, and all eslint packages (skip ESLint for the initial migration; reintroduce only if the user asks).
- [ ] Add new deps: `astro@^4`, `@astrojs/react@^3`, `@astrojs/tailwind@^5`, `@rollup/plugin-yaml@^4`.
- [ ] Delete `bun.lockb`. Run `rm -rf node_modules package-lock.json && npm install` to regenerate a clean tree.
- [ ] Run `npx astro --version` to confirm install succeeded.

**DoD:** `npm install` exits 0. `node_modules/astro/package.json` exists. `package.json` lists no `@radix-ui/*`, no `react-router-dom`, no `js-yaml`, no `lovable-tagger`.

### Task 2: Create astro.config.mjs and base tsconfig

Wire the integrations and path alias. Without this, no `.astro` file builds.

- [ ] Create `astro.config.mjs`:
  ```js
  import { defineConfig } from 'astro/config';
  import tailwind from '@astrojs/tailwind';
  import react from '@astrojs/react';
  import yaml from '@rollup/plugin-yaml';
  import path from 'node:path';

  export default defineConfig({
    site: 'https://golfgps.ai',
    integrations: [tailwind(), react()],
    vite: {
      plugins: [yaml()],
      resolve: {
        alias: { '@': path.resolve('./src') },
      },
    },
  });
  ```
- [ ] Replace `tsconfig.json` contents with:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "baseUrl": ".",
      "paths": { "@/*": ["src/*"] },
      "jsx": "react-jsx"
    },
    "include": ["src/**/*", ".astro/**/*"]
  }
  ```
- [ ] Delete `tsconfig.app.json`, `tsconfig.node.json`, `vite.config.ts`, `postcss.config.js`, `components.json`, `eslint.config.js`, `index.html`.

**DoD:** `npx astro check` runs (will report errors against not-yet-ported `.tsx` files — that's expected; what must pass is that Astro itself loads its config). `astro.config.mjs` resolves with no module-not-found errors.

### Task 3: Move CSS verbatim and update Tailwind content globs

Get global styles loaded before any `.astro` file is built.

- [ ] `mkdir -p src/styles && mv src/index.css src/styles/global.css`. Do not modify the content — the CSS variables, font `@font-face` blocks, `.glass`, `.reveal`, `.section-transition`, `.progressive-img`, scrollbar styles, and `page-transition-in` keyframes all stay.
- [ ] In `tailwind.config.ts` replace the `content` array with:
  ```ts
  content: ["./src/**/*.{astro,html,ts,tsx,mdx}"],
  ```
  Leave the rest of the config (theme.extend with ace/sand/sky, keyframes, animations, fontFamily, backgroundImage) untouched.
- [ ] In the same `tailwind.config.ts`, convert the `tailwindcss-animate` plugin from CJS `require()` to an ESM `import`. Replace `plugins: [require("tailwindcss-animate")]` with an `import tailwindcssAnimate from "tailwindcss-animate";` at the top of the file and `plugins: [tailwindcssAnimate]` in the config object. Required because `package.json` is `"type": "module"` and Astro's config loader resolves the file as ESM — the existing `require()` will throw `ReferenceError: require is not defined`.

**DoD:** `src/index.css` no longer exists. `src/styles/global.css` exists. `tailwind.config.ts` content glob includes `astro`.

### Task 4: Build the base Layout

Single shared shell that every page renders inside. This is what replaces `index.html` + `App.tsx`'s providers (most of which were dead anyway).

- [ ] Create `src/layouts/Layout.astro`:
  ```astro
  ---
  import '../styles/global.css';
  interface Props {
    title?: string;
    description?: string;
  }
  const {
    title = 'Golf GPS - Ace Trace',
    description = 'Precision distance mapping, course visualization, and shot planning for golfers.',
  } = Astro.props;
  ---
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta name="generator" content={Astro.generator} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={Astro.url.href} />
      <meta name="twitter:card" content="summary_large_image" />
    </head>
    <body class="antialiased">
      <slot />
    </body>
  </html>
  ```
- [ ] Confirm `public/favicon.ico` and `public/og-image.png` still exist (they should — they're not being moved).

**DoD:** File exists with the contents above. No references to the deleted `gptengineer.js` or the `golfshot-navigator` title remain anywhere in the repo (`grep -r golfshot-navigator src public` returns nothing).

### Task 5: Port NavBar as the single React island

NavBar is the only piece with genuine runtime state (mobile-menu open/close + scroll-position class swap). Keep the existing JSX, drop `react-router-dom`, replace the deleted `AnimatedButton` import with an inline span/button.

- [ ] Edit `src/components/NavBar.tsx`:
  - Remove `import { Link } from 'react-router-dom';`
  - Remove `import AnimatedButton from './ui-custom/AnimatedButton';`
  - Replace every `<Link to="/foo">…</Link>` with `<a href="/foo">…</a>`
  - Replace both `<AnimatedButton size="sm" withArrow>Download Now</AnimatedButton>` instances with a `<button type="button">` (preserves the current no-op behavior — the original `AnimatedButton` rendered a `<button>` when no `href` was passed; do **not** use `<a href="#">`, which would scroll to top):
    ```tsx
    <button
      type="button"
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
    >
      <span>Download Now</span>
      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
    ```
    NavBar stays a `.tsx` React island, so `className` (not `class`).
  - Import `ArrowRight` from `lucide-react` alongside `Menu`, `X`, `Instagram`.
  - Keep `useState`, `useEffect`, scroll listener, mobile-menu toggle exactly as-is.
- [ ] Confirm `src/lib/utils.ts` (exporting `cn`) still exists and is unchanged.

**DoD:** `src/components/NavBar.tsx` no longer imports `react-router-dom` or `AnimatedButton`. `grep -r "react-router-dom" src` returns nothing.

### Task 6: Port the small primitives to .astro

These three primitives wrap markup with optional props. None need React — the only `useState`/`useEffect` was for hover effects (CSS handles it) and a loading spinner (native `loading="lazy"` handles it). `AnimatedButton` is **not** ported as a component — its three remaining usages (Hero × 2, CTA × 1) get inlined in those sections instead. NavBar's `AnimatedButton` was already inlined in Task 5.

**Port these before Task 7 — Hero, Features, CTA all depend on them.**

- [ ] Create `src/components/Badge.astro` from `Badge.tsx:10-24`. Direct port; use `class:list` for the variant logic instead of `cn()`:
  ```astro
  ---
  interface Props { variant?: 'default' | 'outline' | 'accent'; class?: string; }
  const { variant = 'default', class: className } = Astro.props;
  ---
  <span class:list={[
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset animate-fade-in-up',
    variant === 'default' && 'bg-primary/10 text-primary ring-primary/20',
    variant === 'outline' && 'bg-background text-foreground ring-border',
    variant === 'accent' && 'bg-accent/10 text-accent-foreground ring-accent/30',
    className,
  ]}>
    <slot />
  </span>
  ```
- [ ] Create `src/components/PhoneMockup.astro` from `PhoneMockup.tsx:44-77`. Drop the spinner JSX and the `useState`/`useEffect` block. Use:
  ```astro
  <img src={imageSrc} alt={alt} loading="lazy" decoding="async" class="h-full w-full object-cover" />
  ```
- [ ] Create `src/components/FeatureCard.astro` from `FeatureCard.tsx:49-63`. Frontmatter accepts `icon` (lucide component), `title`, `description`, `delay`. Apply `class="animate-fade-in-up"` on the root with `style={`animation-delay: ${delay}ms`}`.

**DoD:** Three `.astro` primitive files exist. `npx astro check` exits 0 against them (they may render unused — that's fine; sections that use them are added next task).

### Task 7: Port the static section components to .astro

Port each section verbatim, dropping the `useEffect` IntersectionObservers in favor of CSS animations that already exist in `tailwind.config.ts` (`fade-in`, `fade-in-up`, `fade-in-down`, `float`, `pulse-subtle`). Inline the `AnimatedButton` markup in Hero and CTA — no component abstraction. The `.reveal` opacity-0 class disappears.

- [ ] Create `src/components/HeroSection.astro` by copying the JSX from `HeroSection.tsx:48-112`. Convert: `className` → `class`, drop `ref`, drop `useEffect`. Skip parallax entirely (it was janky without rAF anyway). On the text container use `class="text-center lg:text-left space-y-6 lg:w-1/2 animate-fade-in-up"`. On the phone container use `class="lg:w-1/2 flex justify-center animate-fade-in"` with inline `style="animation-delay: 300ms;"`. Drop the `reveal` class.
- [ ] Inline the two `<AnimatedButton>` calls in Hero with the markup below. Use `<button type="button">` for "Download Now" (no `href` in the original) and `<a href="#features">` for "Learn More" (the original passes `href="#features"`). Wrap with the `group` utility so `group-hover:translate-x-1` works on the arrow:
  ```astro
  <button type="button" class="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-10 py-4 text-lg font-medium text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
    <span>Download Now</span>
    <ArrowRight class="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </button>
  <a href="#features" class="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-transparent px-10 py-4 text-lg font-medium text-primary shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2">
    <span>Learn More</span>
  </a>
  ```
  (Import `ArrowRight` from `lucide-react` in the frontmatter.)
- [ ] Create `src/components/FeaturesSection.astro` from `FeaturesSection.tsx:35-89`. Drop `ref`s and the observer. Pass `delay={100|200|300|400}` to each `<FeatureCard>`. Import `Target`, `Compass`, `MapPin`, `Eye` from `lucide-react` in the frontmatter and pass them as `icon` props.
- [ ] Create `src/components/CtaSection.astro` from `CtaSection.tsx:33-67`. Drop observer; apply `animate-fade-in-up` to the inner glass card. Inline the single `<AnimatedButton size="lg" withArrow>Download Now</AnimatedButton>` as the same `<button type="button">` markup as in Hero (lg variant).
- [ ] Create `src/components/Footer.astro` from `Footer.tsx:8-72`. Move `const currentYear = new Date().getFullYear();` into the frontmatter (resolves at build time). Replace `<Link to>` with `<a href>`.

**DoD:** `npm run dev` boots. Navigating to `http://localhost:4321` (once Task 9 creates `index.astro`) will show Hero, Features, CTA, Footer rendered without runtime JS errors. Until then, this task's DoD is `npx astro check` exits 0 — sections import the primitives correctly.

### Task 8: Move testimonials to build-time and port the section

Eliminate the runtime fetch + browser-side YAML parse.

- [ ] `mkdir -p src/data && mv public/data/testimonials.yaml src/data/testimonials.yaml`.
- [ ] `rmdir public/data` (verify it's empty first).
- [ ] Create `src/data/testimonials.ts` exporting the interface (so it can be referenced from the module declaration without circular issues):
  ```ts
  export interface Testimonial {
    id: string;
    name: string;
    rating: number;
    text: string;
    imagePrompt: string;
  }
  ```
- [ ] Create `src/types/yaml.d.ts` with a **typed** declaration — not `unknown`, per the user's no-loose-types rule in CLAUDE.md:
  ```ts
  declare module '*/testimonials.yaml' {
    const value: import('../data/testimonials').Testimonial[];
    export default value;
  }
  ```
- [ ] Create `src/components/TestimonialsSection.astro`:
  ```astro
  ---
  import testimonials from '../data/testimonials.yaml';
  ---
  <section id="testimonials" class="py-16 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-4">What Our Users Say</h2>
      <p class="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Hear from golfers who have improved their game with AceTRACE
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {testimonials.map((t) => (
          <div class="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 mr-4 rounded-full overflow-hidden shadow-md border-2 border-gray-100">
                <img src={`/images/testimonials/${t.id}.jpg`} alt={t.name} loading="lazy" class="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h3 class="font-semibold text-lg">{t.name}</h3>
                <div class="flex mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg class={`w-5 h-5 ${i < t.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic text-sm md:text-base">"{t.text}"</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  ```

**DoD:** `npm run build` succeeds. `dist/index.html` contains all four testimonial names inlined as static HTML — verify with `grep -c "John Doe" dist/index.html` (>=1) **and** `grep -c "Sarah Johnson" dist/index.html` (>=1) so a single-card render bug doesn't pass unnoticed. Network panel on `/` shows zero requests to `/data/testimonials.yaml`. `npx astro check` exits 0 (the typed YAML declaration removes any `unknown`/`any`).

### Task 9: Compose the pages

Wire the sections into the three real routes plus the 404.

- [ ] Create `src/pages/index.astro`:
  ```astro
  ---
  import Layout from '../layouts/Layout.astro';
  import NavBar from '../components/NavBar.tsx';
  import HeroSection from '../components/HeroSection.astro';
  import FeaturesSection from '../components/FeaturesSection.astro';
  import TestimonialsSection from '../components/TestimonialsSection.astro';
  import CtaSection from '../components/CtaSection.astro';
  import Footer from '../components/Footer.astro';
  ---
  <Layout>
    <NavBar client:load />
    <main>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
    <Footer />
  </Layout>
  ```
- [ ] Create `src/pages/privacy-policy.astro`: Layout + `<NavBar client:load />` + `<main class="pt-32 pb-16">` wrapping the prose block (port the `<h2>`/`<p>`/`<ul>` markup verbatim from `PrivacyPolicy.tsx:17-93`) + `<Footer />`. Use a build-time `lastUpdated` string in the frontmatter: `const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });`.
- [ ] Create `src/pages/terms-of-service.astro`: same structure, port markup from `TermsOfService.tsx`.
- [ ] Create `src/pages/404.astro`:
  ```astro
  ---
  import Layout from '../layouts/Layout.astro';
  import NavBar from '../components/NavBar.tsx';
  ---
  <Layout title="Page not found">
    <NavBar client:load />
    <main class="pt-32 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 class="text-5xl font-bold mb-4">404</h1>
      <p class="text-lg text-muted-foreground mb-8">The page you were looking for doesn't exist.</p>
      <a href="/" class="text-primary hover:underline">Back to home</a>
    </main>
  </Layout>
  ```

**DoD:** `npm run build` produces `dist/index.html`, `dist/privacy-policy/index.html`, `dist/terms-of-service/index.html`, `dist/404.html`. Each direct file loads in `npm run preview` at the corresponding URL without 404s. NavBar renders on every page.

### Task 10: Delete dead React code

Now that every section is ported, drop the React originals and unused dependencies' touchpoints.

- [ ] `rm src/App.tsx src/main.tsx`
- [ ] `rm src/pages/Index.tsx src/pages/PrivacyPolicy.tsx src/pages/TermsOfService.tsx src/pages/NotFound.tsx`
- [ ] `rm src/components/HeroSection.tsx src/components/FeaturesSection.tsx src/components/TestimonialsSection.tsx src/components/CtaSection.tsx src/components/Footer.tsx`
- [ ] `rm src/components/FaqSection.tsx src/components/AppDemoSection.tsx` (these were never rendered)
- [ ] `rm -rf src/components/ui` (all 47 unused shadcn primitives)
- [ ] `rm -rf src/components/ui-custom` (replaced by `.astro` versions)
- [ ] `rm -rf src/hooks` if it exists
- [ ] Keep: `src/components/NavBar.tsx`, `src/lib/utils.ts`, `src/styles/global.css`, `src/data/testimonials.yaml`, everything under `src/pages/` and `src/layouts/` and `src/components/*.astro`.
- [ ] Run `grep -rE "react-router-dom|js-yaml|@tanstack|@radix-ui|@hookform|tanstack" src` — should return zero hits.
- [ ] Run `npx astro check` — must pass with no errors.

**DoD:** `npx astro check` exits 0. `find src -name "*.tsx" | wc -l` returns `1` (only `NavBar.tsx`). `npm run build` succeeds.

### Task 11: Update the GitHub Pages workflow and delete the legacy deploy script

The Action structure stays — only the `static_site_generator` hint changes. `deploy.sh` force-pushes to `gh-pages` and conflicts with the Pages-artifact flow; remove it.

- [ ] Edit `.github/workflows/deploy.yml`: change
  ```yaml
  static_site_generator: custom
  ```
  to
  ```yaml
  static_site_generator: astro
  ```
- [ ] Leave the `Create CNAME file` step (`echo 'golfgps.ai' > dist/CNAME`) as-is. Astro doesn't copy root `CNAME` into `dist/` automatically.
- [ ] Confirm `node-version: '20'` and `cache: 'npm'` still match. Confirm `path: './dist'` for `upload-pages-artifact` — Astro outputs to `dist/` by default, no change needed.
- [ ] `rm deploy.sh`
- [ ] `rm CNAME` is **NOT** done — the root `CNAME` file is harmless to keep, and removing it would break the manual fallback. Leave it.

**DoD:** `cat .github/workflows/deploy.yml` shows `static_site_generator: astro`. `deploy.sh` no longer exists. Pushing to `main` triggers the workflow; the `build` job exits green (verify in Actions tab after Task 12 is done).

### Task 12: Final validation

Verify the build, type-check, and walk every user-visible flow with a browser before declaring done. The site is small enough that the manual walkthrough is fast — do it.

**Environment setup**

- [ ] From the worktree root, run `rm -rf dist node_modules/.astro && npm run build`. Expect exit 0 and a `dist/` directory containing at minimum: `index.html`, `privacy-policy/index.html`, `terms-of-service/index.html`, `404.html`, `CNAME` (after the Action runs the CNAME step; local builds won't include CNAME — that's fine), `favicon.ico`, `og-image.png`, `images/testimonials/*.jpg`, and one or more JS assets under `_astro/`.
- [ ] Confirm the JS bundle size: `du -sh dist/_astro/*.js` — the NavBar island should be a single JS file in the low tens of KB gzipped, with no extra chunks (no react-router-dom, no js-yaml, no radix-ui).
- [ ] Run `npx astro check` — must exit 0.
- [ ] Run `npm run preview` in the background; it serves on `http://localhost:4321`.

**Automated checks**

- [ ] `grep -rE "gptengineer|lovable|golfshot-navigator" src dist .github` — must return zero results.
- [ ] `grep -c "John Doe" dist/index.html` and `grep -c "Sarah Johnson" dist/index.html` — both must be >= 1 (testimonials baked into HTML at build time; checking two distinct names catches a partial-render bug).
- [ ] `grep -c "Privacy Policy" dist/privacy-policy/index.html` — must be >= 1.

**Manual walkthrough — use agent-browser (or whichever browser-automation tool the project has) against `http://localhost:4321`**

Run each scenario fully; do not stop at the first checkmark. After each scenario, confirm console errors = 0 and network 5xx = 0.

1. **Home page golden path**
   - Navigate to `/`. **Pass criteria:** NavBar visible at top, Hero headline "Plan Your Perfect Golf Shot with Precision Distance Mapping" rendered, "Download Now" and "Learn More" buttons visible, PhoneMockup image renders (placeholder.svg is acceptable), Features section shows four cards with `Target`/`MapPin`/`Compass`/`Eye` icons, Testimonials section shows four cards with names John Doe / Sarah Johnson / Michael Chen / Emma Rodriguez, CTA "Ready to Transform Your Golf Game?" visible, Footer shows current year and Instagram link.
2. **Anchor scroll**
   - Click "Learn More" in Hero. **Pass criteria:** page scrolls smoothly to `#features` (native CSS smooth-scroll behavior). URL hash becomes `#features`.
3. **NavBar scroll-state**
   - Scroll down >20px. **Pass criteria:** NavBar background changes from transparent to `bg-background/80 backdrop-blur-md shadow-sm` (visible in computed styles), padding tightens from `py-6` to `py-4`.
4. **NavBar mobile menu**
   - Resize viewport to 375x812 (iPhone). **Pass criteria:** desktop nav items hidden, hamburger icon visible. Click hamburger → mobile menu drops down with Features / Privacy Policy / Terms of Service / Instagram / Download Now. Click Privacy Policy → navigates to `/privacy-policy/`. Reload at this width, open menu, click X → menu closes.
5. **Direct load of subroute (the bug Astro fixes)**
   - Navigate directly to `http://localhost:4321/privacy-policy/`. **Pass criteria:** page loads with full prose, NavBar + Footer present, **no 404**. (The current Vite SPA would 404 here on Pages without fallback config.)
   - Same for `/terms-of-service/`.
6. **404 page**
   - Navigate to `/nonexistent-route`. **Pass criteria:** the `404.astro` content renders ("Page not found" or the copy you used), NavBar visible, link back to `/` works.
7. **External link**
   - Click the Instagram icon in NavBar. **Pass criteria:** opens `https://www.instagram.com/acetracegolf` in a new tab (`target="_blank"` + `rel="noopener noreferrer"`).
8. **Console & network hard gates**
   - Across every scenario above: DevTools console shows **0 errors**. Warnings are reviewed and explainable — the SF Pro Display fonts pull from `applesocial.s3.amazonaws.com`, which intermittently 403s and emits a `net::ERR_*` or font-decoding warning; that pre-existing condition does not block the migration. Astro/Vite dev-mode HMR messages are also expected. Network panel shows **0 5xx responses** and **0 requests to `/data/testimonials.yaml`** (that file no longer exists; testimonials are inlined).

**Deploy verification (after merging to main)**

- [ ] Watch the `Deploy to GitHub Pages` Action run on the `main` branch. **Pass criteria:** both `build` and `deploy` jobs exit green.
- [ ] Visit `https://golfgps.ai` and repeat scenarios 1, 4, 5, 6 against production. **Pass criteria:** identical behavior to local preview.

**Cleanup**

- [ ] Stop the local `npm run preview` background process.
- [ ] No leftover `dist/` to commit — `dist/` should already be in `.gitignore`; verify and add it if missing.

**Overall pass criteria:** `npm run build` and `npx astro check` exit 0; all 8 manual scenarios pass; production deploy serves the same site; JS bundle is roughly NavBar-sized (no React-Router/Radix/QueryClient/js-yaml shipped to the browser); direct loads of `/privacy-policy` and `/terms-of-service` work without SPA fallback.
