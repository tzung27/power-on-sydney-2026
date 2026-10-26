(() => {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
  };

  // English blocks: collapsed by default; one top-bar button opens/closes all and is remembered
  const enKey = 'po-syd-en-open';
  let enOpen = store.get(enKey) === '1';
  const applyEn = (root = document) => { $$('details.en', root).forEach((d) => { d.open = enOpen; }); };
  $$('[data-en-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(enOpen));
    b.addEventListener('click', () => {
      enOpen = !enOpen; store.set(enKey, enOpen ? '1' : '0');
      $$('[data-en-toggle]').forEach((x) => x.setAttribute('aria-pressed', String(enOpen)));
      applyEn();
    });
  });
  applyEn();

  // Copy buttons: <button data-copy="elementId">
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const t = document.getElementById(b.dataset.copy);
    if (!t) return;
    const label = b.dataset.label || (b.dataset.label = b.textContent);
    const reset = (ms) => setTimeout(() => { b.textContent = label; }, ms);
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(t);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      b.textContent = '已選取，請按 Ctrl+C'; reset(2200);
    };
    try {
      navigator.clipboard.writeText(t.innerText).then(() => { b.textContent = '已複製'; reset(1500); }, fallback);
    } catch (_) { fallback(); }
  });

  // Checklists with progress, remembered per browser
  $$('[data-checklist]').forEach((list) => {
    const id = list.dataset.checklist;
    const boxes = $$('input[type=checkbox]', list);
    const bar = document.querySelector(`[data-progress-for="${id}"]`);
    const update = () => {
      const n = boxes.filter((b) => b.checked).length;
      if (bar) {
        bar.querySelector('i').style.width = (boxes.length ? (n / boxes.length) * 100 : 0) + '%';
        bar.parentElement.querySelector('.count').textContent = `${n} / ${boxes.length}`;
      }
    };
    boxes.forEach((b) => {
      const key = `po-syd-${id}-${b.id}`;
      if (store.get(key) === '1') b.checked = true;
      b.addEventListener('change', () => { store.set(key, b.checked ? '1' : '0'); update(); });
    });
    update();
  });

  // Slide decks
  $$('[data-deck]').forEach((deck) => {
    const slides = $$('.slide', deck);
    const count = deck.querySelector('.deck-count');
    const notes = deck.querySelector('.deck-notes div');
    let i = 0;
    const show = (n) => {
      i = Math.max(0, Math.min(slides.length - 1, n));
      slides.forEach((s, k) => { s.hidden = k !== i; });
      if (count) count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      const nt = slides[i].querySelector('.notes');
      if (notes) { notes.innerHTML = nt ? nt.innerHTML : '（本頁無講稿）'; applyEn(notes); }
    };
    deck.querySelector('[data-prev]')?.addEventListener('click', () => show(i - 1));
    deck.querySelector('[data-next]')?.addEventListener('click', () => show(i + 1));
    deck.querySelector('[data-full]')?.addEventListener('click', () => {
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else deck.requestFullscreen().catch(() => {});
      } catch (_) {}
    });
    deck.addEventListener('keydown', (e) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); show(i + 1); }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); show(i - 1); }
    });
    show(0);
  });

  // Q&A drills: filter by category, random pick, expand/collapse
  $$('[data-drill]').forEach((drill) => {
    const items = $$('details.qa', drill);
    const visible = () => items.filter((d) => !d.hidden);
    $$('[data-filter]', drill).forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        $$('[data-filter]', drill).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        items.forEach((d) => { d.hidden = cat !== 'all' && d.dataset.cat !== cat; });
      });
    });
    drill.querySelector('[data-random]')?.addEventListener('click', () => {
      const pool = visible();
      if (!pool.length) return;
      items.forEach((d) => { d.open = false; });
      const pick = pool[Math.floor(Math.random() * pool.length)];
      pick.scrollIntoView({ block: 'center', behavior: 'smooth' });
      pick.classList.remove('flash'); void pick.offsetWidth; pick.classList.add('flash');
      pick.querySelector('summary').focus({ preventScroll: true });
    });
    drill.querySelector('[data-open-all]')?.addEventListener('click', () => visible().forEach((d) => { d.open = true; }));
    drill.querySelector('[data-close-all]')?.addEventListener('click', () => items.forEach((d) => { d.open = false; }));
  });

  // Rehearsal timer: <div data-timer> with <li data-at="seconds"> steps
  $$('[data-timer]').forEach((box) => {
    const clock = box.querySelector('.timer-clock');
    const steps = $$('.timer-steps li', box);
    const startBtn = box.querySelector('[data-start]');
    let t = 0, h = null;
    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const paint = () => {
      clock.textContent = fmt(t);
      let cur = -1;
      steps.forEach((li, k) => { if (t >= Number(li.dataset.at)) cur = k; });
      steps.forEach((li, k) => { li.classList.toggle('now', k === cur); li.classList.toggle('done', k < cur); });
    };
    startBtn.addEventListener('click', () => {
      if (h) { clearInterval(h); h = null; startBtn.textContent = '繼續'; }
      else { h = setInterval(() => { t++; paint(); }, 1000); startBtn.textContent = '暫停'; }
    });
    box.querySelector('[data-reset]').addEventListener('click', () => {
      clearInterval(h); h = null; t = 0; startBtn.textContent = '開始計時'; paint();
    });
    paint();
  });

  // Open a <details> named in the hash
  const hash = location.hash.slice(1);
  if (hash) {
    const el = document.getElementById(hash);
    if (el && el.tagName === 'DETAILS') el.open = true;
  }
})();
