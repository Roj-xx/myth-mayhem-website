# Myth Mayhem website — design

Date: 2026-11-23 · Source of truth: `BRIEF.md` (this doc adds decisions made since, and the builder's calls).

## Intent
The official site for Myth Mayhem v0.3.0, a 1v1 card battler built on Philippine mythology.
It's for competition judges now and players later. In under 10 seconds a player must find
the download, and a judge must find the GDD, Roadmap and User Manual. The site should feel
alive (motion, interactivity) and more polished than the game's own art. It must never feel
AI-generated or flat.

## Goals
- Download buttons for Android and Windows, visible above the fold on every viewport, with version + size labels.
- The three design docs as navigable web pages (TOC, heading anchors, good typography).
- A card gallery of all 55 collectibles (44 deck cards + 11 gods), filterable and searchable.
- A landing page that teaches the world and the core loop through interaction.
- Content changes in the game repo reach the site with one command (`npm run sync`).

## Non-goals
- **No screenshots section** (user decision 2026-11-23). There are no real in-game screenshots
  yet, and placeholders look unfinished. The hero trailer stays. A screenshots section is a
  later addition.
- No accounts, CMS, analytics, i18n, backend or press kit (press kit needs a separate ask).
- No Cards.md balance/changelog pages. Cards.md feeds data only.

## Anti-goals (failure even if it "works")
- Any page resolving a protected mystery (GDD §2.2): relic identity, cause of the Awakening,
  why two Inheritors, the original separation, faction motives. Hints only.
- Game art copied 1:1 as the site's look, or a look that reads as generic AI/fantasy template.
- Horizontal scroll on phones; download buttons below the fold; motion that ignores
  `prefers-reduced-motion`.
- Download URLs or trailer path hard-coded in more than one place.
- Writing anything into `C:\Dev\Myth Mayhem`.

## Constraints
- Astro, static output, plain CSS, vanilla JS / tiny islands. Vercel zero-config.
- All swap-points live in `src/config/site.ts`: `version`, `downloads.windows.url/size`,
  `downloads.android.url/size`, `trailer`, `poster`, credits.
- Download URLs are the GitHub `releases/latest/download/...` links from the brief.
- Copy is in English. Filipino game terms (Alay, Tawag, Kara y Krus, god names) are kept as-is.
- Cards are keyed by stable ID (`MM-CORE-001`, `MM-GOD-001`…) in data, and shown by display name.
- Source art is huge (Hero.png 78 MB, card art 536 MB). Only optimized output is committed.

## Approaches (chosen: A)
- **A. Sync script does all conversion; Astro just renders committed output.** Node + `sharp`
  turns art into AVIF/WebP and parses the Cards.md tables into `src/data/cards.json`. Docs are
  copied as Markdown and rendered by Astro. *Chosen*: the user reviews plain committed files
  before pushing, the repo stays small, and builds are fast and deterministic on Vercel.
- B. Parse Cards.md at build time. Works, but the data changes are invisible in review, and a
  Cards.md format change breaks the Vercel build instead of the local sync.
- C. Astro `<Image>` conversion at build. Requires committing the ~600 MB of originals.

## Design

### Sync (`scripts/sync.mjs`, `npm run sync`)
- Reads `C:\Dev\Myth Mayhem` (path overridable via `MM_GAME_DIR`). Read-only. Fails loudly
  with a clear message if a source is missing.
- Docs: `Docs/{GDD,Roadmap,UserManual}.md` → `src/content/docs/{gdd,roadmap,manual}.md`.
  Links between the three docs are rewritten to site routes. Links to unpublished docs
  (ImplementationPlan, UIGuide, Cards.md, etc.) become plain text.
- Cards: parse the tables in Cards.md §3 Creatures, §4 Rituals, §5.2 Domains, §6 Buildings
  and §7 Gods. IDs are assigned in table order per the Cards.md ID ranges. Output: id, name,
  type, rarity, cost, atk, hp, text (keywords/ability), alay, lore (folklore basis), plus
  god-only role / passive / active / access fields, and an art path. Markdown bold/italics
  are stripped to plain text. A self-check asserts the counts (24/8/9/3/11) and unique IDs,
  and fails the sync if they don't hold.
- Art: `Assets/Art/Cards/**` (matched to cards by file name = display name, case-insensitive),
  `Assets/Art/Avatars/*` (gods + Inheritors), `Assets/Art/Backgrounds/Hero.png`,
  `Assets/Art/Branding/{AppIcon,LogoGold}.png` → `public/media/...` as AVIF + WebP at fixed
  widths (cards 480 px; hero 1600 + 2560 px; avatars 640 px). A card with no art is listed
  in the output and gets the card back (`BackCard.png`) as a fallback.
- Trailer: `Splash Video H264.mp4` → `public/media/trailer.mp4` (copied as-is, 2.7 MB).
- Prints a short summary (files written, cards per type, any missing art).

### Pages
1. **`/` Landing** (one long page). Sections in order:
   - Hero: logo, one-line pitch (from GDD §1.1), two download buttons + version + size,
     muted looping trailer behind with the key art as poster. The video is not loaded (poster
     only) under reduced motion or Save-Data, and the poster shows if autoplay fails.
   - World: the Forgotten World → Awakening → two Inheritors → Path of Separation vs Path of
     Control (a two-sided choice the user can toggle). Copy comes from GDD §2.1 only, with
     the relic and the cause left open.
   - Patron Gods: interactive picker. Select a god to see its portrait, role, Passive and
     Active. Keyboard-operable (tablist pattern).
   - How a match plays: a step-through explainer over a drawn 3-lane board covering Kara y
     Krus, Summon points, playing to lanes, Alay, Domain clash and automatic combat at end of
     turn. Rules come from GDD §3 / User Manual.
   - Game modes (GDD §5: Vs AI, PvP Casual, PvP Ranked, Story, Tutorial), each labelled
     available/coming per the User Manual.
   - System requirements + install help (Android "Install unknown apps"; Windows SmartScreen
     "More info → Run anyway"; unzip the whole folder).
   - Credits (ELEMENTO; Marinduque State University — College of Information and Computing
     Sciences) + footer.
2. **`/cards`**: grid of all 55 cards. Text search (name, text, lore), filters for type and
   rarity, sort by cost/name. Works without JS (full grid). Card hover tilt. Clicking a card
   opens a detail dialog (`<dialog>`) with the full text. The URL hash keeps the open card
   for sharing.
3. **`/docs`**: index of the three docs, plus `/docs/gdd`, `/docs/roadmap`, `/docs/manual`
   with a sticky TOC (h2/h3), heading anchors, readable measure, styled tables, and
   prev/next between docs. Nav has "Docs" (labelled "For judges" on the landing hero area).

Global: top nav (logo, Cards, Docs, Download), Astro view transitions between pages, CSS
scroll-driven reveals behind `@supports` and reduced-motion guards, skip link, visible focus.

### Look
- Mood and colour come from the game's UI and card art (to be sampled during the design step
  into `DESIGN.md`): dark ground, gold accents, ritual/earth tones. Then they're restrained:
  one display face + one text face, generous spacing, a strict grid, and few textures.
