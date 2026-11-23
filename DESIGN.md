# Myth Mayhem — Design System

**Direction (set by the user, 2026-11-23):** expensive and elegant, like a modern game launch site. It uses gradients, a moving background, parallax, rounded corners, glass, hover effects, cursor tracking, transitions and animation. The palette comes from the game's own menus: a moonlit violet night, magenta and gold.

Structural references (from `awesome-design-md`, structure only): **PlayStation**, for marketing told in chapters where the art does the storytelling; **Mintlify**, for docs with a sidebar, a ~720px prose column and an on-page TOC.

## World: the moonlit Boundary

- **The sky is the ground.** A fixed, slowly drifting aurora (violet, magenta, a touch of gold), a star field, film grain, and a soft light that follows the cursor (`.sky` in `Base.astro`). No section has a flat solid background.
- **Glass carries the content.** Panels are frosted glass with a 1px light rim and an inner highlight. On hover the rim turns gold and a spotlight follows the cursor inside the panel (`.glass` + `.glow-card`).
- **The game's art is the colour.** Key art, card art, god portraits and real screenshots stay saturated and are never recoloured.

## Colour

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0B0614` | Night base |
| `--bg-2` | `#150A26` | Media placeholders |
| `--plum` / `--violet` | `#2A0F4A` / `#4A1D86` | Sky and gradient body |
| `--magenta` | `#C2267A` | Primary actions (with violet), aurora |
| `--rose` | `#F08BC0` | Moon, highlights, links in install steps |
| `--gold` / `--gold-deep` | `#E9C47E` / `#B98A3E` | Focus, selected state, rims, numbers |
| `--text` / `--text-soft` | `#F6EFFA` / `#C9BADB` | Text |
| `--on-gold` | `#1C0F24` | Text on gold |
| `--glass`, `--line`, `--line-gold` | white at 5.5% / 12%, gold at 45% | Glass fill, rims |

The primary button is a magenta-to-violet gradient with a gold glint that sweeps across on hover. The selected state (chips, tabs, doc pills) is a gold gradient with `--on-gold` text.

## Type

- **Display: Marcellus.** Classical, flared Roman, for titles in sentence case.
- **Text & UI: Manrope** (variable 200–800).
- Scale: h2 `clamp(2.25rem, 5vw, 3.75rem)`, hero tagline `clamp(1.75rem, 3.4vw, 2.75rem)`, body 1rem/1.65, lede ~1.2rem.

## Shape, space, depth

- Radius: 28px (large panels), 20px (cards, media), 12px (small surfaces), 999px (buttons, chips, nav bar, inputs).
- Base 8px; chapters 72px on mobile, 120px on desktop; gutters 16, 32 and 48px; max width 1240px.
- Depth: glass with blur(18px), a soft long shadow, and a coloured glow on hover. There are no hard borders.

## Motion (`src/scripts/motion.ts`)

- **Hero:** a layered stage (moon, a slowly turning gold ring, the key-art figure, mist, rising embers). Each layer moves with the cursor (`data-depth`) and with scroll (`data-scroll`). The figure floats.
- **Cursor:** a page-wide light, spotlights inside cards, magnetic buttons. These run only with a fine pointer and full motion.
- **Scroll reveals:** `.reveal` fades, rises and un-blurs once, staggered with `--d`. First-screen content never starts hidden (`.rise` only settles into place).
- **Interaction:** card tilt in the gallery, the halo around the selected god, the path toggle sliding in, the match board's step states, and Astro view transitions between pages.
- Durations: 250ms (hover), 450ms (state), 900ms (reveal). Easing is `cubic-bezier(.16,1,.3,1)`.
- **Reduced motion:** no aurora drift, parallax, embers, cursor effects, reveals or video autoplay. Everything is visible and static.

## Media

- Real screenshots from the v0.3.0 Windows build are in `public/media/shots/` (battle, deck builder, collection, Tawag, packs) (AVIF + WebP, 800 and 1600 wide, account names blurred). A gameplay loop is in `public/media/gameplay.mp4` (cropped to the board, no audio). The clip plays in the hero's floating glass frame. `public/media/tawag.mp4` (a ten-card summon) plays in the Collection section. Both play only with full motion and no Save-Data, and pause off screen.
- Low-end devices (4 cores or fewer, 4 GB of memory or less, or Save-Data) get a `lite` class. It stops the ambient motion (aurora drift, stars, embers, ring, cursor light, parallax) but keeps the look. Glass panels use no backdrop blur; only the nav bar does.

## Voice

Plain, specific, second person. Copy hints at the mysteries and never resolves them: the relic's identity, the cause of the Awakening, why two Inheritors, the original separation, faction motives.
