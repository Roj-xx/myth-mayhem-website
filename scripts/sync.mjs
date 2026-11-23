// npm run sync — copies docs, card data, art and trailer from the game repo.
// Read-only on the game repo. Set MM_GAME_DIR to override its location.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parseCards, findArt } from './cards.mjs';

const GAME = process.env.MM_GAME_DIR ?? 'C:/Dev/Myth Mayhem';
const OUT = fileURLToPath(new URL('..', import.meta.url));
const MEDIA = join(OUT, 'public/media');
const ART = join(GAME, 'Assets/Art');

const need = (p) => {
  if (!existsSync(p)) throw new Error(`Missing in game repo: ${p}\n(set MM_GAME_DIR if the game lives elsewhere)`);
  return p;
};
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.png') ? [p] : [];
  });

// Docs: published docs link to each other's routes; links to unpublished files become plain text.
const DOCS = { 'GDD.md': 'gdd', 'Roadmap.md': 'roadmap', 'UserManual.md': 'manual' };
function syncDoc(file, route) {
  let md = readFileSync(need(join(GAME, 'Docs', file)), 'utf8').replace(/\r\n/g, '\n');
  md = md.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, text, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all;
    const [path, hash] = href.split('#');
    const target = DOCS[path.split('/').pop()];
    return target ? `[${text}](/docs/${target}${hash ? '#' + hash : ''})` : text;
  });
  const title = md.match(/^# (.+)$/m)?.[1] ?? route;
  md = md.replace(/^# .+\n/m, '');
  writeFileSync(join(OUT, 'src/content/docs', `${route}.md`), `---\ntitle: ${JSON.stringify(title)}\n---\n${md}`);
}

async function img(src, outBase, width) {
  const s = sharp(src, { limitInputPixels: false }).resize({ width, withoutEnlargement: true });
  await Promise.all([
    s.clone().avif({ quality: 50, effort: 4 }).toFile(`${outBase}.avif`),
    s.clone().webp({ quality: 78 }).toFile(`${outBase}.webp`),
  ]);
}

async function main() {
  need(GAME);
  for (const d of ['src/content/docs', 'src/data', 'public/media/cards', 'public/media/avatars'])
    mkdirSync(join(OUT, d), { recursive: true });

  for (const [file, route] of Object.entries(DOCS)) syncDoc(file, route);

  const cards = parseCards(readFileSync(need(join(GAME, 'Docs/Cards.md')), 'utf8'));
  const cardDir = need(join(ART, 'Cards'));
  const files = walk(cardDir).map((p) => relative(cardDir, p).replace(/\\/g, '/'));
  const missing = [];
  for (const c of cards) {
    const found = findArt(c.name, files);
    if (!found) missing.push(c.name);
    const src = found ? join(cardDir, found) : need(join(cardDir, 'BackCard.png'));
    await img(src, join(MEDIA, 'cards', c.id), 480);
    c.art = `/media/cards/${c.id}`;
  }
  writeFileSync(join(OUT, 'src/data/cards.json'), JSON.stringify(cards, null, 2) + '\n');

  const avatars = readdirSync(need(join(ART, 'Avatars'))).filter((f) => f.endsWith('.png'));
  for (const f of avatars) await img(join(ART, 'Avatars', f), join(MEDIA, 'avatars', slug(f.slice(0, -4))), 640);

  const hero = need(join(ART, 'Backgrounds/Hero.png'));
  for (const w of [1600, 2560]) await img(hero, join(MEDIA, `hero-${w}`), w);
  await img(need(join(ART, 'Branding/LogoGold.png')), join(MEDIA, 'logo'), 900);
  const icon = need(join(ART, 'Branding/AppIcon.png'));
  await sharp(icon).resize(512).png().toFile(join(MEDIA, 'icon-512.png'));
  await sharp(icon).resize(64).png().toFile(join(OUT, 'public/favicon.png'));
  copyFileSync(need(join(ART, 'Backgrounds/Splash Video H264.mp4')), join(MEDIA, 'trailer.mp4'));

  const per = Object.groupBy(cards, (c) => c.type);
  console.log(`Docs: ${Object.values(DOCS).join(', ')}`);
  console.log(`Cards: ${cards.length} (${Object.entries(per).map(([t, l]) => `${t} ${l.length}`).join(', ')})`);
  console.log(`Avatars: ${avatars.length} · hero, logo, icon, trailer copied`);
  console.log(missing.length ? `Missing art (card back used): ${missing.join(', ')}` : 'Missing art: none');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