- `DESIGN.md` is written before page work. It names 1–3 reference design languages from
  `awesome-design-md` as structure only, plus our own tokens (colour, type scale, spacing,
  radius, motion) and voice.

### Verification
Playwright on every page at 375 px and 1440 px, reduced-motion on, keyboard-only pass
(nav, gods picker, explainer, gallery filters, dialog), no horizontal scroll, no console
errors, `astro build` clean. Report what was and wasn't checked.

## Left to the builder (calls made here, user may override)
- Exact image widths/quality; fonts (self-hosted, two families max).
- Copy wording beyond the facts in the docs (pitch line, section intros).
- System requirements (none are stated in the docs). From the game's ProjectSettings and
  Unity 6 platform minimums: Android 7.1+ (min SDK 25), 64-bit ARM (ARM64) only;
  Windows 10/11 64-bit, a DirectX 11/12 GPU. RAM/storage are not shown (unknown, not invented).
- Download sizes in `site.ts`: Android "312 MB" (local `Builds/PvP/Android/MythMayhem.apk`,
  2026-11-23); Windows "TBC" until the zip exists. Both are one edit to update.
- `README.md` with the release steps from the brief, the sync steps, and the swap-points.
  **Correction to the brief's step 2:** the Unity build folder also contains
  `*_BurstDebugInformation_DoNotShip` (and the Android folder has
  `*_BackUpThisFolder_ButDontShipItWithYourGame`). Those must be left out of the zip, so the
  README says so.
