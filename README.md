# Myth Mayhem website

The official site for Myth Mayhem: a landing page, a card gallery and the design docs. It's built with [Astro](https://astro.build) as a static site and deploys to Vercel with no settings.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm test         # card-data parser tests
```

## Things you'll want to change

All of them live in **`src/config/site.ts`**:

| What | Key |
|---|---|
| Version shown on the site | `version` |
| Android download link and size | `downloads.android.url`, `downloads.android.size` |
| Windows download link and size | `downloads.windows.url`, `downloads.windows.size` |
| Hero video | `trailer`. Now a gameplay clip from the Windows build; put a new `.mp4` in `public/media/` and point this at it |
| Windows on/off | `downloads.windows.available` |
| Credits | `credits` |

Both links use GitHub's `releases/latest/download/...` form on `Roj-xx/myth-mayhem-android-download`, so a new release needs no website change, as long as it keeps the file names `MythMayhem.apk` and `MythMayhem-Windows.zip`. Windows has an `available` switch for times when there is no zip.

## Syncing content from the game

The docs, the card data and the art are copied from the game repo (`C:\Dev\Myth Mayhem`). The sync only reads from it, never writes.

```
npm run sync
```

It copies:

- `Docs/GDD.md`, `Docs/Roadmap.md`, `Docs/UserManual.md` and `Docs/Releases.md` → `src/content/docs/`. Links between these three become site links; links to unpublished docs become plain text.
- `Docs/Cards.md` → `src/data/cards.json`. The tables in sections 3–7 are read by card ID (`MM-CORE-001`…, `MM-GOD-001`…). The sync stops with an error if the counts change in a way it doesn't expect.
- Card art, god and Inheritor portraits, the key art (`Hero.png`), the logo and the app icon → `public/media/`, as AVIF + WebP at web sizes.
- `Splash Video H264.mp4` → `public/media/trailer.mp4`.

If the game lives somewhere else: `MM_GAME_DIR="D:/path/to/game" npm run sync`.

After a sync: `npm test`, check the site with `npm run dev`, review the diff, then commit and push.

If you add, remove or rename cards, update the expected counts in `scripts/cards.test.mjs` and the ranges in `scripts/cards.mjs`.

## Publishing a Windows build

1. In Unity, build Windows to a folder, for example `Builds/Windows/`.
2. Zip the **contents** of that folder (`Myth Mayhem.exe`, the `Myth Mayhem_Data` folder, `UnityPlayer.dll`, `MonoBleedingEdge`, `D3D12` and so on) into **`MythMayhem-Windows.zip`**.
   **Leave out** any folder ending in `_BurstDebugInformation_DoNotShip` or `_BackUpThisFolder_ButDontShipItWithYourGame`. They're debug files, not part of the game.
3. On GitHub, open `Roj-xx/myth-mayhem-android-download` → **Releases** → the version's release (for example `v0.3.0`) → ✏️ **Edit** → drag `MythMayhem-Windows.zip` in next to the APK → **Update release**.
4. Keep the same file name for every release, so the download button keeps working.
5. Put the zip's size in `downloads.windows.size` and set `downloads.windows.available` to `true`.

## Screenshots and gameplay video

`public/media/shots/`, `public/media/gameplay.mp4` and `public/media/tawag.mp4` were captured from the v0.3.0 Windows build (Vs AI) with ffmpeg, with account names blurred. They are not part of `npm run sync`. Recapture them when the game's look changes.

## Releasing a new version

1. Upload the APK and the Windows zip to a new GitHub release, with the same file names.
2. Add a short entry at the top of `Docs/Releases.md` in the game repo.
3. Change `version` and the sizes in `src/config/site.ts`, run `npm run sync`, then commit and push.

## Deploying

On Vercel, choose **Add New → Project**, import this repo and deploy. Astro is detected automatically, and every push to `main` redeploys.

## Where things are

- `src/pages/`: the landing page (`index.astro`), the gallery (`cards.astro`) and the docs (`docs/`).
- `src/components/`: the landing-page sections.
- `src/styles/global.css`: the design tokens. `DESIGN.md` explains them.
- `scripts/`: the sync script and the card parser.
