# InterFusta redesign: "Workshop Editorial"

## Context

The current site is stock shadcn + Inter + amber-800 card grids and reads as generic AI output. The logo's true brand orange `#FC4108` is never used. There is no dark mode. Audience is homeowners in Andorra (Catalan copy). Photos are mixed quality, so type and layout must carry the page.

Design read: overhaul redesign of a local carpentry firm's marketing site for homeowners, warm craft-catalogue language, on the existing Tailwind v3 + shadcn stack. Dials: variance 7, motion 3, density 3.

Direction: a craftsman's printed catalogue. White and orange as the company colors. Near-black ink. Orange used sparingly: hairlines, the single CTA, one color block on the home page. Sans display headlines with character, left-aligned. Services as a hover-reveal list, not cards. Real photos, full-bleed, with functional captions or none.

Banned on public pages: gradients, blur, glass, glow, icon-badge cards, centered hero text, three equal cards, section numbers, decorative mono labels, decorative captions, middle-dot separators, inverted sections, em-dashes, `h-screen`.

Decisions locked with the user:
- Scope: public pages + nav/footer only. Admin and login keep their current shadcn look. Same pages, same Catalan copy, same slugs, same nav labels, same form field names.
- Dark mode: follows system by default, toggle in nav, preference persisted.
- Fonts: Bricolage Grotesque (headlines), Geist Sans (body), Geist Mono (real data only). Geist files already exist unused in `app/fonts/`.

## Mockup decisions (v3, approved 2026-09-16)

Canvas: https://claude.ai/artifact/LxoBswuRSxUczwkuhA5qkg. These override anything below that conflicts.
- Two-tone warm neutral surface: `paper` for pages, `stone` for the featured band and the footer. Fine SVG grain overlay at 7% (light) / 12% (dark).
- Structural orange: 96×4 rule under page headlines, one orange word per headline, active nav/filter underline, link hovers, CTA buttons. Home CTA band stays the only full orange surface.
- Page headlines 96px, Bricolage `wdth` 80, weight 600, leading .96. Section headlines 80px. Card titles 26 to 44px.
- Depth: featured project text panel overlaps its photo (negative margins on desktop). Contact info sits on a tinted panel over the valley photo.
- Services page: header, full-bleed kitchen band, then eight aligned rows (title / description / photo). Projects page: filters, one lead project, then a three-up grid. Contact: no map iframe, a "Obrir a Google Maps" link instead.
- Headings and button labels in sentence case. Nav labels unchanged.
- Tokens are hex CSS variables (see the implementation plan), replacing the HSL block below.

## Design tokens

Add an independent token set to `app/globals.css`; leave the existing shadcn `--background/--primary/...` block untouched so admin is unaffected. Body keeps `bg-background text-foreground`; public page wrappers set `bg-paper text-ink`. Neutral grays only, one family.

```css
:root {
  --paper: 60 9% 98%;        /* ~#FAFAF9 off-white, not cream */
  --ink: 240 6% 7%;          /* ~#111113 off-black */
  --ink-muted: 240 4% 38%;
  --hairline: 240 5% 86%;
  --brand: 15 98% 51%;       /* #FC4108: large text, buttons, rules, the one color block */
  --brand-ink: 15 100% 38%;  /* ~#C23100: small text/links, AA on paper */
}
.dark {
  --paper: 240 6% 7%;        /* ~#111113 */
  --ink: 60 9% 96%;
  --ink-muted: 240 4% 66%;
  --hairline: 240 4% 20%;
  --brand: 15 98% 51%;
  --brand-ink: 18 100% 64%;  /* lighter, AA on dark paper */
}
```

