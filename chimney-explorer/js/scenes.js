/* Chimney Explorer — scene renderers.
   Each scene is drawn twice from the same geometry: a shaded "realistic" render
   and a clean "illustrated" diagram. Hit areas and hotspot positions are shared,
   so both versions stay perfectly aligned. */
(function () {
  'use strict';

  /* ---------- tiny helpers ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => Math.round(n * 100) / 100;
  const pts = (a) => a.map((p) => f(p[0]) + ',' + f(p[1])).join(' ');
  const poly = (a, attr) => `<polygon points="${pts(a)}" ${attr || ''}/>`;
  const rect = (x, y, w, h, attr) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${attr || ''}/>`;
  const path = (d, attr) => `<path d="${d}" ${attr || ''}/>`;
  const polyD = (a) => 'M' + a.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z';
  const rectD = (x, y, w, h) => polyD([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);

  let UID = 0;
  function makeCtx(real) {
    const pre = 'cx' + (++UID) + '-';
    return { real, id: (n) => pre + n, url: (n) => `url(#${pre}${n})` };
  }

  const INK = '#3a2f2a'; // illustrated outline colour
  const OUT = `stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"`;

  /* ---------- shared defs ---------- */
  function defs(c) {
    const id = c.id;
    if (!c.real) {
      return `<defs>
        <linearGradient id="${id('glow')}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb066" stop-opacity=".55"/><stop offset="1" stop-color="#ffb066" stop-opacity="0"/></linearGradient>
      </defs>`;
    }
    return `<defs>
      <linearGradient id="${id('sky')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9cad8"/><stop offset=".6" stop-color="#dfe6ea"/><stop offset="1" stop-color="#eceae4"/></linearGradient>
      <linearGradient id="${id('attic')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2d24"/><stop offset="1" stop-color="#5b4836"/></linearGradient>
      <linearGradient id="${id('wall')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7ded2"/><stop offset="1" stop-color="#d6c9b8"/></linearGradient>
      <radialGradient id="${id('roomlight')}" cx=".5" cy=".75" r=".7"><stop offset="0" stop-color="#ffcf9a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf9a" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id('cavity')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140e0b"/><stop offset=".5" stop-color="#2a1f19"/><stop offset="1" stop-color="#120c09"/></linearGradient>
      <linearGradient id="${id('liner')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6d2c16"/><stop offset=".22" stop-color="#b65a31"/><stop offset=".42" stop-color="#e09468"/><stop offset=".55" stop-color="#c46c40"/><stop offset=".85" stop-color="#8a3a1d"/><stop offset="1" stop-color="#5a2210"/></linearGradient>
      <linearGradient id="${id('linerSec')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c4a26"/><stop offset="1" stop-color="#c7754a"/></linearGradient>
      <linearGradient id="${id('steel')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d848c"/><stop offset=".3" stop-color="#e6eaee"/><stop offset=".5" stop-color="#b6bdc4"/><stop offset=".75" stop-color="#eef1f3"/><stop offset="1" stop-color="#6f767e"/></linearGradient>
      <linearGradient id="${id('iron')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b4f55"/><stop offset=".5" stop-color="#25282c"/><stop offset="1" stop-color="#121315"/></linearGradient>
      <linearGradient id="${id('ironH')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b1d20"/><stop offset=".45" stop-color="#5a5f66"/><stop offset=".6" stop-color="#33373c"/><stop offset="1" stop-color="#141517"/></linearGradient>
      <linearGradient id="${id('alu')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#a9b1b9"/><stop offset="1" stop-color="#d7dce1"/></linearGradient>
      <linearGradient id="${id('concrete')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfccc6"/><stop offset="1" stop-color="#8e8a84"/></linearGradient>
      <linearGradient id="${id('parge')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2826"/><stop offset=".35" stop-color="#6b6560"/><stop offset="1" stop-color="#8d8780"/></linearGradient>
      <linearGradient id="${id('soot')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0a08"/><stop offset="1" stop-color="#3b2c22"/></linearGradient>
      <linearGradient id="${id('stone')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3ca"/><stop offset="1" stop-color="#a59c90"/></linearGradient>
      <linearGradient id="${id('wood')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a35"/><stop offset=".5" stop-color="#6e4426"/><stop offset="1" stop-color="#4f2f19"/></linearGradient>
      <linearGradient id="${id('glass')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity=".04"/><stop offset=".5" stop-color="#fff" stop-opacity=".16"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id('flame')}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5a12"/><stop offset=".5" stop-color="#ff9a2e"/><stop offset="1" stop-color="#ffcf63" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${id('flameIn')}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff1b8"/><stop offset="1" stop-color="#ffc24a" stop-opacity=".1"/></linearGradient>
      <radialGradient id="${id('glow')}" cx=".5" cy=".85" r=".65"><stop offset="0" stop-color="#ffb35c" stop-opacity=".95"/><stop offset=".45" stop-color="#ff7a26" stop-opacity=".45"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id('lightL')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3e6" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
      <radialGradient id="${id('vignette')}" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
      <linearGradient id="${id('shingle')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4d52"/><stop offset="1" stop-color="#2b2d31"/></linearGradient>
      <pattern id="${id('planks')}" patternUnits="userSpaceOnUse" width="120" height="14"><rect width="120" height="14" fill="#9b6a42"/><rect y="0" width="120" height="1" fill="#6e4628"/><rect x="0" y="7" width="120" height="1" fill="#7a4f2e" opacity=".6"/><rect x="40" y="0" width="1" height="7" fill="#5c3a20"/><rect x="95" y="7" width="1" height="7" fill="#5c3a20"/><path d="M0 3.5 Q30 2 60 4 T120 3" stroke="#b07c50" stroke-width=".7" fill="none" opacity=".6"/><path d="M0 10.5 Q40 9 80 11 T120 10" stroke="#84552f" stroke-width=".7" fill="none" opacity=".6"/></pattern>
      <pattern id="${id('mesh')}" patternUnits="userSpaceOnUse" width="5" height="5"><rect width="5" height="5" fill="#1a1c1f" fill-opacity=".25"/><path d="M0 0H5M0 0V5" stroke="#9aa1a8" stroke-width=".9"/></pattern>
      <pattern id="${id('corr')}" patternUnits="userSpaceOnUse" width="10" height="6"><rect width="10" height="6" fill="none"/><rect y="0" width="10" height="2.2" fill="#000" opacity=".22"/><rect y="3.2" width="10" height="1" fill="#fff" opacity=".45"/></pattern>
      <pattern id="${id('insul')}" patternUnits="userSpaceOnUse" width="14" height="10"><rect width="14" height="10" fill="#e7b48f"/><path d="M0 6 Q3.5 1 7 6 T14 6" stroke="#cf9670" stroke-width="1" fill="none"/></pattern>
      <filter id="${id('noise')}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 -1.25 .62"/></filter>
      <filter id="${id('blur2')}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
      <filter id="${id('blur6')}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="${id('blur14')}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="${id('shadow')}" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".35"/></filter>
    </defs>`;
  }

  /* ---------- masonry generators ---------- */
  // Running-bond brick wall clipped to `clipD`. Courses start at oy, columns at ox.
  function bricks(c, key, clipD, box, o) {
    o = o || {};
    const bw = o.bw || 32, bh = o.bh || 11, ox = o.ox != null ? o.ox : box.x, oy = o.oy != null ? o.oy : box.y;
    const cid = c.id('clip-' + key);
    let s = `<clipPath id="${cid}"><path d="${clipD}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${cid})">`;
    const i0 = Math.floor((box.y - oy) / bh) - 1, i1 = Math.ceil((box.y + box.h - oy) / bh) + 1;
    if (c.real) {
      const r = rng(o.seed || 7);
      const hue = o.hue || [6, 18], sat = o.sat || [40, 56], lig = o.lig || [30, 43];
      s += rect(box.x, box.y, box.w, box.h, `fill="${o.mortar || '#a89d90'}"`);
      for (let i = i0; i <= i1; i++) {
        const y = oy + i * bh;
        const shift = (((i % 2) + 2) % 2) ? -bw / 2 : 0;
        let x = ox + shift;
        while (x > box.x) x -= bw;
        for (; x < box.x + box.w; x += bw) {
          let l = lig[0] + r() * (lig[1] - lig[0]);
          if (r() < 0.07) l -= 8;
          const col = `hsl(${f(hue[0] + r() * (hue[1] - hue[0]))},${f(sat[0] + r() * (sat[1] - sat[0]))}%,${f(l)}%)`;
          s += rect(x + 0.8, y + 0.8, bw - 1.6, bh - 1.6, `rx="0.9" fill="${col}"`);
        }
      }
      // bevel: highlight on top edge, shadow on bottom edge of each course
      const pid = c.id('bv-' + key);
      s += `<pattern id="${pid}" patternUnits="userSpaceOnUse" x="${ox}" y="${oy}" width="${bw}" height="${bh}"><rect x="0" y="0.8" width="${bw}" height="1" fill="#fff" opacity=".13"/><rect x="0" y="${bh - 2}" width="${bw}" height="1.2" fill="#000" opacity=".28"/></pattern>`;
      s += rect(box.x, box.y, box.w, box.h, `fill="url(#${pid})"`);
      if (o.dark) s += rect(box.x, box.y, box.w, box.h, `fill="#000" opacity="${o.dark}"`);
      if (o.light !== false) s += rect(box.x, box.y, box.w, box.h, `fill="${c.url('lightL')}"`);
    } else {
      s += rect(box.x, box.y, box.w, box.h, `fill="${o.flat || '#dd7f5f'}"`);
      let d = '';
      for (let i = i0; i <= i1; i++) {
        const y = oy + i * bh;
        d += `M${box.x} ${y}H${box.x + box.w}`;
        const shift = (((i % 2) + 2) % 2) ? -bw / 2 : 0;
        let x = ox + shift;
        while (x > box.x) x -= bw;
        for (; x < box.x + box.w; x += bw) d += `M${x} ${y}V${y + bh}`;
      }
      s += path(d, `stroke="${o.line || '#f6e4d8'}" stroke-width="1.3" fill="none"`);
      if (o.dark) s += rect(box.x, box.y, box.w, box.h, `fill="${INK}" opacity="${o.dark}"`);
    }
    return s + '</g>';
  }

  function joint(ox, k, bw) { return ox + ((k % 2) ? -bw / 2 : 0); }
  // snap to a brick end at or below / at or above a target
  function snapDown(ox, k, bw, target) { let x = joint(ox, k, bw); while (x + bw <= target) x += bw; while (x > target) x -= bw; return x; }
  function snapUp(ox, k, bw, target) { let x = joint(ox, k, bw); while (x < target) x += bw; return x; }

  /* ---------- fire ---------- */
  function flamePath(cx, base, w, h, lean) {
    lean = lean || 0;
    return `M${f(cx - w)} ${f(base)} C${f(cx - w)} ${f(base - h * 0.45)} ${f(cx - w * 0.2 + lean)} ${f(base - h * 0.6)} ${f(cx + lean)} ${f(base - h)} C${f(cx + w * 0.35 + lean)} ${f(base - h * 0.55)} ${f(cx + w)} ${f(base - h * 0.4)} ${f(cx + w)} ${f(base)} Z`;
  }
  function fire(c, cx, base, s) {
    s = s || 1;
    let o = '';
    const logW = 120 * s;
    if (c.real) {
      o += `<ellipse cx="${cx}" cy="${base - 40 * s}" rx="${110 * s}" ry="${80 * s}" fill="${c.url('glow')}" filter="${c.url('blur14')}" class="glow"/>`;
    }
    // grate
    o += rect(cx - 70 * s, base - 6 * s, 140 * s, 5 * s, c.real ? `fill="${c.url('iron')}"` : `fill="${INK}"`);
    o += rect(cx - 64 * s, base - 6 * s, 6 * s, 10 * s, c.real ? `fill="#1a1a1a"` : `fill="${INK}"`) + rect(cx + 58 * s, base - 6 * s, 6 * s, 10 * s, c.real ? `fill="#1a1a1a"` : `fill="${INK}"`);
    // flames
    const fl = [
      [cx - 34 * s, 26 * s, 70 * s, -6 * s], [cx + 6 * s, 30 * s, 92 * s, 4 * s], [cx + 40 * s, 22 * s, 62 * s, 8 * s], [cx - 8 * s, 18 * s, 56 * s, -3 * s]
    ];
    o += '<g class="flames">';
    fl.forEach((q, i) => {
      const base2 = base - 16 * s;
      if (c.real) {
        o += path(flamePath(q[0], base2, q[1], q[2], q[3]), `fill="${c.url('flame')}" filter="${c.url('blur2')}" class="fl fl${i}"`);
      } else {
        o += path(flamePath(q[0], base2, q[1], q[2], q[3]), `fill="#ff7a32" class="fl fl${i}"`);
      }
    });
    fl.forEach((q, i) => {
      const base2 = base - 16 * s;
      o += path(flamePath(q[0], base2, q[1] * 0.55, q[2] * 0.6, q[3]), c.real ? `fill="${c.url('flameIn')}" class="fl fl${i}"` : `fill="#ffc65c" class="fl fl${i}"`);
    });
    o += '</g>';
    // logs
    const logFill = c.real ? c.url('wood') : '#8b5a3c';
    o += `<g transform="rotate(-6 ${cx} ${base - 14 * s})">` + rect(cx - logW / 2, base - 24 * s, logW, 14 * s, `rx="${7 * s}" fill="${logFill}" ${c.real ? '' : OUT}`) + `</g>`;
    o += `<g transform="rotate(7 ${cx} ${base - 12 * s})">` + rect(cx - logW / 2 + 6 * s, base - 18 * s, logW - 10 * s, 13 * s, `rx="${6.5 * s}" fill="${logFill}" ${c.real ? '' : OUT}`) + `</g>`;
    if (c.real) {
      o += `<ellipse cx="${cx}" cy="${base - 10 * s}" rx="${55 * s}" ry="${7 * s}" fill="#ff8a2a" opacity=".55" filter="${c.url('blur2')}"/>`;
      const r = rng(11);
      for (let i = 0; i < 14; i++) o += `<circle cx="${f(cx - 50 * s + r() * 100 * s)}" cy="${f(base - 6 * s - r() * 8 * s)}" r="${f(0.8 + r() * 1.4)}" fill="#ffcf6a" opacity="${f(0.5 + r() * 0.5)}"/>`;
    }
    return o;
  }

  function overlays(c, W, H) {
    if (!c.real) return '';
    return rect(0, 0, W, H, `fill="#000" filter="${c.url('noise')}" opacity=".5" style="mix-blend-mode:multiply" pointer-events="none"`) +
      rect(0, 0, W, H, `fill="${c.url('vignette')}" pointer-events="none"`);
  }

  /* =================================================================
     SCENE 1 — Masonry chimney (front cutaway, roof to hearth)
     ================================================================= */
  function masonry(c) {
    const W = 600, H = 1000, R = c.real;
    const roofY = (x) => 300 + 0.2 * x;
    const OY = 132, BH = 11, BW = 32;
    let o = defs(c);

    // background: sky, attic, room
    o += path(`M0 0H600V${roofY(600)}L0 ${roofY(0)}Z`, `fill="${R ? c.url('sky') : '#eef3f6'}"`);
    o += poly([[0, roofY(0) + 38], [600, roofY(600) + 38], [600, 546], [0, 546]], `fill="${R ? c.url('attic') : '#f4eee7'}"`);
    // attic insulation
    o += rect(0, 526, 600, 20, R ? `fill="${c.url('insul')}"` : `fill="#f6dccd"`);
    if (!R) o += path('M0 526' + Array.from({ length: 30 }, (_, i) => `Q${i * 20 + 10} 518 ${i * 20 + 20} 526`).join(''), `fill="#f6dccd" stroke="${INK}" stroke-width="1.2"`);
    // ceiling
    o += rect(0, 546, 600, 15, R ? `fill="#efe9e1"` : `fill="#ffffff" ${OUT}`);
    if (R) o += rect(0, 559, 600, 2, 'fill="#000" opacity=".12"');
    // room wall
    o += rect(0, 561, 600, 387, `fill="${R ? c.url('wall') : '#faf6f0'}"`);
    if (R) o += rect(0, 561, 600, 387, `fill="${c.url('roomlight')}"`);
    // baseboard + floor
    o += rect(0, 931, 600, 17, R ? 'fill="#f4efe7"' : `fill="#ffffff" ${OUT}`);
    if (R) o += rect(0, 946, 600, 2, 'fill="#000" opacity=".15"');
    o += rect(0, 948, 600, 52, R ? `fill="${c.url('planks')}"` : 'fill="#ecdcc7"');
    if (!R) o += path('M0 962H600M0 976H600M0 990H600M90 948V962M300 962V976M450 948V962M180 976V990M520 976V990', `stroke="#d4bda1" stroke-width="1.2" fill="none"`);
    if (R) o += rect(0, 948, 600, 52, 'fill="#000" opacity=".12"');

    // roof section: shingles, sheathing, rafter
    const band = (a, b) => [[-10, roofY(-10) + a], [610, roofY(610) + a], [610, roofY(610) + b], [-10, roofY(-10) + b]];
    o += poly(band(16, 38), R ? 'fill="#b88a5a"' : `fill="#e8c9a0" ${OUT}`);
    o += poly(band(8, 16), R ? 'fill="#d8b47f"' : `fill="#f3dfbf" ${OUT}`);
    o += poly(band(-2, 8), R ? `fill="${c.url('shingle')}"` : `fill="#5f646b" ${OUT}`);
    if (R) {
      let d = '';
      for (let x = -10; x < 610; x += 14) d += `M${x} ${f(roofY(x) - 2)}L${x + 3} ${f(roofY(x + 3) + 8)}`;
      o += path(d, 'stroke="#18191b" stroke-width="1" opacity=".6"');
      o += poly(band(-2, 0), 'fill="#fff" opacity=".18"');
    }

    // stack + chimney breast (front face)
    const stack = { x: 220, y: OY, w: 160, h: 561 - OY };
    const breast = { x: 140, y: 561, w: 320, h: 925 - 561 };

    // stepped cutaway region, following real brick ends
    const r = rng(42);
    const left = [], right = [];
    let wl = 0, wr = 0;
    for (let k = 1; k <= 51; k++) {
      const y = OY + k * BH;
      const inStack = y < 561;
      const ox = inStack ? 220 : 140;
      let L, Rr;
      // random walk so the broken edge looks hand-demolished, not combed
      if (k % 3 === 1) { wl = Math.max(-1, Math.min(1, wl + (r() < 0.5 ? -1 : 1))); wr = Math.max(-1, Math.min(1, wr + (r() < 0.5 ? -1 : 1))); }
      if (k <= 39) { L = snapDown(ox, k, BW, 252 - wl * 14); Rr = snapUp(ox, k, BW, 348 + wr * 14); }
      else { L = snapDown(ox, k, BW, 200 - Math.abs(wl) * 24); Rr = snapUp(ox, k, BW, 400 + Math.abs(wr) * 24); }
      if (inStack) { L = Math.max(L, 226); Rr = Math.min(Rr, 374); }
      left.push([L, y], [L, y + BH]);
      right.unshift([Rr, y + BH], [Rr, y]);
    }
    const reveal = left.concat(right);
    const revealD = polyD(reveal);
    const opening = [200, 714, 200, 211];
    const openingD = rectD(opening[0], opening[1], opening[2], opening[3]);

    o += bricks(c, 'stack', rectD(stack.x, stack.y, stack.w, stack.h) + revealD, stack, { ox: 220, oy: OY, seed: 3 });
    o += bricks(c, 'breast', rectD(breast.x, breast.y, breast.w, breast.h) + revealD + openingD, breast, { ox: 140, oy: OY, seed: 9 });
    if (!R) o += path(rectD(stack.x, stack.y, stack.w, stack.h) + rectD(breast.x, breast.y, breast.w, breast.h), `fill="none" ${OUT}`);

    // inside the cutaway
    const rid = c.id('reveal');
    o += `<clipPath id="${rid}"><path d="${revealD}"/></clipPath><g clip-path="url(#${rid})">`;
    o += rect(150, 130, 300, 590, R ? `fill="${c.url('cavity')}"` : 'fill="#efe5db"');
    o += bricks(c, 'back', rectD(150, 130, 300, 590), { x: 150, y: 130, w: 300, h: 590 }, { ox: 236, oy: OY + 5, seed: 21, dark: R ? 0.62 : 0.0, flat: '#ecd3c6', line: '#f7ebe3', light: false });
    // smoke chamber
    const sc = [[268, 575], [332, 575], [392, 690], [208, 690]];
    o += poly(sc, R ? `fill="${c.url('parge')}"` : `fill="#c9c1b9" ${OUT}`);
    if (R) {
      o += poly([[268, 575], [300, 575], [300, 690], [208, 690]], 'fill="#fff" opacity=".05"');
      o += path('M290 682 C 280 650, 312 630, 296 600 S 300 585, 300 575', `stroke="#d9d4cf" stroke-width="10" fill="none" opacity=".18" filter="${c.url('blur6')}" class="smoke"/>`);
    } else {
      o += path('M300 680 C 285 650, 318 630, 300 600 S 300 585, 300 578', `stroke="#9a918a" stroke-width="2" stroke-dasharray="5 6" fill="none" class="smoke-dash"/>`);
    }
    // liner (intact clay tile tube)
    o += rect(268, 98, 64, 478, R ? `fill="${c.url('liner')}"` : `fill="#e9a27c" ${OUT}`);
    let jd = '';
    for (let y = 140; y < 575; y += 48) jd += `M268 ${y}H332`;
    o += path(jd, R ? 'stroke="#3d1a0c" stroke-width="2" opacity=".55"' : `stroke="${INK}" stroke-width="1.2"`);
    if (R) o += rect(268, 98, 64, 478, 'fill="#000" opacity=".08"');
    // damper (open plate in throat)
    o += rect(206, 690, 188, 9, R ? `fill="${c.url('iron')}"` : `fill="#45413e" ${OUT}`);
    o += poly([[222, 691], [378, 691], [366, 672], [234, 672]], R ? `fill="${c.url('ironH')}"` : `fill="#6b6662" ${OUT}`);
    o += rect(296, 676, 8, 14, R ? 'fill="#111"' : `fill="${INK}"`);
    o += '</g>';
    // cut edge depth
    if (R) {
      o += `<g clip-path="url(#${rid})">${path(revealD, 'fill="none" stroke="#000" stroke-width="18" opacity=".45" filter="' + c.url('blur6') + '"')}${path(revealD, 'fill="none" stroke="#6a2a16" stroke-width="7"')}${path(revealD, 'fill="none" stroke="#c98a6a" stroke-width="1" opacity=".5"')}</g>`;
    } else {
      o += path(revealD, `fill="none" ${OUT}`);
    }

    // steel lintel
    o += rect(194, 704, 212, 10, R ? `fill="${c.url('iron')}"` : `fill="#4c4844" ${OUT}`);

    // firebox (opening with perspective)
    const fb = c.id('fb');
    o += `<clipPath id="${fb}"><path d="${openingD}"/></clipPath><g clip-path="url(#${fb})">`;
    const back = [[242, 744], [358, 744], [358, 902], [242, 902]];
    const fbBox = { x: 200, y: 714, w: 200, h: 211 };
    const fbOpt = { bw: 28, bh: 10, hue: [24, 34], sat: [38, 52], lig: [52, 66], mortar: '#5d4b3d', flat: '#ecd1ab', line: '#c9a47c', light: false };
    o += bricks(c, 'fbback', polyD(back), fbBox, Object.assign({ ox: 242, oy: 744, seed: 5 }, fbOpt));
    o += bricks(c, 'fbl', polyD([[200, 714], [242, 744], [242, 902], [200, 925]]), fbBox, Object.assign({ ox: 200, oy: 744, seed: 6, dark: R ? 0.35 : 0.08 }, fbOpt));
    o += bricks(c, 'fbr', polyD([[400, 714], [358, 744], [358, 902], [400, 925]]), fbBox, Object.assign({ ox: 200, oy: 744, seed: 8, dark: R ? 0.42 : 0.12 }, fbOpt));
    o += poly([[200, 714], [400, 714], [358, 744], [242, 744]], R ? `fill="${c.url('soot')}"` : `fill="#5d5049"`);
    o += poly([[200, 925], [400, 925], [358, 902], [242, 902]], R ? 'fill="#4a3a2e"' : 'fill="#d9bf9c"');
    if (R) o += rect(200, 714, 200, 90, 'fill="#000" opacity=".35"') + poly([[200, 714], [400, 714], [400, 790], [200, 790]], 'fill="#000" opacity=".15"');
    if (!R) o += path('M242 744V902H358V744ZM200 714L242 744M400 714L358 744M200 925L242 902M400 925L358 902', `fill="none" stroke="${INK}" stroke-width="1.2" opacity=".8"`);
    o += fire(c, 300, 908, 0.82);
    o += '</g>';
    o += rect(200, 714, 200, 211, `fill="none" ${R ? 'stroke="#2a1a12" stroke-width="2"' : OUT}`);

    // hearth
    o += poly([[118, 925], [482, 925], [492, 934], [108, 934]], R ? `fill="${c.url('stone')}"` : `fill="#ddd6cc" ${OUT}`);
    o += rect(108, 934, 384, 14, R ? 'fill="#8d847a"' : `fill="#c3bab0" ${OUT}`);
    if (R) o += rect(108, 948, 384, 6, `fill="#000" opacity=".25" filter="${c.url('blur2')}"`);

    // crown, liner stub, cap
    o += rect(268, 96, 64, 14, R ? `fill="${c.url('liner')}"` : `fill="#e9a27c" ${OUT}`);
    o += poly([[204, 133], [396, 133], [396, 123], [338, 109], [262, 109], [204, 123]], R ? `fill="${c.url('concrete')}" filter="${c.url('shadow')}"` : `fill="#d2cec8" ${OUT}`);
    if (R) o += poly([[204, 123], [262, 109], [338, 109], [396, 123], [396, 125], [204, 125]], 'fill="#fff" opacity=".25"');
    // cap: legs + mesh + lid
    o += rect(252, 74, 96, 35, R ? `fill="${c.url('mesh')}"` : `fill="#f1f3f5" ${OUT}`);
    if (!R) { let md = ''; for (let x = 258; x < 348; x += 7) md += `M${x} 74V109`; for (let y = 80; y < 109; y += 7) md += `M252 ${y}H348`; o += path(md, 'stroke="#8f979f" stroke-width="1"'); }
    o += rect(250, 74, 4, 35, R ? 'fill="#2b2e32"' : `fill="#4a4f55"`) + rect(346, 74, 4, 35, R ? 'fill="#2b2e32"' : `fill="#4a4f55"`);
    o += poly([[232, 78], [368, 78], [342, 54], [258, 54]], R ? `fill="${c.url('ironH')}" filter="${c.url('shadow')}"` : `fill="#4a4f55" ${OUT}`);
    o += rect(228, 76, 144, 5, R ? 'fill="#1b1d20"' : `fill="#3b4045" ${OUT}`);
    if (R) o += poly([[258, 54], [342, 54], [346, 58], [254, 58]], 'fill="#fff" opacity=".3"');

    // flashing (step + counter flashing where stack meets roof)
    const fl = (x0, x1, top) => {
      const yb0 = roofY(x0), yb1 = roofY(x1);
      return poly([[x0, yb0 - 2], [x1, yb1 - 2], [x1, top], [x0, top]], R ? `fill="${c.url('alu')}" filter="${c.url('shadow')}"` : `fill="#b9c2ca" ${OUT}`);
    };
    o += poly([[186, roofY(186) - 3], [220, roofY(220) - 3], [220, roofY(220) + 3], [186, roofY(186) + 3]], R ? `fill="${c.url('alu')}"` : `fill="#b9c2ca" ${OUT}`);
    o += poly([[380, roofY(380) - 3], [414, roofY(414) - 3], [414, roofY(414) + 3], [380, roofY(380) + 3]], R ? `fill="${c.url('alu')}"` : `fill="#b9c2ca" ${OUT}`);
    o += fl(220, 244, 314) + fl(356, 380, 343);
    o += rect(218, 309, 28, 5, R ? 'fill="#8f979f"' : `fill="#9aa4ad" ${OUT}`) + rect(354, 338, 28, 5, R ? 'fill="#8f979f"' : `fill="#9aa4ad" ${OUT}`);

    o += overlays(c, W, H);

    const hits = {
      brick: { d: rectD(stack.x, stack.y, stack.w, stack.h) + rectD(breast.x, breast.y, breast.w, breast.h) + revealD + openingD, rule: 'evenodd' },
      flashing: { d: polyD([[184, 300], [250, 300], [250, roofY(250) + 6], [184, roofY(184) + 6]]) + polyD([[350, 330], [416, 330], [416, roofY(416) + 6], [350, roofY(350) + 6]]) },
      liner: { d: rectD(266, 96, 68, 480) },
      smoke: { d: polyD(sc) },
      damper: { d: rectD(204, 668, 192, 34) },
      firebox: { d: openingD },
      hearth: { d: polyD([[118, 925], [482, 925], [492, 934], [492, 948], [108, 948], [108, 934]]) },
      crown: { d: polyD([[204, 133], [396, 133], [396, 123], [338, 109], [262, 109], [204, 123]]) },
      cap: { d: rectD(226, 50, 148, 59) }
    };
    return { W, H, svg: o, hits };
  }

  /* =================================================================
     SCENE 2 — Wood-burning fireplace (side section)
     ================================================================= */
  function wood(c) {
    const W = 600, H = 900, R = c.real;
    let o = defs(c);
    // background: outside (left), room (right), ground below
    o += rect(0, 0, 600, 900, `fill="${R ? c.url('sky') : '#eef3f6'}"`);
    o += rect(392, 0, 208, 702, `fill="${R ? c.url('wall') : '#faf6f0'}"`);
    if (R) o += rect(392, 0, 208, 702, `fill="${c.url('roomlight')}"`);
    // ceiling
    o += rect(392, 140, 208, 16, R ? 'fill="#efe9e1"' : `fill="#fff" ${OUT}`);
    o += rect(392, 92, 208, 48, R ? `fill="${c.url('attic')}"` : 'fill="#f4eee7"');
    o += rect(392, 120, 208, 20, R ? `fill="${c.url('insul')}"` : `fill="#f6dccd"`);
    // floor system + basement
    o += rect(392, 702, 208, 14, R ? `fill="${c.url('planks')}"` : `fill="#ecdcc7" ${OUT}`);
    o += rect(392, 716, 208, 30, R ? 'fill="#c79c6c"' : `fill="#ead1ae" ${OUT}`);
    o += rect(392, 746, 208, 154, R ? 'fill="#3b332c"' : 'fill="#ece6de"');
    o += rect(0, 746, 120, 154, R ? 'fill="#5a4636"' : 'fill="#e2d3c2"');
    if (R) o += rect(0, 746, 120, 154, `fill="#000" filter="${c.url('noise')}" opacity=".6"`);
    o += rect(0, 742, 120, 6, R ? 'fill="#4c7a3a"' : 'fill="#9fc28a"');

    // masonry mass (section) — brick hatch
    const mass = [[232, 0], [392, 0], [392, 270], [410, 320], [410, 900], [120, 900], [120, 340], [232, 280]];
    const massD = polyD(mass);
    const cav = [[275, 0], [345, 0], [345, 300], [368, 490], [368, 498], [410, 520], [410, 690], [220, 690], [220, 590], [300, 492], [255, 492], [275, 300]];
    const cavD = polyD(cav);
    const pit = [[214, 704], [334, 704], [334, 862], [214, 862]];
    const pitD = polyD(pit);
    o += bricks(c, 'mass', massD, { x: 120, y: 0, w: 290, h: 900 }, { ox: 120, oy: 0, seed: 13, light: false, dark: R ? 0.08 : 0 });
    // firebrick lining along firebox back, slope and floor
    o += path('M410 696L214 696L214 586L296 486', R ? 'stroke="#d8b48a" stroke-width="26" fill="none" stroke-linejoin="miter"' : 'stroke="#efd2ad" stroke-width="26" fill="none" stroke-linejoin="miter"');
    o += path('M410 696L214 696L214 586L296 486', `stroke="${R ? '#7a5b42' : '#c9a47c'}" stroke-width="26" stroke-dasharray="1.4 15" fill="none" stroke-linejoin="miter"`);
    // flue liner walls (section through clay tiles)
    o += rect(262, 0, 13, 300, R ? `fill="${c.url('linerSec')}"` : `fill="#e9a27c" ${OUT}`) + rect(345, 0, 13, 300, R ? `fill="${c.url('linerSec')}"` : `fill="#e9a27c" ${OUT}`);
    let lj = ''; for (let y = 40; y < 300; y += 60) lj += `M262 ${y}H275M345 ${y}H358`;
    o += path(lj, `stroke="${R ? '#3d1a0c' : INK}" stroke-width="1.5"`);
    // parging on smoke chamber walls
    o += path('M275 300L255 492M345 300L368 490', R ? 'stroke="#77716b" stroke-width="10" fill="none"' : 'stroke="#c9c1b9" stroke-width="10" fill="none"');
    // cavities
    o += path(cavD, R ? `fill="${c.url('cavity')}"` : 'fill="#f3ebe3"');
    if (R) o += poly([[220, 590], [300, 492], [368, 498], [410, 520], [410, 690], [220, 690]], `fill="${c.url('glow')}" opacity=".7"`);
    o += path(pitD, R ? 'fill="#1b1512"' : 'fill="#efe7df"');
    o += path(cavD + pitD, `fill="none" ${R ? 'stroke="#1a110c" stroke-width="2"' : OUT}`);
    // ash pile + ash dump door + cleanout door
    o += path('M218 862 Q 250 836 280 846 T 330 862 Z', R ? 'fill="#9c958d"' : `fill="#cfc8c0" ${OUT}`);
    o += rect(262, 688, 40, 6, R ? `fill="${c.url('iron')}"` : `fill="#4a4f55" ${OUT}`);
    o += `<g transform="rotate(-28 262 694)">${rect(262, 690, 40, 4, R ? 'fill="#2b2e32"' : `fill="#6b6662" ${OUT}`)}</g>`;
    o += rect(112, 812, 10, 40, R ? `fill="${c.url('iron')}"` : `fill="#4a4f55" ${OUT}`);
    // smoke shelf highlight + damper
    o += rect(255, 488, 45, 5, R ? 'fill="#57514c"' : `fill="#b8b0a8" ${OUT}`);
    o += rect(298, 490, 72, 7, R ? `fill="${c.url('iron')}"` : `fill="#45413e" ${OUT}`);
    o += `<g transform="rotate(-52 304 492)">${rect(304, 488, 58, 6, R ? `fill="${c.url('ironH')}"` : `fill="#6b6662" ${OUT}`)}</g>`;
    // lintel + face veneer + mantel
    o += rect(394, 506, 18, 14, R ? `fill="${c.url('iron')}"` : `fill="#4c4844" ${OUT}`);
    o += rect(410, 330, 10, 176, R ? `fill="${c.url('stone')}"` : `fill="#ddd6cc" ${OUT}`);
    o += rect(410, 396, 78, 18, R ? `fill="${c.url('wood')}" filter="${c.url('shadow')}"` : `fill="#a26b45" ${OUT}`);
    o += poly([[420, 414], [452, 414], [420, 448]], R ? `fill="${c.url('wood')}"` : `fill="#8b5a3c" ${OUT}`);
    // hearth extension
    o += rect(410, 686, 152, 16, R ? `fill="${c.url('stone')}" filter="${c.url('shadow')}"` : `fill="#ddd6cc" ${OUT}`);
    // fire + draft
    o += `<g>${fire(c, 312, 684, 0.62)}</g>`;
    o += path('M330 610 C 330 560, 300 540, 330 500 S 312 420, 310 300 L 310 30', R ? `stroke="#e9e4de" stroke-width="12" fill="none" opacity=".16" filter="${c.url('blur6')}" class="smoke"` : 'stroke="#9a918a" stroke-width="2" stroke-dasharray="5 6" fill="none" class="smoke-dash"');
    if (!R) o += path('M302 44 L310 28 L318 44', 'stroke="#9a918a" stroke-width="2" fill="none"');
    if (!R) o += path(massD, `fill="none" ${OUT}`);
    o += overlays(c, W, H);

    const hits = {
      liner: { d: rectD(260, 0, 100, 300) },
      smoke: { d: polyD([[275, 300], [345, 300], [366, 484], [258, 484]]) },
      shelf: { d: rectD(250, 482, 48, 16) },
      damper: { d: rectD(298, 438, 76, 62) },
      firebrick: { d: polyD([[200, 584], [292, 474], [306, 488], [228, 588], [228, 686], [410, 686], [410, 710], [200, 710]]) },
      firebox: { d: polyD([[228, 588], [306, 498], [368, 500], [410, 522], [410, 684], [228, 684]]) },
      mantel: { d: rectD(408, 326, 82, 182) },
      hearth: { d: rectD(410, 684, 154, 20) },
      ashdump: { d: rectD(210, 712, 128, 154) + rectD(106, 806, 20, 52) }
    };
    return { W, H, svg: o, hits };
  }

  /* =================================================================
     SCENE 3 — Fireplace insert (front view, upper cutaway)
     ================================================================= */
  function insert(c) {
    const W = 600, H = 800, R = c.real;
    let o = defs(c);
    o += rect(0, 0, 600, 800, `fill="${R ? c.url('wall') : '#faf6f0'}"`);
    if (R) o += rect(0, 0, 600, 800, `fill="${c.url('roomlight')}"`);
    o += rect(0, 722, 600, 78, R ? `fill="${c.url('planks')}"` : 'fill="#ecdcc7"');
    if (!R) o += path('M0 740H600M0 758H600M0 776H600M120 722V740M380 740V758M230 758V776', 'stroke="#d4bda1" stroke-width="1.2"');
    if (R) o += rect(0, 722, 600, 78, 'fill="#000" opacity=".1"');

    const BW = 32, BH = 11, OY = 0;
    // cutaway over the mantel, stepped along brick ends
    const r = rng(77); const left = [], right = [];
    for (let k = 2; k <= 30; k++) {
      const y = OY + k * BH;
      let L = snapDown(110, k, BW, 196), Rr = snapUp(110, k, BW, 404);
      if (r() < 0.25) L -= BW / 2; if (r() < 0.25) Rr += BW / 2;
      left.push([L, y], [L, y + BH]); right.unshift([Rr, y + BH], [Rr, y]);
    }
    const reveal = left.concat(right); const revealD = polyD(reveal);
    const breast = { x: 110, y: 0, w: 380, h: 722 };
    o += bricks(c, 'breast', rectD(breast.x, breast.y, breast.w, breast.h) + revealD, breast, { ox: 110, oy: OY, seed: 31, hue: R ? [18, 30] : undefined, sat: [16, 26], lig: [44, 58], flat: '#d9c4b0', line: '#f3e9df', mortar: '#cfc6ba' });
    if (!R) o += path(rectD(breast.x, breast.y, breast.w, breast.h), `fill="none" ${OUT}`);

    const rid = c.id('rv');
    o += `<clipPath id="${rid}"><path d="${revealD}"/></clipPath><g clip-path="url(#${rid})">`;
    o += rect(150, 0, 300, 360, R ? `fill="${c.url('cavity')}"` : 'fill="#efe5db"');
    o += bricks(c, 'inner', rectD(150, 0, 300, 360), { x: 150, y: 0, w: 300, h: 360 }, { ox: 126, oy: 5, seed: 33, dark: R ? 0.62 : 0, flat: '#ecd3c6', line: '#f7ebe3', light: false });
    // old smoke chamber + clay flue (section)
    o += poly([[252, 150], [348, 150], [410, 296], [190, 296]], R ? `fill="${c.url('parge')}"` : `fill="#c9c1b9" ${OUT}`);
    o += rect(248, 0, 104, 150, R ? `fill="${c.url('linerSec')}"` : `fill="#e9a27c" ${OUT}`);
    o += rect(262, 0, 76, 150, R ? 'fill="#1a120e"' : 'fill="#f3ebe3"');
    let fj = ''; for (let y = 40; y < 150; y += 52) fj += `M248 ${y}H262M338 ${y}H352`;
    o += path(fj, `stroke="${R ? '#3d1a0c' : INK}" stroke-width="1.4"`);
    // block-off plate at old damper
    o += rect(188, 294, 224, 10, R ? `fill="${c.url('alu')}" filter="${c.url('shadow')}"` : `fill="#b9c2ca" ${OUT}`);
    // stainless flexible liner
    o += rect(282, 0, 36, 345, R ? `fill="${c.url('steel')}"` : `fill="#dfe4e8" ${OUT}`);
    o += rect(282, 0, 36, 345, R ? `fill="${c.url('corr')}"` : 'fill="none"');
    if (!R) { let cd = ''; for (let y = 6; y < 345; y += 8) cd += `M282 ${y}H318`; o += path(cd, 'stroke="#a7b0b8" stroke-width="1"'); }
    o += '</g>';
    if (R) o += `<g clip-path="url(#${rid})">${path(revealD, 'fill="none" stroke="#000" stroke-width="16" opacity=".45" filter="' + c.url('blur6') + '"')}${path(revealD, 'fill="none" stroke="#6d6156" stroke-width="6"')}</g>`;
    else o += path(revealD, `fill="none" ${OUT}`);

    // mantel beam
    o += rect(92, 334, 416, 30, R ? `fill="${c.url('wood')}" filter="${c.url('shadow')}"` : `fill="#a26b45" ${OUT}`);
    if (R) o += path('M96 342 Q 250 338 400 344 T 504 342M96 352 Q 220 356 360 350 T 504 354', 'stroke="#3d2412" stroke-width="1" fill="none" opacity=".5"') + rect(92, 334, 416, 3, 'fill="#fff" opacity=".18"');

    // hearth slab
    o += rect(84, 700, 432, 24, R ? `fill="${c.url('stone')}" filter="${c.url('shadow')}"` : `fill="#ddd6cc" ${OUT}`);
    // surround panel
    o += rect(160, 398, 280, 302, R ? `rx="4" fill="${c.url('iron')}" filter="${c.url('shadow')}"` : `rx="4" fill="#3d4146" ${OUT}`);
    if (R) o += rect(164, 402, 272, 3, 'fill="#fff" opacity=".12"');
    // insert body
    o += rect(198, 424, 204, 268, R ? `rx="6" fill="${c.url('ironH')}"` : `rx="6" fill="#55595f" ${OUT}`);
    // door frame + glass
    o += rect(216, 440, 168, 172, R ? 'rx="5" fill="#16181b"' : `rx="5" fill="#2e3236" ${OUT}`);
    const gid = c.id('gl');
    o += `<clipPath id="${gid}"><rect x="230" y="454" width="140" height="144" rx="3"/></clipPath><g clip-path="url(#${gid})">`;
    o += rect(230, 454, 140, 144, R ? 'fill="#1a0f0a"' : 'fill="#4a3f3a"');
    o += poly([[230, 454], [370, 454], [350, 474], [250, 474]], R ? 'fill="#0b0705"' : 'fill="#3a312d"');
    o += fire(c, 300, 596, 0.6);
    if (R) o += rect(230, 454, 140, 144, `fill="${c.url('glass')}"`);
    else o += path('M246 590L290 462M262 590L300 470', 'stroke="#fff" stroke-width="3" opacity=".35"');
    o += '</g>';
    // gasket rope
    o += rect(227, 451, 146, 150, `rx="4" fill="none" stroke="${R ? '#3e3a36' : '#8a837c'}" stroke-width="5"`);
    o += rect(227, 451, 146, 150, `rx="4" fill="none" stroke="${R ? '#77706a' : '#c9c2ba'}" stroke-width="5" stroke-dasharray="2 2.5"`);
    // handle
    o += rect(386, 500, 8, 54, R ? `rx="3" fill="${c.url('steel')}"` : `rx="3" fill="#c7ccd1" ${OUT}`);
    // blower grille
    o += rect(222, 624, 156, 54, R ? 'rx="4" fill="#1d1f22"' : `rx="4" fill="#3b3f44" ${OUT}`);
    let gd = ''; for (let x = 232; x < 372; x += 9) gd += `M${x} 632V670`;
    o += path(gd, `stroke="${R ? '#4d5258' : '#8b9198'}" stroke-width="3" stroke-linecap="round"`);
    if (R) o += rect(222, 624, 156, 54, 'rx="4" fill="#ff8a2a" opacity=".06"');
    o += overlays(c, W, H);

    const hits = {
      flexliner: { d: rectD(280, 0, 40, 334) },
      blockoff: { d: rectD(186, 288, 228, 20) },
      surround: { d: rectD(160, 398, 280, 302) + rectD(198, 424, 204, 268), rule: 'evenodd' },
      insert: { d: rectD(198, 424, 204, 268) + rectD(216, 440, 168, 172) + rectD(222, 624, 156, 54), rule: 'evenodd' },
      glass: { d: rectD(232, 456, 136, 140) },
      gasket: { d: rectD(216, 440, 168, 172) + rectD(232, 456, 136, 140), rule: 'evenodd' },
      blower: { d: rectD(222, 624, 156, 54) }
    };
    return { W, H, svg: o, hits };
  }


  /* =================================================================
     SCENE 4 — Chimney chase (framed, sided chase with metal chimney pipe)
     ================================================================= */
  function sidingFill(c, key, d, box, o) {
    o = o || {}; const R = c.real; const step = o.step || 16;
    const cid = c.id('sd-' + key);
    let s = `<clipPath id="${cid}"><path d="${d}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${cid})">`;
    s += rect(box.x, box.y, box.w, box.h, `fill="${R ? (o.base || '#d9ccb4') : (o.flat || '#efe3cc')}"`);
    let ln = '';
    for (let y = box.y + ((o.oy || 0) % step); y < box.y + box.h; y += step) {
      if (R) { s += rect(box.x, y, box.w, step * 0.45, 'fill="#fff" opacity=".10"'); s += rect(box.x, y + step - 2, box.w, 2, 'fill="#000" opacity=".22"'); }
      else ln += `M${box.x} ${y + step - 1}H${box.x + box.w}`;
    }
    if (!R) s += path(ln, `stroke="${o.line || '#cdbb9c'}" stroke-width="1.3"`);
    if (R && o.light !== false) s += rect(box.x, box.y, box.w, box.h, `fill="${c.url('lightL')}"`);
    return s + '</g>';
  }
  function chase(c) {
    const W = 600, H = 1000, R = c.real;
    const roofY = (x) => 520 + 0.18 * x;
    let o = defs(c);
    o += path(`M0 0H600V${roofY(600)}L0 ${roofY(0)}Z`, `fill="${R ? c.url('sky') : '#eef3f6'}"`);
    // house wall below the roof
    o += sidingFill(c, 'wall', `M0 ${roofY(0)}L600 ${roofY(600)}V1000H0Z`, { x: 0, y: 500, w: 600, h: 500 }, { base: '#e4dccb', flat: '#f6f0e4', line: '#e0d4bf', step: 18 });
    // window
    o += rect(430, 760, 120, 170, R ? 'fill="#f4f1ea"' : `fill="#fff" ${OUT}`) + rect(442, 772, 96, 146, R ? 'fill="#41505c"' : 'fill="#cfdbe3"') + rect(442, 843, 96, 4, R ? 'fill="#f4f1ea"' : `fill="#fff"`);
    if (R) o += poly([[442, 772], [500, 772], [442, 840]], 'fill="#fff" opacity=".12"');
    // roof band
    const band = (a, b) => [[-10, roofY(-10) + a], [610, roofY(610) + a], [610, roofY(610) + b], [-10, roofY(-10) + b]];
    o += poly(band(18, 34), R ? 'fill="#f1ede6"' : `fill="#fff" ${OUT}`);
    o += poly(band(8, 18), R ? 'fill="#d8b47f"' : `fill="#f3dfbf" ${OUT}`);
    o += poly(band(-2, 8), R ? `fill="${c.url('shingle')}"` : `fill="#5f646b" ${OUT}`);
    if (R) { let d = ''; for (let x = -10; x < 610; x += 14) d += `M${x} ${f(roofY(x) - 2)}L${x + 3} ${f(roofY(x + 3) + 8)}`; o += path(d, 'stroke="#18191b" stroke-width="1" opacity=".6"'); }

    // chase box with stepped cutaway along siding courses
    const cx0 = 230, cx1 = 370, top = 172, step = 16;
    const r = rng(19); const left = [], right = [];
    for (let y = 268; y < 812; y += step) {
      const L = 252 - Math.round(r() * 2) * 4, Rr = 348 + Math.round(r() * 2) * 4;
      left.push([L, y], [L, y + step]); right.unshift([Rr, y + step], [Rr, y]);
    }
    const reveal = left.concat(right); const revealD = polyD(reveal);
    const chaseD = rectD(cx0, top, cx1 - cx0, 1000 - top);
    o += sidingFill(c, 'chase', chaseD + revealD, { x: cx0, y: top, w: cx1 - cx0, h: 1000 - top }, { base: '#d3c3a4', flat: '#ecdcbc', line: '#c9b28b', oy: top });
    // corner trims
    o += rect(cx0, top, 9, 1000 - top, R ? 'fill="#e6dac3"' : `fill="#f6ecd8" ${OUT}`) + rect(cx1 - 9, top, 9, 1000 - top, R ? 'fill="#b9a787"' : `fill="#f6ecd8" ${OUT}`);
    if (!R) o += path(chaseD, `fill="none" ${OUT}`);
    // inside: framing, insulation, pipe
    const rid = c.id('rv');
    o += `<clipPath id="${rid}"><path d="${revealD}"/></clipPath><g clip-path="url(#${rid})">`;
    o += rect(230, 260, 140, 560, R ? `fill="${c.url('cavity')}"` : 'fill="#f3ebe3"');
    o += rect(244, 260, 112, 560, R ? 'fill="#c79c6c" opacity=".35"' : 'fill="#f6e7d2"');
    const stud = R ? `fill="${c.url('wood')}"` : `fill="#e2bf8d" ${OUT}`;
    o += rect(244, 260, 14, 560, stud) + rect(342, 260, 14, 560, stud);
    for (const y of [300, 470, 640, 790]) o += rect(244, y, 112, 12, stud);
    // metal chimney pipe
    o += rect(278, 172, 44, 660, R ? `fill="${c.url('steel')}"` : `fill="#dfe4e8" ${OUT}`);
    let jd = ''; for (let y = 330; y < 830; y += 130) jd += `M278 ${y}H322`;
    o += path(jd, R ? 'stroke="#5d646b" stroke-width="3"' : `stroke="${INK}" stroke-width="1.4"`);
    o += '</g>';
    if (R) o += `<g clip-path="url(#${rid})">${path(revealD, 'fill="none" stroke="#000" stroke-width="16" opacity=".4" filter="' + c.url('blur6') + '"')}${path(revealD, 'fill="none" stroke="#8a7a60" stroke-width="5"')}</g>`;
    else o += path(revealD, `fill="none" ${OUT}`);

    // flashing where chase meets roof
    const fl = (x0, x1) => poly([[x0, roofY(x0) - 2], [x1, roofY(x1) - 2], [x1, roofY(x1) - 26], [x0, roofY(x0) - 26]], R ? `fill="${c.url('alu')}" filter="${c.url('shadow')}"` : `fill="#b9c2ca" ${OUT}`);
    o += fl(230, 252) + fl(348, 370);
    o += poly([[200, roofY(200) - 3], [230, roofY(230) - 3], [230, roofY(230) + 3], [200, roofY(200) + 3]], R ? `fill="${c.url('alu')}"` : `fill="#b9c2ca" ${OUT}`);
    o += poly([[370, roofY(370) - 3], [400, roofY(400) - 3], [400, roofY(400) + 3], [370, roofY(370) + 3]], R ? `fill="${c.url('alu')}"` : `fill="#b9c2ca" ${OUT}`);

    // chase cover (metal pan with drip edge)
    o += poly([[220, 158], [380, 158], [384, 176], [216, 176]], R ? `fill="${c.url('ironH')}" filter="${c.url('shadow')}"` : `fill="#4a4f55" ${OUT}`);
    if (R) o += rect(220, 158, 160, 3, 'fill="#fff" opacity=".25"');
    // decorative shroud: base, screened band, hip roof
    o += rect(236, 128, 128, 30, R ? `fill="${c.url('ironH')}"` : `fill="#3f4449" ${OUT}`);
    o += rect(244, 98, 112, 30, R ? `fill="${c.url('mesh')}"` : `fill="#f1f3f5" ${OUT}`);
    if (!R) { let md = ''; for (let x = 250; x < 356; x += 7) md += `M${x} 98V128`; for (let y = 104; y < 128; y += 7) md += `M244 ${y}H356`; o += path(md, 'stroke="#8f979f" stroke-width="1"'); }
    for (const x of [242, 296, 350]) o += rect(x, 98, 8, 30, R ? 'fill="#25282c"' : 'fill="#3f4449"');
    o += poly([[214, 100], [386, 100], [340, 62], [260, 62]], R ? `fill="${c.url('ironH')}" filter="${c.url('shadow')}"` : `fill="#3f4449" ${OUT}`);
    if (R) o += poly([[260, 62], [340, 62], [346, 67], [254, 67]], 'fill="#fff" opacity=".3"');
    o += overlays(c, W, H);

    const hits = {
      shroud: { d: rectD(212, 58, 176, 100) },
      chasecover: { d: rectD(214, 156, 172, 22) },
      chase: { d: chaseD + revealD, rule: 'evenodd' },
      pipe: { d: rectD(276, 260, 48, 560) },
      flashing: { d: polyD([[198, roofY(198) - 28], [254, roofY(254) - 28], [254, roofY(254) + 6], [198, roofY(198) + 6]]) + polyD([[346, roofY(346) - 28], [402, roofY(402) - 28], [402, roofY(402) + 6], [346, roofY(346) + 6]]) }
    };
    return { W, H, svg: o, hits };
  }

  window.CX_SCENES = {
    render(type, style) {
      const c = makeCtx(style === 'real');
      const fn = { masonry, wood, insert, chase }[type];
      return fn(c);
    }
  };
})();
