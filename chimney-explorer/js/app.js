/* Chimney Explorer — application logic (vanilla JS, no build step). */
(function () {
  'use strict';
  const { TYPES, PARTS, SETTINGS } = window.CX_CONTENT;
  const SCENES = window.CX_SCENES;

  /* ================= icons ================= */
  const I = {
    flame: '<svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#e8622c"/><path d="M16 6c1 4 6 6.5 6 12a6 6 0 0 1-12 0c0-3 1.6-4.6 2.8-6 .2 2 1 3 2.2 3.4C14.6 12.5 15.2 9 16 6z" fill="#fff"/></svg>',
    left: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    unlock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.6-1.7"/></svg>',
    plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>',
    down: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    photo: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>',
    play: '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#1d1d1f"/></svg>',
    edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    move: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>',
    tag: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h.01M3 12V3h9l9 9-9 9z"/></svg>',
    lr: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg>',
    phone: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    label: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h10M4 17h7"/></svg>',
    gear: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
  };

  /* ================= storage (IndexedDB with in-memory fallback) ================= */
  const DB_NAME = 'chimney-explorer', DB_VER = 1;
  let db = null; const memKV = new Map(); const memMedia = new Map(); let memId = 1;
  function openDB() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VER);
        req.onupgradeneeded = () => {
          const d = req.result;
          if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv');
          if (!d.objectStoreNames.contains('media')) d.createObjectStore('media', { keyPath: 'id', autoIncrement: true }).createIndex('part', 'part');
        };
        req.onsuccess = () => { db = req.result; resolve(true); };
        req.onerror = () => resolve(false);
        req.onblocked = () => resolve(false);
      } catch (e) { resolve(false); }
    });
  }
  function tx(store, mode, fn) {
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode); const s = t.objectStore(store);
      let out; const r = fn(s); if (r) r.onsuccess = () => { out = r.result; };
      t.oncomplete = () => resolve(out); t.onerror = () => reject(t.error); t.onabort = () => reject(t.error);
    });
  }
  const store = {
    async allKV() {
      if (!db) return new Map(memKV);
      const keys = await tx('kv', 'readonly', (s) => s.getAllKeys());
      const vals = await tx('kv', 'readonly', (s) => s.getAll());
      const m = new Map(); keys.forEach((k, i) => m.set(k, vals[i])); return m;
    },
    async set(k, v) { cache.set(k, v); if (!db) { memKV.set(k, v); return; } await tx('kv', 'readwrite', (s) => s.put(v, k)); },
    async del(k) { cache.delete(k); if (!db) { memKV.delete(k); return; } await tx('kv', 'readwrite', (s) => s.delete(k)); },
    async media(part) {
      let list;
      if (!db) list = [...memMedia.values()].filter((m) => m.part === part);
      else list = await tx('media', 'readonly', (s) => s.index('part').getAll(part));
      return list.sort((a, b) => (a.order - b.order) || (a.id - b.id));
    },
    async allMedia() { if (!db) return [...memMedia.values()]; return tx('media', 'readonly', (s) => s.getAll()); },
    async putMedia(m) {
      if (!db) { if (!m.id) m.id = memId++; memMedia.set(m.id, m); return m.id; }
      return tx('media', 'readwrite', (s) => s.put(m));
    },
    async delMedia(id) { if (!db) { memMedia.delete(id); return; } await tx('media', 'readwrite', (s) => s.delete(id)); },
    async clearAll() { cache.clear(); if (!db) { memKV.clear(); memMedia.clear(); return; } await tx('kv', 'readwrite', (s) => s.clear()); await tx('media', 'readwrite', (s) => s.clear()); }
  };
  let cache = new Map();

  /* ================= state + content accessors ================= */
  const state = { screen: 'home', type: null, style: 'real', owner: false, labels: true, part: null, moving: false, galMode: 'side', media: [] };
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paras = (t) => String(t || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');

  const settings = () => Object.assign({}, SETTINGS, cache.get('settings') || {});
  const part = (id) => Object.assign({}, PARTS[id], (cache.get('parts') || {})[id] || {});
  const typeInfo = (id) => { const t = TYPES.find((x) => x.id === id); const o = (cache.get('types') || {})[id] || {}; return Object.assign({}, t, o); };
  const hotspotKey = (type, style) => `hotspots:${type}:${style}`;
  const bgKey = (type, style) => `bg:${type}:${style}`;
  function prefs() { return cache.get('prefs') || {}; }
  function savePrefs(p) { store.set('prefs', Object.assign({}, prefs(), p)).catch(() => {}); }

  /* ================= toast + modal helpers ================= */
  let toastT;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400); }
  function modal(html, onMount) {
    const m = $('#modal');
    m.innerHTML = `<div class="bg" data-close></div><div class="box" role="dialog" aria-modal="true">${html}</div>`;
    m.classList.add('show');
    m.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
    if (onMount) onMount(m.querySelector('.box'));
    const first = m.querySelector('input, textarea'); if (first) setTimeout(() => first.focus(), 60);
  }
  function closeModal() { const m = $('#modal'); m.classList.remove('show'); setTimeout(() => { if (!m.classList.contains('show')) m.innerHTML = ''; }, 300); }
  function confirmBox(title, text, okLabel, danger) {
    return new Promise((resolve) => {
      modal(`<h2>${esc(title)}</h2><p class="lead">${esc(text)}</p><div class="actions"><button class="btn" data-no>Cancel</button><button class="btn ${danger ? 'danger' : 'primary'}" data-yes>${esc(okLabel)}</button></div>`, (box) => {
        box.querySelector('[data-yes]').onclick = () => { closeModal(); resolve(true); };
        box.querySelector('[data-no]').onclick = () => { closeModal(); resolve(false); };
        $('#modal .bg').onclick = () => { closeModal(); resolve(false); };
      });
    });
  }

  /* ================= top bar ================= */
  function renderTop() {
    const s = settings();
    $('#brandName').textContent = s.business;
    document.title = s.business === SETTINGS.business ? 'Chimney Explorer' : s.business;
    $('#backBtn').hidden = state.screen === 'home';
    $('#brand').classList.toggle('hide-sm', state.screen !== 'home');
    const ob = $('#ownerBtn');
    ob.innerHTML = state.owner ? I.unlock : I.lock;
    ob.classList.toggle('on', state.owner);
    ob.setAttribute('aria-label', state.owner ? 'Leave owner mode' : 'Owner mode');
    ob.title = state.owner ? 'Leave owner mode' : 'Owner mode';
    $('#ownerBar').hidden = !state.owner;
    document.body.classList.toggle('owner', state.owner);
    syncSeg($('#styleSeg'), state.style);
  }
  function syncSeg(seg, val) {
    const btns = [...seg.querySelectorAll('button')];
    let pill = seg.querySelector('.pill'); if (!pill) { pill = document.createElement('span'); pill.className = 'pill'; seg.prepend(pill); }
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === val)));
    const on = btns.find((b) => b.dataset.v === val);
    if (on) requestAnimationFrame(() => { pill.style.left = on.offsetLeft + 'px'; pill.style.width = on.offsetWidth + 'px'; });
  }

  /* ================= home ================= */
  function renderHome() {
    const s = settings();
    const cards = TYPES.map((t) => {
      const ti = typeInfo(t.id);
      return `<button class="card" data-type="${t.id}">
        <div class="thumb">${thumbArt(t.id)}</div>
        <div class="body"><h2>${esc(ti.name)}</h2><p>${esc(ti.desc)}</p><span class="go">Explore ${I.right}</span></div>
      </button>`;
    }).join('');
    $('#home').innerHTML = `<div class="home-inner">
      <div class="eyebrow">${esc(s.business)}</div>
      <h1>${esc(s.homeTitle)}</h1>
      <p class="sub">${esc(s.homeSub)}</p>
      <div class="cards">${cards}</div>
      <div class="home-foot">${s.phone ? `<span>${I.phone}</span><a class="cta" style="height:38px" href="tel:${esc(s.phone.replace(/[^+\d]/g, ''))}">${esc(s.phone)}</a>` : ''}</div>
    </div>`;
    $('#home').querySelectorAll('.card').forEach((b) => b.addEventListener('click', () => openType(b.dataset.type)));
  }
  function thumbArt(type) {
    const bg = cache.get(bgKey(type, state.style));
    if (bg && bg.url) return `<img src="${bg.url}" alt="">`;
    const sc = SCENES.render(type, state.style);
    // frame the most recognisable part of each scene
    const vb = { masonry: '60 560 480 400', wood: '150 360 440 380', insert: '70 320 460 420' }[type];
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${sc.svg}</svg>`;
  }

  /* ================= explorer ================= */
  let scene = null, sceneSize = { W: 600, H: 1000 };
  function openType(type) {
    state.type = type; state.part = null; state.moving = false;
    go('explorer');
    renderExplorer(true);
  }
  function currentParts() { return TYPES.find((t) => t.id === state.type).parts; }
  function hotspots() {
    const defs = {}; currentParts().forEach((p) => { defs[p.id] = [p.x / sceneSize.W, p.y / sceneSize.H]; });
    const saved = cache.get(hotspotKey(state.type, state.style)) || {};
    return Object.assign(defs, saved);
  }

  function renderExplorer(intro) {
    const ti = typeInfo(state.type);
    const bg = cache.get(bgKey(state.type, state.style));
    $('#exEyebrow').textContent = ti.name;
    $('#exTitle').textContent = 'Tap any part to explore';
    // owner tools
    const tools = $('#exTools');
    tools.innerHTML = `<button class="chip-btn ${state.labels ? 'on' : ''}" id="labelsBtn" aria-pressed="${state.labels}">${I.label} Labels</button>` +
      (state.owner ? `<button class="chip-btn ${state.moving ? 'on' : ''}" id="moveBtn">${I.move} ${state.moving ? 'Done moving' : 'Move hotspots'}</button>
        <button class="chip-btn" id="bgBtn">${I.photo} ${bg ? 'Change image' : 'Use my own image'}</button>
        ${bg ? '<button class="chip-btn" id="bgReset">Restore drawing</button>' : ''}` : '');
    $('#labelsBtn').onclick = () => { state.labels = !state.labels; savePrefs({ labels: state.labels }); renderExplorer(); };
    if (state.owner) {
      $('#moveBtn').onclick = () => { state.moving = !state.moving; if (state.moving) toast('Drag the dots to line them up. Changes save automatically.'); renderExplorer(); };
      $('#bgBtn').onclick = () => pickFile('image/*', false, (files) => setBackground(files[0]));
      const r = $('#bgReset'); if (r) r.onclick = async () => { if (await confirmBox('Restore the drawing?', 'Your uploaded image for this view will be removed. Hotspot positions you set are kept.', 'Restore')) { await store.del(bgKey(state.type, state.style)); renderExplorer(); renderHome(); } };
    }

    const art = $('#art');
    if (bg && bg.url) {
      sceneSize = { W: bg.w, H: bg.h }; scene = null;
      art.innerHTML = `<img src="${bg.url}" alt="${esc(ti.name)}">`;
    } else {
      scene = SCENES.render(state.type, state.style);
      sceneSize = { W: scene.W, H: scene.H };
      const hits = currentParts().map((p) => { const h = scene.hits[p.id]; return h ? `<path class="hit" data-part="${p.id}" d="${h.d}" fill-rule="${h.rule || 'nonzero'}"><title>${esc(part(p.id).name)}</title></path>` : ''; }).join('');
      art.innerHTML = `<svg viewBox="0 0 ${scene.W} ${scene.H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(ti.name)} diagram">${scene.svg}<g class="hits">${hits}</g></svg>`;
    }
    // hotspots
    const hs = hotspots();
    $('#hotspots').innerHTML = currentParts().map((p) => {
      const pos = hs[p.id]; const nm = part(p.id).name;
      const side = pos[0] > 0.8 ? 'l' : pos[0] < 0.2 ? 'r' : p.side;
      return `<button class="hs" data-part="${p.id}" style="left:${pos[0] * 100}%;top:${pos[1] * 100}%" aria-label="${esc(nm)}"><span class="dot"></span><span class="lbl ${side}">${esc(nm)}</span></button>`;
    }).join('');
    const stage = $('#stage');
    stage.classList.toggle('no-labels', !state.labels);
    stage.classList.toggle('moving', state.moving);
    // chips
    $('#chips').innerHTML = currentParts().map((p) => `<button data-part="${p.id}">${esc(part(p.id).name)}</button>`).join('');
    fitStage();
    markActive();
    if (intro && !scene) intro = false;
    if (intro) {
      const hitsEls = [...document.querySelectorAll('#art .hit')];
      hitsEls.forEach((h, i) => setTimeout(() => { h.classList.add('intro'); setTimeout(() => h.classList.remove('intro'), 1150); }, 350 + i * 110));
    }
  }

  function fitStage() {
    const wrap = $('#stageWrap'), stage = $('#stage');
    if (!wrap || state.screen !== 'explorer') return;
    const r = wrap.getBoundingClientRect();
    const pad = window.innerWidth < 560 ? 16 : 32;
    const ar = sceneSize.W / sceneSize.H;
    let w = r.width - pad * 2, h = r.height - 8;
    if (w <= 0 || h <= 0) return;
    if (w / h > ar) w = h * ar; else h = w / ar;
    stage.style.width = Math.floor(w) + 'px'; stage.style.height = Math.floor(h) + 'px';
  }

  function markActive() {
    document.querySelectorAll('#stage [data-part], #chips [data-part]').forEach((el) => el.classList.toggle('on', el.dataset.part === state.part));
    const chip = $(`#chips [data-part="${state.part}"]`);
    if (chip) chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  async function setBackground(file) {
    if (!file) return;
    try {
      const blob = await shrinkImage(file, 2600);
      const url = URL.createObjectURL(blob);
      const dim = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = rej; im.src = url; });
      await store.set(bgKey(state.type, state.style), { blob, w: dim.w, h: dim.h });
      cache.get(bgKey(state.type, state.style)).url = url;
      state.moving = true;
      renderExplorer(); renderHome();
      toast('Image saved. Now drag each dot onto its part.');
    } catch (e) { toast('That image could not be opened. Try a JPG or PNG.'); }
  }

  /* hotspot dragging (owner) */
  let drag = null;
  function onHsDown(e) {
    const b = e.target.closest('.hs'); if (!b || !state.moving) return;
    e.preventDefault(); b.setPointerCapture(e.pointerId);
    drag = { b, id: b.dataset.part, rect: $('#stage').getBoundingClientRect() };
  }
  function onHsMove(e) {
    if (!drag) return;
    const x = Math.min(1, Math.max(0, (e.clientX - drag.rect.left) / drag.rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - drag.rect.top) / drag.rect.height));
    drag.b.style.left = x * 100 + '%'; drag.b.style.top = y * 100 + '%'; drag.pos = [x, y];
  }
  async function onHsUp() {
    if (!drag) return; const d = drag; drag = null;
    if (!d.pos) return;
    const k = hotspotKey(state.type, state.style);
    const saved = Object.assign({}, cache.get(k) || {}); saved[d.id] = [Math.round(d.pos[0] * 10000) / 10000, Math.round(d.pos[1] * 10000) / 10000];
    await store.set(k, saved);
  }

  /* ================= part sheet ================= */
  async function openPart(id) {
    if (state.moving) return;
    state.part = id; markActive();
    state.media = await store.media(id);
    renderSheet();
    $('#sheet').classList.add('show'); $('#scrim').classList.add('show');
    $('#explorer').classList.add('panel-open');
    $('#sheetScroll').scrollTop = 0;
    setTimeout(fitStage, 520);
  }
  function closePart() {
    state.part = null; markActive();
    $('#sheet').classList.remove('show'); $('#scrim').classList.remove('show');
    $('#explorer').classList.remove('panel-open');
    $('#sheet').style.transform = '';
    setTimeout(fitStage, 520);
  }
  function renderSheet() {
    const id = state.part; if (!id) return;
    const p = part(id); const s = settings();
    const list = currentParts(); const idx = list.findIndex((x) => x.id === id);
    const prev = list[(idx - 1 + list.length) % list.length], next = list[(idx + 1) % list.length];
    const probs = (p.problems || []).filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join('');
    $('#sheetScroll').innerHTML = `
      <div class="top"><span class="eyebrow">Part ${idx + 1} of ${list.length}</span><button class="close" id="sheetClose" aria-label="Close">${I.close}</button></div>
      <h2 id="sheetTitle">${esc(p.name)}</h2>
      ${p.tagline ? `<p class="tagline">${esc(p.tagline)}</p>` : ''}
      ${state.owner ? `<div class="owner-row"><button class="chip-btn dark" id="editText">${I.edit} Edit text</button></div>` : ''}
      <section class="sec"><h3>What it is</h3>${paras(p.what)}</section>
      ${probs ? `<section class="sec"><h3>Common problems</h3><ul class="problems">${probs}</ul></section>` : ''}
      <section class="sec service"><h3>What we do</h3>${paras(p.service)}
        ${s.phone ? `<a class="cta" href="tel:${esc(s.phone.replace(/[^+\d]/g, ''))}">${I.phone} Call ${esc(s.phone)}</a>` : ''}</section>
      <section class="sec" id="gallery">${galleryHTML()}</section>
      <div class="sheet-nav"><button id="prevPart">${I.left}<span>${esc(part(prev.id).name)}</span></button><button id="nextPart"><span>${esc(part(next.id).name)}</span>${I.right}</button></div>`;
    $('#sheetClose').onclick = closePart;
    $('#prevPart').onclick = () => openPart(prev.id);
    $('#nextPart').onclick = () => openPart(next.id);
    const et = $('#editText'); if (et) et.onclick = () => editPartText(id);
    bindGallery();
  }

  /* ================= gallery ================= */
  const urlCache = new Map();
  function mediaURL(m) { if (!urlCache.has(m.id)) urlCache.set(m.id, URL.createObjectURL(m.blob)); return urlCache.get(m.id); }
  function mediaTile(m, extra) {
    const u = mediaURL(m); const isV = m.kind === 'video';
    return `<button class="media" data-open="${m.id}" aria-label="Open ${esc(m.label)} ${isV ? 'video' : 'photo'}">
      ${isV ? `<video src="${u}#t=0.1" muted playsinline preload="metadata"></video><span class="play"><i>${I.play}</i></span>` : `<img src="${u}" alt="${esc(m.caption || m.label)}" loading="lazy">`}
      ${extra === false ? '' : `<span class="tag ${m.label}">${m.label === 'after' ? 'After' : 'Before'}</span>`}</button>`;
  }
  function pairsOf(list) {
    const b = list.filter((m) => m.label !== 'after'), a = list.filter((m) => m.label === 'after');
    const n = Math.min(b.length, a.length); const pairs = [];
    for (let i = 0; i < n; i++) pairs.push([b[i], a[i]]);
    return { pairs, singles: b.slice(n).concat(a.slice(n)) };
  }
  function galleryHTML() {
    const list = state.media;
    if (state.owner) return ownerGalleryHTML(list);
    if (!list.length) {
      return `<div class="gal-head"><h3>Before &amp; After</h3></div>
        <div class="empty"><div class="ic">${I.photo}</div><b>No examples yet</b><span>Photos and videos from real jobs will appear here.</span></div>`;
    }
    const { pairs, singles } = pairsOf(list);
    const canSlide = pairs.some(([b, a]) => b.kind === 'image' && a.kind === 'image');
    const mode = canSlide ? state.galMode : 'side';
    let h = `<div class="gal-head"><h3>Before &amp; After</h3>${canSlide ? `<div class="seg sm" id="galSeg"><button data-v="side">Side by side</button><button data-v="slider">Slider</button></div>` : ''}</div>`;
    if (pairs.length) {
      h += '<div class="pairs">' + pairs.map(([b, a]) => {
        const cap = [b.caption, a.caption].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).join(' · ');
        if (mode === 'slider' && b.kind === 'image' && a.kind === 'image') {
          return `<div class="pair"><div class="ba" style="--pos:50%"><img src="${mediaURL(a)}" alt="After"><img class="b" src="${mediaURL(b)}" alt="Before"><span class="tag">Before</span><span class="tag after">After</span><span class="bar"></span><span class="knob">${I.lr}</span><input type="range" min="0" max="100" value="50" aria-label="Compare before and after"></div>${cap ? `<div class="caption">${esc(cap)}</div>` : ''}</div>`;
        }
        return `<div class="pair"><div class="cols">${mediaTile(b)}${mediaTile(a)}</div>${cap ? `<div class="caption">${esc(cap)}</div>` : ''}</div>`;
      }).join('') + '</div>';
    }
    if (singles.length) h += `<div class="singles">${singles.map((m) => `<div>${mediaTile(m)}${m.caption ? `<div class="caption">${esc(m.caption)}</div>` : ''}</div>`).join('')}</div>`;
    return h;
  }
  function ownerGalleryHTML(list) {
    const items = list.map((m, i) => `<div class="ed-item" data-id="${m.id}">
      ${mediaTile(m)}
      <div class="fields">
        <div class="row"><div class="seg sm" data-labelseg="${m.id}"><button data-v="before">Before</button><button data-v="after">After</button></div>
          <span style="flex:1"></span>
          <button class="mini" data-up="${m.id}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">${I.up}</button>
          <button class="mini" data-down="${m.id}" ${i === list.length - 1 ? 'disabled' : ''} aria-label="Move down">${I.down}</button>
          <button class="mini danger" data-del="${m.id}" aria-label="Delete">${I.trash}</button></div>
        <input type="text" id="cap-${m.id}" data-cap="${m.id}" value="${esc(m.caption || '')}" placeholder="Add a caption, e.g. Crown rebuilt, Oak Street">
      </div></div>`).join('');
    return `<div class="gal-head"><h3>Before &amp; After</h3><span class="hint" style="margin:0">${list.length} item${list.length === 1 ? '' : 's'}</span></div>
      ${list.length ? `<div class="ed-list">${items}</div>` : `<div class="empty"><div class="ic">${I.photo}</div><b>No examples yet</b><span>Add photos or videos from your own jobs.</span></div>`}
      <div class="add-row"><button class="add-btn" data-add="before">${I.plus} Add Before</button><button class="add-btn" data-add="after">${I.plus} Add After</button></div>
      <p class="hint">Before and After items are paired in order: the first Before goes with the first After. Clients see them side by side or with a slider.</p>`;
  }
  function bindGallery() {
    const g = $('#gallery'); if (!g) return;
    const seg = $('#galSeg');
    if (seg) { syncSeg(seg, state.galMode); seg.onclick = (e) => { const b = e.target.closest('button'); if (!b) return; state.galMode = b.dataset.v; savePrefs({ galMode: state.galMode }); refreshGallery(); }; }
    g.querySelectorAll('.ba input').forEach((inp) => { inp.oninput = () => inp.parentElement.style.setProperty('--pos', inp.value + '%'); });
    g.querySelectorAll('[data-open]').forEach((b) => b.onclick = () => openLightbox(+b.dataset.open));
    if (!state.owner) return;
    g.querySelectorAll('[data-labelseg]').forEach((sg) => {
      const m = state.media.find((x) => x.id === +sg.dataset.labelseg);
      syncSeg(sg, m.label);
      sg.onclick = async (e) => { const b = e.target.closest('button'); if (!b) return; m.label = b.dataset.v; await store.putMedia(m); syncSeg(sg, m.label); const tg = sg.closest('.ed-item').querySelector('.tag'); tg.className = 'tag ' + m.label; tg.textContent = m.label === 'after' ? 'After' : 'Before'; };
    });
    g.querySelectorAll('[data-cap]').forEach((inp) => {
      inp.onchange = async () => { const m = state.media.find((x) => x.id === +inp.dataset.cap); m.caption = inp.value.trim(); await store.putMedia(m); toast('Caption saved'); };
    });
    g.querySelectorAll('[data-del]').forEach((b) => b.onclick = async () => {
      if (!(await confirmBox('Delete this item?', 'It will be removed from this gallery on this device.', 'Delete', true))) return;
      const id = +b.dataset.del; await store.delMedia(id);
      if (urlCache.has(id)) { URL.revokeObjectURL(urlCache.get(id)); urlCache.delete(id); }
      state.media = state.media.filter((m) => m.id !== id); await renumber(); refreshGallery(); toast('Deleted');
    });
    const move = async (id, dir) => {
      const i = state.media.findIndex((m) => m.id === id); const j = i + dir; if (j < 0 || j >= state.media.length) return;
      [state.media[i], state.media[j]] = [state.media[j], state.media[i]]; await renumber(); refreshGallery();
    };
    g.querySelectorAll('[data-up]').forEach((b) => b.onclick = () => move(+b.dataset.up, -1));
    g.querySelectorAll('[data-down]').forEach((b) => b.onclick = () => move(+b.dataset.down, 1));
    g.querySelectorAll('[data-add]').forEach((b) => b.onclick = () => pickFile('image/*,video/*', true, (files) => addMedia(files, b.dataset.add)));
  }
  async function renumber() { for (let i = 0; i < state.media.length; i++) { if (state.media[i].order !== i) { state.media[i].order = i; await store.putMedia(state.media[i]); } } }
  function refreshGallery() { const g = $('#gallery'); if (g) { g.innerHTML = galleryHTML(); bindGallery(); } }

  async function addMedia(files, label) {
    if (!files || !files.length) return;
    toast(files.length > 1 ? `Adding ${files.length} items…` : 'Adding…');
    let added = 0;
    for (const file of files) {
      const isV = file.type.startsWith('video/'); const isI = file.type.startsWith('image/');
      if (!isV && !isI) continue;
      try {
        const blob = isI ? await shrinkImage(file, 2200) : file;
        const m = { part: state.part, label, caption: '', kind: isV ? 'video' : 'image', mime: blob.type || file.type, blob, order: state.media.length, created: Date.now() };
        m.id = await store.putMedia(m); state.media.push(m); added++;
      } catch (e) { toast('Could not save ' + file.name + '. The device may be out of storage.'); }
    }
    refreshGallery();
    if (added) toast(`${added} ${label === 'after' ? 'After' : 'Before'} item${added > 1 ? 's' : ''} added`);
  }
  function pickFile(accept, multiple, cb) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = accept; inp.multiple = !!multiple;
    inp.style.display = 'none'; document.body.appendChild(inp);
    inp.onchange = () => { cb([...inp.files]); inp.remove(); };
    inp.click();
  }
  async function shrinkImage(file, max) {
    if (!/^image\/(jpeg|png|webp|heic|heif)/.test(file.type)) return file;
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
      if (s === 1 && file.size < 1.8e6) return file;
      const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width * s); cv.height = Math.round(bmp.height * s);
      cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
      const out = await new Promise((r) => cv.toBlob(r, 'image/jpeg', 0.86));
      return out || file;
    } catch (e) { return file; }
  }

  /* lightbox */
  let lbIndex = 0;
  function openLightbox(id) { lbIndex = state.media.findIndex((m) => m.id === id); if (lbIndex < 0) return; renderLightbox(); $('#lightbox').classList.add('show'); }
  function renderLightbox() {
    const m = state.media[lbIndex]; const u = mediaURL(m); const many = state.media.length > 1;
    $('#lightbox').innerHTML = `<div class="lb-top"><span class="tag" style="position:static" >${m.label === 'after' ? 'After' : 'Before'} · ${lbIndex + 1} of ${state.media.length}</span><button class="icon-btn" id="lbClose" aria-label="Close">${I.close}</button></div>
      <div class="lb-main">${m.kind === 'video' ? `<video src="${u}" controls autoplay playsinline></video>` : `<img src="${u}" alt="${esc(m.caption || '')}">`}
      ${many ? `<button class="icon-btn nav prev" id="lbPrev" aria-label="Previous">${I.left}</button><button class="icon-btn nav next" id="lbNext" aria-label="Next">${I.right}</button>` : ''}</div>
      <div class="lb-cap">${esc(m.caption || '')}</div>`;
    $('#lbClose').onclick = closeLightbox;
    if (many) { $('#lbPrev').onclick = () => { lbIndex = (lbIndex - 1 + state.media.length) % state.media.length; renderLightbox(); }; $('#lbNext').onclick = () => { lbIndex = (lbIndex + 1) % state.media.length; renderLightbox(); }; }
  }
  function closeLightbox() { const lb = $('#lightbox'); lb.classList.remove('show'); setTimeout(() => { if (!lb.classList.contains('show')) lb.innerHTML = ''; }, 300); }

  /* ================= owner: text editing ================= */
  function editPartText(id) {
    const p = part(id);
    modal(`<h2>Edit “${esc(p.name)}”</h2><p class="lead">Changes are saved on this device and appear everywhere this part is shown.</p>
      <form class="form" id="partForm">
        <label>Part name<input id="f-name" value="${esc(p.name)}" required></label>
        <label>Short description<input id="f-tag" value="${esc(p.tagline || '')}"></label>
        <label>What it is <small>Leave a blank line between paragraphs.</small><textarea id="f-what" rows="6">${esc(p.what || '')}</textarea></label>
        <label>Common problems <small>One per line.</small><textarea id="f-probs" rows="5">${esc((p.problems || []).join('\n'))}</textarea></label>
        <label>What we do<textarea id="f-service" rows="5">${esc(p.service || '')}</textarea></label>
        <div class="actions"><button type="button" class="btn left" id="f-reset">Reset to default</button><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
      </form>`, (box) => {
      box.querySelector('#partForm').onsubmit = async (e) => {
        e.preventDefault();
        const all = Object.assign({}, cache.get('parts') || {});
        all[id] = { name: $('#f-name').value.trim() || PARTS[id].name, tagline: $('#f-tag').value.trim(), what: $('#f-what').value.trim(), problems: $('#f-probs').value.split('\n').map((x) => x.trim()).filter(Boolean), service: $('#f-service').value.trim() };
        await store.set('parts', all); closeModal(); refreshAfterEdit(); toast('Saved');
      };
      box.querySelector('#f-reset').onclick = async () => {
        const all = Object.assign({}, cache.get('parts') || {}); delete all[id];
        await store.set('parts', all); closeModal(); refreshAfterEdit(); toast('Restored the original text');
      };
    });
  }
  function refreshAfterEdit() { renderTop(); renderHome(); if (state.screen === 'explorer') { renderExplorer(); if (state.part) renderSheet(); } }

  /* ================= owner: settings ================= */
  function openSettings() {
    const s = settings();
    const typeFields = TYPES.map((t) => { const ti = typeInfo(t.id); return `<label>${esc(t.name)} — title<input id="t-${t.id}-name" value="${esc(ti.name)}"></label><label>Description<textarea id="t-${t.id}-desc" rows="2">${esc(ti.desc)}</textarea></label>`; }).join('');
    modal(`<h2>Settings</h2><p class="lead">Everything here is saved on this device.</p>
      <form class="form" id="setForm">
        <label>Business name<input id="s-biz" value="${esc(s.business)}"></label>
        <label>Phone number <small>Shows a “Call” button on every part. Leave empty to hide it.</small><input id="s-phone" type="tel" value="${esc(s.phone)}" placeholder="(555) 123-4567"></label>
        <label>Home headline<input id="s-title" value="${esc(s.homeTitle)}"></label>
        <label>Home subtitle<input id="s-sub" value="${esc(s.homeSub)}"></label>
        <fieldset><legend>Fireplace types</legend>${typeFields}</fieldset>
        <fieldset><legend>Owner PIN</legend><label>PIN to unlock owner mode <small>4–8 digits. Leave empty to unlock with a single tap.</small><input id="s-pin" inputmode="numeric" pattern="[0-9]{4,8}" value="${esc(cache.get('pin') || '')}" placeholder="No PIN"></label></fieldset>
        <fieldset><legend>Backup</legend><p class="lead" style="margin:0">Your photos, videos and text live in this browser. Save a backup file now and then, or to move everything to another device.</p>
          <div class="actions" style="justify-content:flex-start;margin-top:4px"><button type="button" class="btn" id="s-export">Download backup</button><button type="button" class="btn" id="s-import">Restore from backup</button></div>
          <p class="hint" id="s-usage"></p></fieldset>
        <fieldset><legend>Reset</legend><div class="actions" style="justify-content:flex-start;margin-top:0"><button type="button" class="btn danger" id="s-resetText">Reset all text to defaults</button></div></fieldset>
        <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
      </form>`, (box) => {
      if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then((e) => { const u = $('#s-usage'); if (u) u.textContent = `Using ${(e.usage / 1048576).toFixed(1)} MB of storage on this device.`; }).catch(() => {});
      box.querySelector('#setForm').onsubmit = async (e) => {
        e.preventDefault();
        const pin = $('#s-pin').value.trim();
        if (pin && !/^\d{4,8}$/.test(pin)) { toast('The PIN must be 4 to 8 digits.'); return; }
        await store.set('settings', { business: $('#s-biz').value.trim() || SETTINGS.business, phone: $('#s-phone').value.trim(), homeTitle: $('#s-title').value.trim() || SETTINGS.homeTitle, homeSub: $('#s-sub').value.trim() });
        const types = {}; TYPES.forEach((t) => { types[t.id] = { name: $(`#t-${t.id}-name`).value.trim() || t.name, desc: $(`#t-${t.id}-desc`).value.trim() }; });
        await store.set('types', types);
        if (pin) await store.set('pin', pin); else await store.del('pin');
        closeModal(); refreshAfterEdit(); toast('Settings saved');
      };
      box.querySelector('#s-export').onclick = exportBackup;
      box.querySelector('#s-import').onclick = () => pickFile('application/json,.json', false, (f) => importBackup(f[0]));
      box.querySelector('#s-resetText').onclick = async () => {
        if (!(await confirmBox('Reset all text?', 'Part descriptions, type names and home text go back to the originals. Photos, videos and hotspots are kept.', 'Reset text', true))) return;
        await store.del('parts'); await store.del('types'); await store.del('settings'); refreshAfterEdit(); toast('Text reset');
      };
    });
  }
  const blobToData = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
  const dataToBlob = async (d) => dataURLToBlob(d);
  async function exportBackup() {
    try {
      toast('Preparing backup…');
      const kv = {};
      for (const [k, v] of cache) {
        if (k.startsWith('bg:')) kv[k] = { w: v.w, h: v.h, data: await blobToData(v.blob) };
        else kv[k] = v;
      }
      const media = [];
      for (const m of await store.allMedia()) media.push({ part: m.part, label: m.label, caption: m.caption, kind: m.kind, mime: m.mime, order: m.order, created: m.created, data: await blobToData(m.blob) });
      const blob = new Blob([JSON.stringify({ app: 'chimney-explorer', version: 1, exported: new Date().toISOString(), kv, media })], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `chimney-explorer-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    } catch (e) { toast('The backup could not be created.'); }
  }
  async function importBackup(file) {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'chimney-explorer') throw new Error('bad');
      if (!(await confirmBox('Restore this backup?', 'Everything currently saved in the app on this device will be replaced by the backup.', 'Restore', true))) return;
      await store.clearAll();
      for (const k of Object.keys(data.kv || {})) {
        const v = data.kv[k];
        if (k.startsWith('bg:')) { const blob = await dataToBlob(v.data); await store.set(k, { blob, w: v.w, h: v.h }); cache.get(k).url = URL.createObjectURL(blob); }
        else await store.set(k, v);
      }
      for (const m of data.media || []) { const blob = await dataToBlob(m.data); delete m.data; m.blob = blob; await store.putMedia(m); }
      closeModal(); urlCache.clear(); refreshAfterEdit(); if (state.part) { state.media = await store.media(state.part); renderSheet(); }
      toast('Backup restored');
    } catch (e) { toast('That file is not a Chimney Explorer backup.'); }
  }

  /* ================= owner mode toggle ================= */
  function toggleOwner() {
    if (state.owner) { setOwner(false); return; }
    const pin = cache.get('pin');
    if (!pin) { setOwner(true); return; }
    modal(`<h2>Owner mode</h2><p class="lead">Enter your PIN to edit text, photos and videos.</p>
      <form class="form" id="pinForm"><input class="pin-input" id="pinIn" type="password" inputmode="numeric" autocomplete="off" maxlength="8" aria-label="PIN"><div class="err" id="pinErr"></div>
      <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Unlock</button></div></form>`, (box) => {
      box.querySelector('#pinForm').onsubmit = (e) => { e.preventDefault(); if ($('#pinIn').value === pin) { closeModal(); setOwner(true); } else { $('#pinErr').textContent = 'That PIN is not correct.'; $('#pinIn').value = ''; } };
    });
  }
  function setOwner(on) {
    state.owner = on; if (!on) state.moving = false;
    renderTop();
    if (state.screen === 'explorer') renderExplorer();
    if (state.part) renderSheet();
    toast(on ? 'Owner mode on. Editing controls are visible.' : 'Client view. Editing controls are hidden.');
  }

  /* ================= navigation ================= */
  function go(screen) {
    state.screen = screen;
    $('#home').setAttribute('aria-hidden', String(screen !== 'home'));
    $('#explorer').setAttribute('aria-hidden', String(screen !== 'explorer'));
    if (screen === 'home') { closePart(); renderHome(); }
    renderTop();
    const h = screen === 'home' ? '' : '#' + state.type;
    if (location.hash !== h) history.replaceState(null, '', h || location.pathname + location.search);
  }

  /* ================= sheet swipe-to-close (mobile) ================= */
  function bindSheetDrag() {
    const sheet = $('#sheet'), grip = $('#sheetGrip'); let y0 = null, dy = 0;
    grip.addEventListener('pointerdown', (e) => { y0 = e.clientY; dy = 0; grip.setPointerCapture(e.pointerId); sheet.style.transition = 'none'; });
    grip.addEventListener('pointermove', (e) => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sheet.style.transform = `translateY(${dy}px)`; });
    const end = () => { if (y0 == null) return; y0 = null; sheet.style.transition = ''; sheet.style.transform = ''; if (dy > 90) closePart(); };
    grip.addEventListener('pointerup', end); grip.addEventListener('pointercancel', end);
  }

  /* Built-in examples (js/seed.js) are copied into storage once, then behave like
     the owner's own uploads: editable, reorderable, deletable. Deleted ones stay deleted. */
  function dataURLToBlob(d) {
    const i = d.indexOf(','); const mime = d.slice(5, d.indexOf(';')); const bin = atob(d.slice(i + 1));
    const u8 = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k);
    return new Blob([u8], { type: mime });
  }
  async function importSeed() {
    const seed = window.CX_SEED || []; if (!seed.length) return;
    const done = new Set(cache.get('seeded') || []);
    const todo = seed.filter((s) => !done.has(s.id)); if (!todo.length) return;
    const counts = {};
    for (const m of await store.allMedia()) counts[m.part] = (counts[m.part] || 0) + 1;
    for (const s of todo) {
      try {
        const blob = dataURLToBlob(s.data);
        await store.putMedia({ part: s.part, label: s.label, caption: s.caption, kind: s.kind, mime: blob.type, blob, order: (counts[s.part] = (counts[s.part] || 0) + 1) - 1, created: Date.now(), seed: s.id });
        done.add(s.id);
      } catch (e) { /* skip; retried next launch */ }
    }
    await store.set('seeded', [...done]);
  }

  /* ================= boot ================= */
  async function boot() {
    const ok = await openDB();
    try { cache = await store.allKV(); } catch (e) { cache = new Map(); }
    for (const [k, v] of cache) if (k.startsWith('bg:') && v && v.blob) v.url = URL.createObjectURL(v.blob);
    if (!ok) setTimeout(() => toast('Storage is unavailable here, so uploads will not be kept.'), 800);
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* optional */ }
    await importSeed();
    const p = prefs();
    if (p.style) state.style = p.style; if (p.labels === false) state.labels = false; if (p.galMode) state.galMode = p.galMode;

    $('#brand').insertAdjacentHTML('afterbegin', I.flame);
    $('#backBtn').innerHTML = I.left + '<span>Types</span>';
    $('#backBtn').onclick = () => go('home');
    $('#ownerBtn').onclick = toggleOwner;
    $('#ownerSettings').innerHTML = I.gear + ' Settings';
    $('#ownerSettings').onclick = openSettings;
    $('#ownerDone').onclick = () => setOwner(false);
    $('#styleSeg').onclick = (e) => {
      const b = e.target.closest('button'); if (!b || b.dataset.v === state.style) return;
      state.style = b.dataset.v; savePrefs({ style: state.style }); renderTop(); renderHome();
      if (state.screen === 'explorer') { renderExplorer(); }
    };
    $('#scrim').onclick = closePart;
    // stage & chips interactions (delegated)
    $('#stage').addEventListener('click', (e) => { const t = e.target.closest('[data-part]'); if (t && !state.moving) openPart(t.dataset.part); });
    $('#chips').addEventListener('click', (e) => { const t = e.target.closest('[data-part]'); if (t) { if (state.moving) { state.moving = false; renderExplorer(); } openPart(t.dataset.part); } });
    $('#hotspots').addEventListener('pointerdown', onHsDown);
    $('#hotspots').addEventListener('pointermove', onHsMove);
    $('#hotspots').addEventListener('pointerup', onHsUp);
    $('#hotspots').addEventListener('pointercancel', onHsUp);
    bindSheetDrag();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { if ($('#lightbox').classList.contains('show')) closeLightbox(); else if ($('#modal').classList.contains('show')) closeModal(); else if (state.part) closePart(); else if (state.screen === 'explorer') go('home'); }
      if (state.part && !$('#modal').classList.contains('show') && !$('#lightbox').classList.contains('show') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        if (e.key === 'ArrowRight') $('#nextPart').click(); if (e.key === 'ArrowLeft') $('#prevPart').click();
      }
    });
    window.addEventListener('resize', fitStage);
    window.addEventListener('hashchange', () => { const t = location.hash.slice(1); if (TYPES.some((x) => x.id === t)) { if (t !== state.type || state.screen !== 'explorer') openType(t); } else if (state.screen !== 'home') go('home'); });
    if (window.ResizeObserver) new ResizeObserver(fitStage).observe($('#stageWrap'));

    renderTop(); renderHome();
    const h = location.hash.slice(1);
    if (TYPES.some((t) => t.id === h)) openType(h); else go('home');

    // offline support when served from a web host
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !/claude/.test(location.hostname)) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }
  boot();
})();
