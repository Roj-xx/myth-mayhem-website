# Product

<!-- impeccable:product-schema 1 -->

> Inferred from `BRIEF.md` (the user's agreed brief, 2026-11-23) and the game repo. The user said to proceed without further questions; inferences are marked *(inferred)*.

## Platform

web

## Stack

Astro (static output), plain CSS, vanilla JS. Deployed on Vercel. (From BRIEF.md.)

## Users

- **Competition judges (now):** evaluating a student game project; they need the GDD, Roadmap and User Manual fast, and an impression of craft.
- **Players (later):** Filipino players, the diaspora, and mythology/card-game fans on Android and Windows; they need to download and install.

## Product Purpose

The official site of **Myth Mayhem**, a turn-based 1v1 collectible card battler built on Philippine mythology (Unity 6, Windows + Android, v0.3.0). Success: a player reaches a download in one click; a judge reaches the design docs in one click; both come away understanding the world and how a match plays.

## Positioning

Philippine mythology as a full setting, not reskinned fantasy, with Filipino naming throughout. Its signature mechanic is **Alay** (offering): sacrificing your own cards for power. Three lanes, one resource, automatic combat.

## Operating Context

- Downloads come from GitHub Releases (Windows zip, Android APK sideloaded). Install friction is real: Android "install unknown apps" and Windows SmartScreen.
- Content (docs, cards, art) is synced from the game repo with `npm run sync`. The site never edits the game repo.

## Capabilities and Constraints

- Pages: landing, card gallery (55 cards: 44 deck cards + 11 Patron Gods), docs (GDD, Roadmap, User Manual).
- Protected mysteries (GDD §2.2) are never resolved on the site: the relic's identity, the cause of the Awakening, why two Inheritors, the original separation, faction motives.
- Real screenshots and a gameplay clip were captured from the v0.3.0 Windows build (account names blurred).
- Copy is in English. Filipino terms are kept as-is (Alay, Tawag, Kara y Krus, god names).

## Brand Commitments

- Name: Myth Mayhem. Logo: `LogoGold.png`. App icon: `AppIcon.png`.
- Credits: **ELEMENTO**; **Marinduque State University — College of Information and Computing Sciences**.
- Look (user, 2026-11-23): expensive and elegant, a modern game site with gradients, a moving background, parallax, rounded corners, glass, hover effects, cursor tracking and animation. Palette drawn from the game's menus (violet night, magenta, gold).

## Evidence on Hand

Card art for all 55 cards, 11 god + 4 Inheritor portraits, key art (`Hero.png`), a splash video standing in for the trailer, logos, and the three design docs. No testimonials, reviews, player counts, press or awards: none may be invented.

## Product Principles

1. Two front doors: Download and Docs are never more than one click away.
2. Lore first, but mysteries stay open. Hint, never resolve.
3. Teach by doing: interaction explains the rules better than prose.
4. Credible over flashy. It's judged as craft, so restraint beats spectacle.

## Accessibility & Inclusion

Works on low-end Android phones and slow connections *(inferred from audience)*. Keyboard-operable, reduced motion respected, WCAG AA contrast.