`tailwind.config.ts` (extend, don't remove): colors `paper`, `ink` + `ink.muted`, `hairline`, `brand` + `brand.ink`; `fontFamily.display/sans/mono` mapped to `--font-bricolage`, `--font-geist-sans`, `--font-geist-mono`. `darkMode: ["class"]` already set.

Shape lock: radius 0 on every public element (buttons, inputs, images, filters). Shadows: none.

## Fonts (`app/layout.tsx`)

Replace Inter with `Bricolage_Grotesque({ subsets: ["latin","latin-ext"], axes: ["opsz","wdth"], variable: "--font-bricolage" })` from next/font/google, plus `localFont` for `./fonts/GeistVF.woff` and `./fonts/GeistMonoVF.woff`. Put the three variables on `<body className="... font-sans">`. `latin-ext` is required for Catalan `l·l`.

Headline scale: `text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]`, `text-wrap: balance`. Body `max-w-[65ch] leading-relaxed`. Weights 400/500/600 available.

Accepted side effect: admin/login body font changes from Inter to Geist Sans. No functional impact.

## Theme toggle (no new dependency)

- `components/theme-script.tsx`: server component rendering an inline `<script>` in `<head>` that reads `localStorage.theme`, falls back to `prefers-color-scheme`, and adds `.dark` to `<html>` before paint (no flash).
- `components/theme-toggle.tsx` (`"use client"`): small text switch "Clar / Fosc" (not sun/moon), toggles `.dark` on `documentElement`, writes `localStorage.theme`. Mounted in `components/navigation.tsx` desktop and mobile.
- Logo: make the black paths in `public/InterFusta-logo.svg` follow `currentColor` (or add a `.dark` rule) so the wordmark is legible on dark.

## Shared primitive (just one)

`components/section-heading.tsx`: `SectionHeading({ title, intro? })`. Display headline, left-aligned, optional one-paragraph intro stacked below it (never a floating right-column paragraph). No numbers, no eyebrow.

Mono label budget: at most one small `font-mono uppercase tracking-widest` label per three sections, page-wide. Mono is otherwise reserved for real data (years, dimensions, phone, hours).

## Motion (dial 3)

CSS only, no animation library. Easing tokens in `globals.css` and `tailwind.config.ts` (`transitionTimingFunction`):

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);  /* enters, press, hover transforms */
--ease: ease;                                 /* color and opacity changes */
```

Rules:
- Only `transform`, `opacity`, `color`, `background-color`, `filter` transition. Never `transition: all`.
- Durations: hover color 150ms, press 160ms, UI enters 180-200ms, exits shorter than enters, hero load-in 500ms.
- Every hover transform sits behind `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion: reduce` removes movement and keeps opacity fades.
- Theme switch is instant. No page-wide color transition.
- No scroll-triggered reveals.

Specific interactions:
- **Hero load-in:** headline, subtext, CTA fade and rise 12px, staggered 60ms, 500ms `--ease-out`, via `@starting-style` with a `data-mounted` fallback. Reduced motion: fade only.
- **Buttons (public CTAs):** `active:scale-[0.97]`, `transition-[color,background-color,transform] duration-150`. Applied via className on shadcn `Button`; component source untouched.
- **Services hover photo:** all four photos mounted and stacked. Active photo `opacity 1`, others `opacity 0` with `blur(2px)`, `transition: opacity 200ms ease, filter 200ms ease`. No `src` swapping.
- **Mobile menu:** enter 180ms `--ease-out` from `opacity 0, translateY(-4px)`; exit 120ms. Via `@starting-style`/`data-mounted`, not `{isOpen && ...}` unmount.
- **Nav links:** color 150ms `ease`. Active underline static.
- **Photo hovers (thumbnails, portfolio grid, gallery):** replace existing `hover:scale-110` with `scale-[1.02]` at 400ms `--ease-out` inside an `overflow-hidden` parent, or no transform. Never 1.10.
- **Portfolio filters:** instant re-render, no animation.
- **Lightbox (`components/image-gallery-modal.tsx`):** image change fades `opacity` 150ms `ease`, no movement. Dialog enter/exit from `components/ui/dialog.tsx` stays as is (200ms, scale 0.95 + fade, centered).
- **Contact submit:** spinner at 0.6s per turn; success state replaces the button label in place, no layout shift; inline errors appear with a 150ms fade.

Phase close: the day after each phase ships, replay every transition at 5x slower in DevTools and fix what looks off.

## Page-by-page

**Nav** (`components/navigation.tsx`): solid `bg-paper border-b border-hairline`, no shadow, height 64px. Links in Geist Sans with active-page state (`text-ink` + hairline underline; others `text-ink-muted`). Theme toggle far right. Mobile: stacked list with hairline dividers. Add a skip-to-content link before the nav. Labels unchanged: Serveis, Projectes, Sobre Nosaltres, Contacte.

**Footer** (`components/footer.tsx`): same theme as the page, `border-t border-hairline`. Three columns kept (blurb / contact / hours), hours and phone in mono. Copyright row under a hairline.

**Home** (`app/page.tsx`), four sections, four different layout families:
1. Hero: keep video, `min-h-[100dvh]`, flat `bg-ink/30` overlay. Headline (max 2 lines) + subtext (max 20 words) bottom-left, one primary CTA `bg-brand text-paper` linking to `/portfolio`. Optional one mono label here uses the page's whole label budget. Nothing centered.
2. Projecte destacat: data from `data/featured-project.json` unchanged. Large photo left, text right with `SectionHeading`, features as a short hairline-divided list (4 items max), thumbnails as a plain strip. Keep `components/image-gallery-modal.tsx`.
3. Serveis: vertical list of 4 rows (display name + one-line description, hairline between). Hovering a row (desktop) switches the large photo in the adjacent column (`useState` index, stacked photos, see Motion). Images: `Medida-2`, `Cuina-2`, `Laca-1`, `Planificacio-1`. Mobile: photo inline per row. Drop icons.
4. CTA: flat `bg-brand text-paper` band, the only color block on the site, left-aligned headline, `bg-paper text-ink` button labelled "Contacte" (same label as nav, one label per intent).

**Services** (`app/services/page.tsx`): `SectionHeading` with stacked intro. Services as a two-column grid (one column on mobile): photo, display title, one-line description. No alternation, no cards, no icons.

**About** (`app/about/page.tsx`): intro split kept on `bg-paper` (text left, `About.webp` right). Stats as one hairline-bounded strip: mono numerals with sentence-case labels, icons dropped. Values as three stacked blocks with generous spacing, no numbers, no dividers.

**Contact** (`app/contact/page.tsx`): drop `Card` wrappers. Keep shadcn `Input`/`Textarea`, field names unchanged, override per instance to underline style: `border-0 border-b border-hairline rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-brand`. Labels above inputs in Geist Sans, placeholders `text-ink-muted` (check AA). Inline error text below fields, plain success message, no exclamation marks. Submit `bg-brand rounded-none`. Info block as label/value pairs, phone and hours in mono, icons small and `text-brand-ink` or dropped. Map iframe with a hairline border.

**Portfolio** (`app/portfolio/page.tsx`, `client-portfolio.tsx`): drop `Tabs`; category filters become a row of text buttons driving `useState`, active one `text-ink` with hairline underline. Two-column grid of flat photos (`components/project-images.tsx` reused), title, and category (plus year in mono if present on the `Project` type in `types/types.ts`), separated by columns not dots. "Veure detalls" as an underlined text link. `SectionHeading` left-aligned. Restyle `components/ui/pagination.tsx` usage via className only. Keep existing skeleton loaders.

**Portfolio detail** (`app/portfolio/[id]/client-page.tsx`): back link as plain text with the existing chevron. Flat hero image, meta as a three-column row, features as a plain list, gallery grid without shadow or radius, hover per the Motion rules. Check `image-gallery-modal.tsx` for amber/gray classes and swap to tokens.

**Keep unmodified**: every file in `components/ui/` (admin depends on them). `Card` and `Tabs` simply stop being imported by public pages.

## Phases (each shippable, `npm run build` after each)

1. Foundation: tokens, fonts, theme script + toggle component. Site looks the same except font. Spot-check `/admin` and `/auth/login`.
2. Nav + footer + `SectionHeading` + logo dark-mode fix + skip link. Mount toggle.
3. Home.
4. Services + About.
5. Contact.
6. Portfolio list + detail.

## Pre-flight checklist (run before each phase ships)

- Zero em-dashes or en-dashes in rendered copy (existing copy has none).
- One theme per page: no inverted sections except the single orange CTA band on home.
- Mono label count per page ≤ ceil(sections / 3).
- No section with three or more consecutive image/text alternations.
- Every CTA readable (AA) and on one line at desktop. One label per intent.
- Radius 0 everywhere on public pages.
- `brand` on `paper` for large text/buttons only; `brand-ink` reaches 4.5:1 for small text in both themes. Check resolved hex.
- Hero: headline ≤ 2 lines, subtext ≤ 20 words, CTA visible without scrolling, `min-h-[100dvh]`.

## Verification

- `npm run build` per phase; fix unused-import lint from dropped `Card`/`Tabs`/icons.
- Each public page in light and dark, desktop and 400px: hero wrap, services list stacking, portfolio one column, mobile menu.
- Hard reload with OS dark + stored light preference: no flash.
- Catalan glyphs (`l·l`, `ç`, `ï`) render in Bricolage Grotesque.
- Hero video still autoplays muted inline on iOS.
- Keyboard: skip link works, focus rings visible on links, buttons, inputs, filters.
- Motion: no `transition-all`, no hover transform outside the hover media query, reduced-motion keeps fades only, theme switch instant.
- `/admin`, `/auth/login` unchanged apart from body font.

## Out of scope, flagged

- `public/video.mp4` is ~32 MB. Compressing it would help the hero a lot but is a separate task.
- No copy rewrites, no new sections, no admin restyle, no custom 404 (worth a follow-up).
