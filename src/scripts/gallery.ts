type Card = {
  id: string; name: string; type: string; rarity: string; cost: number | null; atk: number | null; hp: number | null;
  text: string; alay: string | null; lore: string | null; affinity?: string; duration?: number;
  role?: string; passive?: string; active?: string; access?: string; art: string;
};

const RARITY: Record<string, string> = { '★3': 'Common', '★4': 'Rare', '★5': 'Legendary', '✦': 'Divine' };
const TYPE: Record<string, string> = { creature: 'Creature', ritual: 'Ritual', domain: 'Domain', building: 'Building', god: 'Patron god' };

export function initGallery() {
  const root = document.querySelector<HTMLElement>('.gallery');
  if (!root) return;
  const cards: Card[] = JSON.parse(document.getElementById('card-data')!.textContent!);
  const byId = new Map(cards.map((c) => [c.id, c]));
  const grid = root.querySelector<HTMLUListElement>('.grid')!;
  const items = [...grid.children] as HTMLLIElement[];
  const q = root.querySelector<HTMLInputElement>('input[name=q]')!;
  const sortChips = [...root.querySelectorAll<HTMLButtonElement>('[data-sort]')];
  let sortKey = 'id';
  const typeChips = [...root.querySelectorAll<HTMLButtonElement>('.chip[data-type]')];
  const rarityChips = [...root.querySelectorAll<HTMLButtonElement>('.chip[data-rarity]')];
  const count = root.querySelector('[data-count]')!;
  const empty = root.querySelector<HTMLElement>('.empty')!;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let type = '';
  const rarities = new Set<string>();

  const apply = () => {
    const words = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const li of items) {
      const d = li.dataset;
      const ok = (!type || d.type === type) && (!rarities.size || rarities.has(d.rarity!)) && words.every((w) => d.search!.includes(w));
      if (ok && li.hidden && !calm) {
        li.classList.remove('dealt');
        void li.offsetWidth; // restart the deal animation
        li.classList.add('dealt');
      }
      li.hidden = !ok;
      if (ok) shown++;
    }
    const key = sortKey;
    const val = (li: HTMLLIElement) => (key === 'cost' ? Number(li.dataset.cost) : key === 'name' ? li.dataset.name! : Number(li.dataset.order));
    items.slice().sort((a, b) => {
      const x = val(a), y = val(b);
      return typeof x === 'string' ? x.localeCompare(y as string) : (x as number) - (y as number) || Number(a.dataset.order) - Number(b.dataset.order);
    }).forEach((li) => grid.append(li));
    count.textContent = String(shown);
    empty.hidden = shown > 0;
  };

  q.addEventListener('input', apply);
  sortChips.forEach((chip) => chip.addEventListener('click', () => {
    sortKey = chip.dataset.sort!;
    sortChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    apply();
  }));
  typeChips.forEach((chip) => chip.addEventListener('click', () => {
    type = chip.dataset.type!;
    typeChips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    apply();
  }));
  rarityChips.forEach((chip) => chip.addEventListener('click', () => {
    const r = chip.dataset.rarity!;
    rarities.has(r) ? rarities.delete(r) : rarities.add(r);
    chip.setAttribute('aria-pressed', String(rarities.has(r)));
    apply();
  }));
  root.querySelector('.reset')!.addEventListener('click', () => {
    q.value = '';
    type = '';
    rarities.clear();
    typeChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.type === '')));
    rarityChips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    apply();
    q.focus();
  });

  // Tilt toward the pointer, only for precise pointers and full motion.
  if (!calm && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    grid.addEventListener('pointermove', (e) => {
      const img = (e.target as HTMLElement).closest('.tile')?.querySelector('img');
      if (!img) return;
      const r = img.getBoundingClientRect();
      img.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`);
      img.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -16}deg`);
    });
    grid.addEventListener('pointerout', (e) => {
      const img = (e.target as HTMLElement).closest('.tile')?.querySelector<HTMLElement>('img');
      img?.style.removeProperty('--rx');
      img?.style.removeProperty('--ry');
    });
  }

  // Detail dialog; the URL hash keeps the open card so it can be shared.
  const dialog = document.querySelector<HTMLDialogElement>('dialog.detail')!;
  const art = dialog.querySelector<HTMLImageElement>('.d-art')!;
  let opener: HTMLElement | null = null;

  const fill = (c: Card) => {
    art.src = `${c.art}.webp`;
    art.alt = `${c.name} card art`;
    dialog.querySelector('.d-meta')!.textContent = `${TYPE[c.type]} · ${RARITY[c.rarity]}${c.affinity ? ` · ${c.affinity}` : ''}`;
    dialog.querySelector('#d-name')!.textContent = c.name;
    dialog.querySelector('.d-id')!.textContent = c.id;
    const rows: [string, string | number | null | undefined][] = c.type === 'god'
      ? [['Role', c.role], ['Passive', c.passive], ['Active', `${c.active} (3 Charges)`], ['Access', c.access], ['Origin', c.lore]]
      : [['Cost', c.cost != null ? `${c.cost} SP` : null], ['ATK / HP', c.atk != null ? `${c.atk} / ${c.hp}` : c.hp != null ? `HP ${c.hp}` : null],
         ['Lasts', c.duration ? `${c.duration} turns` : null], ['Effect', c.text || null], ['Alay', c.alay], ['Folklore', c.lore]];
    const dl = dialog.querySelector('.d-stats')!;
    dl.replaceChildren(...rows.filter(([, v]) => v != null && v !== '').flatMap(([k, v]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = k;
      dd.textContent = String(v);
      return [dt, dd];
    }));
  };

  const open = (id: string, from?: HTMLElement) => {
    const c = byId.get(id);
    if (!c) return;
    opener = from ?? null;
    fill(c);
    const tileImg = from?.querySelector<HTMLElement>('img');
    const show = () => {
      if (tileImg) tileImg.style.viewTransitionName = '';
      art.style.viewTransitionName = 'card';
      if (!dialog.open) dialog.showModal();
    };
    if (tileImg && !calm && document.startViewTransition) {
      tileImg.style.viewTransitionName = 'card';
      document.startViewTransition(show).finished.finally(() => (art.style.viewTransitionName = ''));
    } else show();
    history.replaceState(null, '', `#${id}`);
  };

  grid.addEventListener('click', (e) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('.tile');
    if (tile) open(tile.dataset.id!, tile);
  });
  dialog.addEventListener('close', () => {
    history.replaceState(null, '', location.pathname);
    opener?.focus();
  });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  if (location.hash) open(decodeURIComponent(location.hash.slice(1)), grid.querySelector<HTMLElement>(`[data-id="${CSS.escape(location.hash.slice(1))}"]`) ?? undefined);
}
