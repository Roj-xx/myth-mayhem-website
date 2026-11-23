# Myth Mayhem website — build brief

Agreed with the user in an interview on 2026-11-23. Build exactly to this brief.
If something here is unclear, ask the user before guessing.

## What it is
The official website for **Myth Mayhem**, a 1v1 card battler based on Philippine
mythology (Unity 6, Windows + Android, current version **0.3.0**).
Audience: competition judges now, real players later. Both must find what they
need fast: players want to download, judges want the design docs.

## Required skills (use them, strictly)
Installed as user-level plugins/skills. Load the relevant ones before each phase:
- `superpowers` — workflow: brainstorming → writing-plans → executing-plans,
  verification-before-completion. Write a plan before coding.
- `frontend-design` and `impeccable` — visual design quality, critique and polish.
- `ui-ux-pro-max` — palette, type, landing-page patterns, UX rules.
- `awesome-design-md` — pick 1–3 reference design languages, then write this
  site's own `DESIGN.md` (our palette/type/voice; never copy a real brand).
- `modern-web-guidance` — HTML/CSS/JS, accessibility, performance, security standards.
- `ponytail` — keep the code lean.
- Playwright MCP — check every page in a real browser (desktop + mobile widths,
  reduced motion, keyboard) before calling anything done.
- `claude-code-setup` — at the end, recommend automations for this repo.

## Stack
- **Astro** (static output), plain CSS, vanilla JS / small islands only where
  interactive. Deploy target: **Vercel** (zero-config static).
- No heavy UI framework. Respect `prefers-reduced-motion`.

## Pages
1. **Landing (one long scrolling page)**
   - **Hero**: game title/logo, one-line pitch, **Download for Android** and
     **Download for Windows** buttons (above the fold), version + size labels.
     Background: **muted looping trailer clip** with the **key art still** as
     poster/fallback (slow connections, reduced motion, autoplay blocked).
     The trailer **must be easy to swap**: one file path in one config
     (e.g. `src/config/site.ts` → `trailer: "/media/trailer.mp4"`), so the
     user can drop in the new trailer later.
   - World / lore teaser (the Forgotten World, the Awakening, the two
     Inheritors, Path of Separation vs Path of Control).
   - Patron Gods showcase (interactive).
   - How a match plays (Summon points, Alay, 3 lanes, Kara y Krus…) — interactive.
   - Game modes.
   - Screenshots / trailer section.
   - System requirements + install help (Android "install unknown apps",
     Windows SmartScreen "More info → Run anyway").
   - Credits + footer.
2. **Card gallery** — filterable/searchable cards with art, from the game data.
3. **Docs** — the **GDD**, **Roadmap** and **User Manual** rendered as readable,
   navigable web pages (table of contents, anchors, good typography), not file
   downloads. Linked clearly from the top nav ("For judges" / "Docs").
4. Other pages are welcome if they help (e.g. press kit), but ask first.

## Look and feel
- Take the palette, textures and mood from the **game's UI and card art**, but
  do not copy it 1:1 — the user feels the game art can look AI-generated. Add a
  layer of **modern professionalism**: restrained type, generous spacing, clean grid.
- **Smooth transitions and animations**, and real **interactivity** so it never
  feels like a flat static page (e.g. view transitions between pages, card hover/
  tilt, scroll-driven reveals, interactive gods/match explainer).
- Must work great on phones (16px gutters, no horizontal scroll).

## Copy
- English, with the game's own Filipino terms kept as-is (Alay, Tawag,
  Kara y Krus, god names).
- **Never resolve the protected mysteries** (GDD §2.2): the relic's identity,
  the cause of the Awakening, why two Inheritors, the original separation,
  faction motives. Hints only.
- Cards are referenced by stable ID (`MM-CORE-001`) in data; show display names.

## Credits
- **ELEMENTO**
- **Marinduque State University — College of Information and Computing Sciences**

## Downloads (GitHub Releases on this repo)
Buttons point to the latest release, so new versions need no site edit:
- Windows: `https://github.com/Roj-xx/myth-mayhem-website/releases/latest/download/MythMayhem-Windows.zip`
- Android: `https://github.com/Roj-xx/myth-mayhem-website/releases/latest/download/MythMayhem-Android.apk`
  (the user will give the actual Android release link later; keep the URLs in
  `src/config/site.ts` so they are one edit to change).

How the user publishes the Windows build (put this in the repo README):
1. In Unity, build Windows to a folder (e.g. `Builds/Windows/`).
2. Zip the **whole folder contents** (exe, `_Data` folder, `UnityPlayer.dll`,
   `MonoBleedingEdge`…) into `MythMayhem-Windows.zip`.
3. GitHub → this repo → Releases → Draft a new release → tag `v0.3.0` →
   attach `MythMayhem-Windows.zip` and `MythMayhem-Android.apk` → Publish.
4. Keep the same file names for every release.

## Content source (sync script)
The game repo is at `C:\Dev\Myth Mayhem`. Add a one-command sync script
(e.g. `npm run sync`) that copies from it, and commit the copies:
- `Docs/GDD.md`, `Docs/Roadmap.md`, `Docs/UserManual.md` → docs pages
- `Docs/Cards.md` → card gallery data
- Art: `Assets/Art/Cards/`, `Assets/Art/Avatars/` (gods, Inheritors),
  `Assets/Art/Backgrounds/` (`Hero.png` = key art, `Splash Video H264.mp4` =
  current trailer stand-in), `Assets/Art/Branding/` (`AppIcon.png`, logo).
  Convert images to optimized AVIF/WebP at build or sync time.
The user runs the script, reviews, and pushes. Never edit the game repo from here.

## Rules for working in this repo
- Commit only when the user asks.
- Verify in a real browser (Playwright) before reporting done; report what was
  and wasn't checked.
