/* Procedural flat-graphic pizzas, drawn from the actual toppings on the menu.
   Coordinate space: centred at 0,0, crust radius 97. */
(function () {
  const C = {
    crust: "#DFA75A", crustEdge: "#B9783A", bake: "#A1622A",
    sauce: "#C9341D", cheese: "#F5DC9E", cheeseBrown: "#E3B468"
  };

  function rng(seed) {
    let s = (seed >>> 0) || 7;
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  }
  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  const f = (n) => Math.round(n * 10) / 10;

  function smoothClosed(pts) {
    const n = pts.length;
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
    }
    return d + "Z";
  }
  function blob(cx, cy, r, amp, n, R) {
    const ph = R() * 6.283, ph2 = R() * 6.283, pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rr = r * (1 + amp * (Math.sin(a * 3 + ph) * 0.5 + Math.sin(a * 5 + ph2) * 0.3 + (R() - 0.5) * 0.6));
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return smoothClosed(pts);
  }
  function inDisk(R, rad) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R()) * rad;
    return [Math.cos(a) * r, Math.sin(a) * r];
  }
  const leaf = (c) => `<path d="M-9 0C-5-6 5-6 9 0C5 6-5 6-9 0z" fill="${c}"/><path d="M-7.5 0H7" stroke="rgba(255,255,255,.3)" stroke-width="1"/>`;

  /* Each drawer returns markup centred on 0,0 plus an approximate radius for spacing. */
  const D = {
    pepperoni: [12, (R) => `<circle r="11.5" fill="#AE2817"/><circle r="9.6" fill="#BF3820"/><circle r="1.4" cx="${f(R() * 8 - 4)}" cy="${f(R() * 8 - 4)}" fill="#8C1E10"/><circle r="1.1" cx="${f(R() * 8 - 4)}" cy="${f(R() * 8 - 4)}" fill="#8C1E10"/><circle r="1.2" cx="${f(R() * 8 - 4)}" cy="${f(R() * 8 - 4)}" fill="#D9573C"/>`],
    skinke: [9, (R) => `<path d="${blob(0, 0, 8, 0.2, 8, R)}" fill="#EDA79A" stroke="#D6877A" stroke-width="1.2"/>`],
    champignon: [9, () => `<path d="M-9 1.5a9 8 0 0 1 18 0z" fill="#CDB28C"/><path d="M-3.2 1.5h6.4l-.8 7h-4.8z" fill="#EDE0CA"/><path d="M-6.5 1.5h13" stroke="#A88B64" stroke-width="1"/>`],
    kebab: [10, () => `<rect x="-10" y="-3" width="20" height="6" rx="3" fill="#86442A"/><path d="M-6.5 -.6h11" stroke="#B06A40" stroke-width="1.4" stroke-linecap="round"/>`],
    kylling: [7.5, (R) => `<path d="${blob(0, 0, 6.6, 0.25, 8, R)}" fill="#F4E0B4" stroke="#D3AA6E" stroke-width="1.2"/>`],
    bacon: [11, () => { const p = "M-11 0q2.75-4 5.5 0t5.5 0 5.5 0 5.5 0"; return `<path d="${p}" fill="none" stroke="#B6463A" stroke-width="6" stroke-linecap="round"/><path d="${p}" fill="none" stroke="#F0BCAC" stroke-width="1.6" stroke-linecap="round"/>`; }],
    "løg": [8, () => `<path d="M-7 3a7.5 7.5 0 0 1 14 0" fill="none" stroke="#B989BB" stroke-width="2.2" stroke-linecap="round"/><path d="M-4 3a4.4 4.4 0 0 1 8 0" fill="none" stroke="#DCC0DA" stroke-width="1.6" stroke-linecap="round"/>`],
    paprika: [8, (R) => `<path d="M-8 2q8-9 16 0" fill="none" stroke="${R() < 0.5 ? "#4E9A3A" : "#E3492A"}" stroke-width="4" stroke-linecap="round"/>`],
    ananas: [8, () => `<path d="M-7 5 0-7 7 5z" fill="#F5C63E" stroke="#DCA52A" stroke-width="1.4" stroke-linejoin="round"/>`],
    jalapenos: [7, () => `<circle r="6.2" fill="#93C45E" stroke="#4E8B2E" stroke-width="2.2"/><circle r="1" cx="-1.8" cy="-1" fill="#F2EEC4"/><circle r="1" cx="1.8" cy="-.6" fill="#F2EEC4"/><circle r="1" cy="2" fill="#F2EEC4"/>`],
    "kødboller": [8, () => `<circle r="7.5" fill="#743820"/><circle r="2.3" cx="-2.4" cy="-2.6" fill="#9A5634"/>`],
    oliven: [6, () => `<circle r="5" fill="none" stroke="#2A241F" stroke-width="3.4"/>`],
    gorgonzola: [7, (R) => `<path d="${blob(0, 0, 6.2, 0.28, 8, R)}" fill="#F6F4EA"/><circle r="1.1" cx="-1.6" fill="#6A8A9E"/><circle r=".9" cx="2" cy="1.6" fill="#6A8A9E"/>`],
    tun: [7, (R) => `<path d="${blob(0, 0, 6.2, 0.32, 8, R)}" fill="#D4B4A6" stroke="#B38B7D" stroke-width="1"/>`],
    "cocktailpølser": [9, () => `<rect x="-8" y="-3.2" width="16" height="6.4" rx="3.2" fill="#C8573A"/><path d="M-5 -1h9" stroke="#E68E6E" stroke-width="1.2" stroke-linecap="round"/>`],
    "pølser": [7, () => `<circle r="6.5" fill="#BF5E3E"/><circle r="4.3" fill="#D98463"/>`],
    tomat: [10, () => `<circle r="9.5" fill="#E14F2E"/><circle r="6.6" fill="none" stroke="#F28C6B" stroke-width="1.6"/><circle r="1" cx="-2" cy="-1" fill="#F7C9A0"/><circle r="1" cx="2.2" cy="1.2" fill="#F7C9A0"/>`],
    spinat: [9, () => leaf("#2D6834")],
    artiskok: [8, () => `<path d="M0-8C5.5-4 5.5 4 0 8C-5.5 4-5.5-4 0-8z" fill="#8E9C52"/><path d="M0-6.5v13" stroke="#6C7A39" stroke-width="1"/>`],
    kartofler: [9, () => `<circle r="8.5" fill="#F3E2A8" stroke="#DBC078" stroke-width="1.4"/>`],
    chili: [5, () => `<path d="M-4 0q4-3 8 0" fill="none" stroke="#E2361C" stroke-width="2.2" stroke-linecap="round"/>`]
  };
  const DRIZZLE = { bearnaise: "#F3CA4E", tacosauce: "#EE7C2C", pesto: "#4F8D38", dressing: "#FFF8EA" };
  const SPECKLE = { "hvidløg": ["#FFF6E2", 1.5, 22], "kødsauce": ["#7A3A22", 2.2, 34], salat: ["#76B347", 0, 26] };
  const ALIAS = { "friske tomater": "tomat" };

  function ingredients(desc, opts = {}) {
    const out = [];
    (desc || "").toLowerCase().split(/,\s*/).forEach((t) => {
      t = ALIAS[t.trim()] || t.trim();
      if (t && (D[t] || DRIZZLE[t] || SPECKLE[t])) out.push(t);
    });
    if (opts.salad) out.push("salat", "dressing");
    return out;
  }

  function base(seed) {
    const R = rng(seed);
    let s = `<circle r="97" fill="${C.crust}"/><circle r="96" fill="none" stroke="${C.crustEdge}" stroke-opacity=".35" stroke-width="2"/>`;
    for (let i = 0; i < 46; i++) {
      const a = R() * Math.PI * 2, r = 87 + R() * 8;
      s += `<circle cx="${f(Math.cos(a) * r)}" cy="${f(Math.sin(a) * r)}" r="${f(0.8 + R() * 1.8)}" fill="${C.bake}" opacity="${f(0.2 + R() * 0.4)}"/>`;
    }
    s += `<path d="${blob(0, 0, 85, 0.025, 48, R)}" fill="${C.sauce}"/>`;
    s += `<path d="${blob(0, 0, 77, 0.06, 40, R)}" fill="${C.cheese}"/>`;
    for (let i = 0; i < 16; i++) {
      const [x, y] = inDisk(R, 66);
      s += `<path d="${blob(x, y, 3 + R() * 5, 0.3, 10, R)}" fill="${C.cheeseBrown}" opacity=".55"/>`;
    }
    for (let i = 0; i < 8; i++) {
      const [x, y] = inDisk(R, 66);
      s += `<path d="${blob(x, y, 1.6 + R() * 3.6, 0.3, 9, R)}" fill="${C.sauce}" opacity=".85"/>`;
    }
    return s;
  }

  function drizzle(R, color, ps = 1) {
    const ang = R() * Math.PI, ca = Math.cos(ang), sa = Math.sin(ang), steps = 9, pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = -60 + (120 * i) / steps;
      const lim = Math.sqrt(Math.max(0, 68 * 68 - t * t));
      const o = (i % 2 ? 1 : -1) * lim * (0.55 + R() * 0.3);
      pts.push([t * ca - o * sa, t * sa + o * ca]);
    }
    let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += `Q${f(pts[i][0])},${f(pts[i][1])} ${f(mx)},${f(my)}`;
    }
    return `<g class="tp-wrap"><path class="dz" pathLength="1" d="${d}" fill="none" stroke="${color}" stroke-width="${f(2.8 * ps)}" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/></g>`;
  }

  function toppings(list, seed, density = 1, ps = 1) {
    const R = rng(seed ^ 0x9e3779b9);
    const pieces = list.filter((k) => D[k]);
    const placed = [];
    let s = "";
    // speckles first (under the chunky pieces)
    list.filter((k) => SPECKLE[k]).forEach((k) => {
      const [col, r, n] = SPECKLE[k];
      for (let i = 0; i < Math.round(n * density); i++) {
        const [x, y] = inDisk(R, 70);
        const inner = k === "salat"
          ? `<path d="M-4 0q2-2.5 4 0t4 0" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round"/>`
          : `<circle r="${f(r * (0.7 + R() * 0.6))}" fill="${col}"/>`;
        s += `<g class="tp-wrap" transform="translate(${f(x)} ${f(y)}) rotate(${Math.round(R() * 360)})${ps !== 1 ? ` scale(${ps})` : ""}"><g class="tp">${inner}</g></g>`;
      }
    });
    if (pieces.length) {
      const total = Math.round((pieces.length === 1 ? 17 : 22) * density);
      const per = Math.max(3, Math.round(total / pieces.length));
      pieces.forEach((k) => {
        const [rad0, draw] = D[k]; const rad = rad0 * ps;
        for (let i = 0; i < per; i++) {
          let best = null;
          for (let tries = 0; tries < 40; tries++) {
            const p = inDisk(R, 70 - rad * 0.4);
            const ok = placed.every(([x, y, rr]) => Math.hypot(p[0] - x, p[1] - y) > (rr + rad) * 0.78);
            if (ok) { best = p; break; }
          }
          if (!best) continue;
          placed.push([best[0], best[1], rad]);
          s += `<g class="tp-wrap" transform="translate(${f(best[0])} ${f(best[1])}) rotate(${Math.round(R() * 360)})${ps !== 1 ? ` scale(${ps})` : ""}"><g class="tp">${draw(R)}</g></g>`;
        }
      });
    }
    list.filter((k) => DRIZZLE[k]).forEach((k) => { s += drizzle(R, DRIZZLE[k], ps); });
    return s;
  }

  function mini(item, opts) {
    const seed = hash(item.n + item.name);
    const list = ingredients(item.desc, opts);
    return `<svg class="mini" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false"><g class="mini-rot">${base(seed)}${toppings(list, seed, 0.5, 1.55)}</g></svg>`;
  }

  window.Pizza = { base, toppings, ingredients, mini, hash };
})();
