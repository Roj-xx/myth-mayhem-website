import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCards, findArt } from './cards.mjs';

const GAME = process.env.MM_GAME_DIR ?? 'C:/Dev/Myth Mayhem';
const cards = parseCards(readFileSync(join(GAME, 'Docs/Cards.md'), 'utf8'));
const byName = (n) => cards.find((c) => c.name === n);

test('counts', () => {
  const count = (t) => cards.filter((c) => c.type === t).length;
  assert.deepEqual(
    ['creature', 'ritual', 'domain', 'building', 'god'].map(count),
    [24, 8, 9, 3, 11],
  );
  assert.equal(cards.length, 55);
  assert.equal(new Set(cards.map((c) => c.id)).size, 55);
  const [a] = cards;
  assert.deepEqual([a.id, a.name, a.atk, a.hp], ['MM-CORE-001', 'Aswang', 6, 3]);
  assert.equal(cards.at(-1).id, 'MM-GOD-011');
});

test('parses names and dashes', () => {
  assert.ok(byName('Usog'));
  assert.equal(byName('Aswang').alay, null);
  assert.ok(byName('Sulad'));
  const god = cards.find((c) => c.id === 'MM-GOD-001');
  assert.deepEqual([god.name, god.role, god.rarity, god.cost], ['Adlaw', 'Offense', '✦', null]);
  const bantayog = byName('Bantayog');
  assert.deepEqual([bantayog.hp, bantayog.duration, bantayog.atk], [15, 3, null]);
  assert.equal(byName('Intramuros').affinity, 'Human');
});

test('strips markdown', () => {
  for (const c of cards)
    for (const v of Object.values(c))
      if (typeof v === 'string') assert.doesNotMatch(v, /\*\*|\*\(/, `${c.id}: ${v}`);
});

test('missing art falls back', () => {
  const files = ['Creature Cards/Aswang.png', 'Creature Cards/Nuno sa Punso.png'];
  assert.equal(findArt('aswang', files), 'Creature Cards/Aswang.png');
  assert.equal(findArt('Nuno sa Punso', files), 'Creature Cards/Nuno sa Punso.png');
  assert.equal(findArt('Nobody', files), null);
});
