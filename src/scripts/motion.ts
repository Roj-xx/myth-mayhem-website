// Page-wide motion: cursor light, card spotlights, magnetic buttons, parallax, scroll reveals.
// Everything is skipped under reduced motion, and pointer effects only run with a precise pointer.
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

// Low-end devices (few cores, little memory) and Save-Data get the same look without ambient motion.
const isLite = () => {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (n.hardwareConcurrency ?? 8) <= 4 || (n.deviceMemory ?? 8) <= 4 || !!n.connection?.saveData;
};

let pointerBound = false;
let frame = 0;
let mx = 0;
let my = 0;

function onPointer(e: PointerEvent) {
  mx = e.clientX;
  my = e.clientY;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const root = document.documentElement;
    root.style.setProperty('--mx', `${mx}px`);
    root.style.setProperty('--my', `${my}px`);
    // parallax layers that follow the pointer (data-depth = strength in px)
    const cx = mx / innerWidth - 0.5;
    const cy = my / innerHeight - 0.5;
    document.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
      const d = Number(el.dataset.depth);
      el.style.setProperty('--px', `${(-cx * d).toFixed(1)}px`);
      el.style.setProperty('--py', `${(-cy * d).toFixed(1)}px`);
    });
  });
}

function bindPointer() {
  if (pointerBound || calm() || !finePointer() || isLite()) return;
  pointerBound = true;
  document.documentElement.classList.add('has-pointer');
  addEventListener('pointermove', onPointer, { passive: true });

  // spotlight inside glow cards
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.glow-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - r.left}px`);
    card.style.setProperty('--y', `${e.clientY - r.top}px`);
  }, { passive: true });

  // magnetic buttons drift toward the cursor a little
  document.addEventListener('pointermove', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.magnetic');
    document.querySelectorAll<HTMLElement>('.magnetic').forEach((b) => {
      if (b !== btn) { b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); }
    });
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--tx', `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
    btn.style.setProperty('--ty', `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
  }, { passive: true });
}

// scroll parallax (data-scroll = speed, e.g. 0.2 moves at a fifth of scroll speed)
let scrollBound = false;
function bindScroll() {
  if (scrollBound || calm() || isLite()) return;
  scrollBound = true;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    document.querySelectorAll<HTMLElement>('[data-scroll]').forEach((el) => {
      el.style.setProperty('--sy', `${(y * Number(el.dataset.scroll)).toFixed(1)}px`);
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

function reveal() {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
  if (calm() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

// pause videos while they are off screen so they cost nothing
function pauseOffscreen() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    const v = en.target as HTMLVideoElement;
    if (!v.src) return;
    if (en.isIntersecting) v.play().catch(() => {}); else v.pause();
  }), { threshold: 0.1 });
  document.querySelectorAll('video').forEach((v) => io.observe(v));
}

export function initMotion() {
  document.documentElement.classList.add('js');
  if (isLite()) document.documentElement.classList.add('lite');
  pauseOffscreen();
  bindPointer();
  bindScroll();
  reveal();
}
