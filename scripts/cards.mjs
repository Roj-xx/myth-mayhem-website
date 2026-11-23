// Parses the Set v1 tables in the game's Docs/Cards.md into card records.
// IDs follow table order, per the "Card IDs" ranges in Cards.md.

const SECTIONS = [
  { heading: /^## 3\. Creatures/, type: 'creature', prefix: 'MM-CORE-', start: 1,
    cols: ['n', 'name', 'rarity', 'cost', 'atkhp', 'text', 'alay', 'lore'] },
  { heading: /^## 4\. Rituals/, type: 'ritual', prefix: 'MM-CORE-', start: 25,
    cols: ['n', 'name', 'rarity', 'cost', 'text', 'alay'] },
  { heading: /^### 5\.2 Domain list/, type: 'domain', prefix: 'MM-CORE-', start: 33,
    cols: ['n', 'name', 'affinity', 'rarity', 'cost', 'duration', 'text', 'alay'] },
  { heading: /^## 6\. Buildings/, type: 'building', prefix: 'MM-CORE-', start: 42,
    cols: ['n', 'name', 'rarity', 'cost', 'hp', 'duration', 'text'] },
  { heading: /^## 7\. Patron Gods/, type: 'god', prefix: 'MM-GOD-', start: 1,
    cols: ['n', 'name', 'lore', 'role', 'passive', 'active', 'access'] },
];

const plain = (s) => s.replace(/\*+/g, '').replace(/\s+/g, ' ').trim();
const orNull = (s) => (s === '—' || s === '' ? null : s);
const num = (s) => (s == null || !/^\d+$/.test(s) ? null : Number(s));

function rowsAfter(lines, heading) {
  const i = lines.findIndex((l) => heading.test(l));
  if (i < 0) throw new Error(`Cards.md: heading not found: ${heading}`);
  const rows = [];
  for (const line of lines.slice(i + 1)) {
    if (/^#{1,3} /.test(line)) break;
    if (/^\| \d+ \|/.test(line)) rows.push(line.split('|').slice(1, -1).map((c) => c.trim()));
  }
  return rows;
}

export function parseCards(md) {
  const lines = md.split(/\r?\n/);
  return SECTIONS.flatMap(({ heading, type, prefix, start, cols }) =>
    rowsAfter(lines, heading).map((cells, i) => {
      const raw = Object.fromEntries(cols.map((k, j) => [k, cells[j] ?? '']));
      const name = (raw.name.match(/\*\*(.+?)\*\*/)?.[1] ?? raw.name).trim();
      const v = Object.fromEntries(Object.entries(raw).map(([k, s]) => [k, orNull(plain(s))]));
      const [atk, hp] = (v.atkhp ?? '').split('/').map(num);
      const card = {
        id: prefix + String(start + i).padStart(3, '0'),
        name,
        type,
        rarity: type === 'god' ? '✦' : v.rarity,
        cost: num(v.cost),
        atk: atk ?? null,
        hp: hp ?? num(v.hp),
        text: v.text ?? v.passive ?? '',
        alay: v.alay ?? null,
        lore: v.lore ?? null,
      };
      if (v.affinity) card.affinity = v.affinity;
      if (v.duration) card.duration = num(v.duration);
      if (type === 'god') Object.assign(card, { role: v.role, passive: v.passive, active: v.active, access: v.access });
      return card;
    }),
  );
}

// Art files are named after the card's display name (case-insensitive).
export function findArt(name, files) {
  const want = name.toLowerCase();
  return files.find((f) => f.toLowerCase().replace(/\.png$/, '').split('/').pop() === want) ?? null;
}
