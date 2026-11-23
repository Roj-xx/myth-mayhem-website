# Myth Mayhem — Design System

Our own language. Structural references only (from `awesome-design-md`):
**PlayStation**, for marketing told in full-bleed chapters where a change of surface *is* the divider and the art does the storytelling; and **Mintlify**, for docs with a sidebar, a ~720px prose column and an on-page TOC. No colours, type or components are taken from either.

## World: the capiz window

The bahay na bato's sliding window: thin panes of **capiz shell** set in a lattice of dark **narra** wood. By day the panes are pearly and translucent; at night, lit from inside, they glow amber. It's the Boundary, made domestic: a membrane between inside and outside, the seen and the unseen.

- **Wood is the ground.** Dark narra carries the page.
- **Panes are the content fields.** Luminous, light regions set into the wood.
- **The muntin gap is structure.** Grids are wood showing between panes. We don't draw borders, rules or cards with shadows.
- **The game's art is the colour.** Card art and god portraits stay saturated. The chrome stays quiet around them.

Why dark: players open this on a phone in the evening, and the card art is luminous. Judges see the same page. The lit-window-at-night scene settles it.

## Colour (strategy: committed, wood + pane)

| Token | Hex | Role |
|---|---|---|
| `--narra` | `#24140F` | Page ground (wood) |
| `--narra-raised` | `#331D16` | Wood surfaces one step up: nav, dialog, inputs on wood |
| `--muntin` | `#3B2219` | The lattice gap between panes (a lighter narra, so muntins read as wood, not black frames) |
| `--capiz` | `#EEE6D8` | Pane field (light regions) |
| `--capiz-deep` | `#DCD0BD` | Pane shade, pane-on-pane, table stripes |
| `--ink` | `#24140F` | Text on capiz |
| `--ink-soft` | `#5B4A40` | Secondary text on capiz (≥7:1) |
| `--paper` | `#F2EADF` | Text on wood |
| `--paper-soft` | `#BFAA9B` | Secondary text on wood (≥7:1) |
| `--lamp` | `#F3B95F` | Lamplight: focus ring, active state, glow behind panes. Never body text on capiz |
| `--alay` | `#B81F4E` | The offering colour: primary action (Download) and the Alay concept only |
| `--alay-hover` | `#D02A5D` | |

Rules: `--alay` appears only on download actions and Alay content, so it always means "commit". `--lamp` marks "this is live/selected". No gradients as decoration. The only glow is lamp light behind a pane.

## Type

- **Display: Marcellus** (single weight, flared Roman). It echoes the carved flare of the game logo without copying it. Used only for page and section titles, in sentence case, 2rem and up. Never in all caps or for labels.
- **Text & UI: Atkinson Hyperlegible Next** (variable 200–800). Body, UI, docs and data.
- Scale (1.25, rem): 0.8 · 1 · 1.25 · 1.563 · 1.953 · 2.441 · 3.052 · clamp(3rem, 8vw, 5.5rem) for the hero.
- Body 1.0625rem/1.65 on wood, 1.0625rem/1.7 in docs. Measure ≤ 70ch. Headings: more space above than below.
- Filipino terms are set in the running text style, never italicised as "foreign".

## Space & layout

- Base 8px. Tokens: 4, 8, 12, 16, 24, 32, 48, 72, 112.
- Chapters: 112px vertical on desktop, 72px on mobile. Gutters: 16px mobile, 32px tablet, 48px desktop. Max content 1200px; docs 3-column (nav 220 · prose ≤720 · TOC 200).
- **Lattice grid**: a `display:grid` container whose background is `--muntin` and whose `gap` (6px) is the muntin. Children are panes. It's used for the gods picker, match board, modes and gallery.

## Shape & depth

- Radius: 0 on structure (bands, lattice, panes); 4px on inputs; 999px on every button and chip (one control shape).
- Depth comes from light, not shadow: the active pane gets `box-shadow: 0 0 0 2px var(--lamp), 0 0 32px -8px var(--lamp)`. There are no resting shadows.
- Capiz material (`.pane`): lit from behind. A radial lamp-white centre, a faint conic nacre sheen and cloudy `feTurbulence` shell noise over `--capiz`. Static and cheap.
- Hero window: the key art is clipped inside a narra-framed 4×3 lattice. Pearl panes sit over it, and the trailer plays inside the window with screen blend (switch to normal blend for a full-colour trailer).

## Motion

- Durations: 120ms (press), 200ms (hover/state), 320ms (pane slide), 600ms (page-load lamp sequence). Easing `cubic-bezier(.2,.7,.2,1)`. Exits are 30% faster.
- **One orchestrated moment**: on hero load the lattice behind the key art warms pane by pane (lamp light), once.
- **Signature interaction**: sliding panes. The Separation/Control toggle slides the window, and the match explainer moves between board states.
- Cross-page: Astro view transitions. The nav persists, and a gallery tile morphs into its detail view.
- Card tilt: fine pointers only, max 8°.
- `prefers-reduced-motion: reduce`: no load sequence, tilt, slide or video. Changes are instant cross-fades of ≤120ms or none.

## Components

- **Button**: pill, 48px tall (44px minimum touch). Primary = `--alay` fill, `--paper` text. Secondary = 1.5px `--paper-soft` outline on wood, or `--ink` outline on capiz. Labels say exactly what happens ("Download for Android").
- **Pane**: a `--capiz` field, 24–32px padding, ink text, no radius.
- **Chip/filter**: 36–44px tall, pill, `aria-pressed`. The active state is `--lamp` fill with `--ink` text.
- **Focus**: 2px `--lamp` outline, 2px offset, everywhere.
- **Nav**: wood bar, logo left, links right (Cards, Docs, Download). Download is the one pill.

## Voice

Plain, specific and in the second person: "Pick a patron god", not "Discover divine power". Copy hints at the mysteries but never resolves them: the relic's identity, the cause of the Awakening, why two Inheritors, the original separation, faction motives. Errors and empty states say what happened and what to do next.
