(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PHONE = "55 76 65 65";
  const SIZE_WORD = { alm: "alm.", deep: "deep", fam: "familie" };
  const SIZE_LONG = { alm: "almindelig", deep: "deep", fam: "familie" };
  const kr = (n) => `${n},-`;
  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------ data */
  const items = [];               // flat list
  const byKey = new Map();
  MENU.categories.forEach((cat) => {
    cat.items = cat.items.map(([n, name, desc, prices], i) => {
      const it = { key: `${cat.id}-${n || i}`, n, name, desc, prices, cat };
      items.push(it); byKey.set(it.key, it); return it;
    });
  });
  MENU.offers.forEach((o) => byKey.set(`offer-${o.id}`, { key: `offer-${o.id}`, n: "", name: o.name, desc: o.desc, prices: [o.price], cat: { id: "offers" } }));

  let size = localStorage.getItem("lundby-size") || "alm";
  const priceFor = (it, sz = size) => {
    const s = it.cat.sizes;
    if (!s) return it.prices[0];
    const i = s.indexOf(sz);
    return it.prices[i >= 0 ? i : 0];
  };

  /* ------------------------------------------------------------ open status */
  const DAYS = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
  const OPEN = 16 * 60, CLOSE = 20 * 60 + 30;
  function cphNow() {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Copenhagen", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday"));
    return { day: wd, min: +g("hour") * 60 + +g("minute") };
  }
  function status() {
    const { day, min } = cphNow();
    const closedDay = day === 1;
    const open = !closedDay && min >= OPEN && min < CLOSE;
    let text, short, sign;
    if (open) {
      const left = CLOSE - min;
      text = left <= 45 ? `Åbent · lukker om ${left} min` : "Åbent nu · til 20.30";
      short = left <= 45 ? `Lukker om ${left} min` : "Åbent til 20.30";
      sign = ["Vi har", "Åbent", "til kl. 20.30"];
    } else if (!closedDay && min < OPEN) {
      text = "Åbner i dag kl. 16"; short = "Åbner kl. 16";
      sign = ["Vi har", "Lukket", "åbner i dag kl. 16"];
    } else {
      const next = (day + 1) % 7 === 1 ? "tirsdag" : "i morgen";
      text = closedDay ? "Mandag lukket · åbner i morgen 16" : `Lukket · åbner ${next} kl. 16`;
      short = "Lukket nu";
      sign = ["Vi har", "Lukket", `åbner ${next} kl. 16`];
    }
    const st = $("[data-status]");
    st.classList.toggle("open", open); st.classList.toggle("closed", !open);
    $("[data-status-text]").innerHTML = `<span class="s-long">${text}</span><span class="s-short">${short}</span>`;
    const sg = $("[data-sign]");
    sg.dataset.state = open ? "open" : "closed";
    $("[data-sign-top]").textContent = sign[0];
    $("[data-sign-main]").textContent = sign[1];
    $("[data-sign-bottom]").textContent = sign[2];
    // static strings only
    $("[data-hours]").innerHTML = `<li class="${closedDay ? "" : "today"}"><span>Tirsdag – søndag</span><span>16.00 – 20.30</span></li><li class="${closedDay ? "today" : ""}"><span>Mandag</span><span>Lukket</span></li>`;
  }
  status(); setInterval(status, 60000);

  /* ------------------------------------------------------------ header */
  const top = $("[data-top]");
  const onScrollTop = () => top.classList.toggle("scrolled", scrollY > 10);
  addEventListener("scroll", onScrollTop, { passive: true }); onScrollTop();

  /* ------------------------------------------------------------ rolling text */
  function roll(el, text, dir = 1) {
    const cur = el.firstElementChild;
    if (cur && cur.textContent === String(text)) return;
    const nxt = document.createElement("span"); nxt.textContent = text;
    if (reduce || !cur) { el.replaceChildren(nxt); return; }
    el.appendChild(nxt);
    nxt.style.position = "absolute"; nxt.style.left = getComputedStyle(el).paddingLeft; nxt.style.top = getComputedStyle(el).paddingTop;
    const opts = { duration: 560, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" };
    cur.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${-100 * dir}%)`, opacity: 0 }], opts);
    nxt.animate([{ transform: `translateY(${100 * dir}%)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], opts).onfinish = () => {
      cur.remove(); nxt.style.position = ""; nxt.style.left = ""; nxt.style.top = "";
    };
  }
  function rollSlot(slot, text) {
    // animate the slot width so the sentence re-flows smoothly
    const probe = document.createElement("span"); probe.textContent = text;
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
    slot.appendChild(probe);
    const w = probe.getBoundingClientRect().width; probe.remove();
    const cs = getComputedStyle(slot);
    slot.style.width = `${slot.getBoundingClientRect().width}px`;
    requestAnimationFrame(() => { slot.style.width = `${w + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)}px`; });
    roll(slot, text);
  }

  /* ------------------------------------------------------------ hero pizza */
  const svg = $("#heroPizza");
  const SL = 8, PULL = 1, GAP = 0.7, RAD = 104;
  const pol = (a, r) => [Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r];
  const ang = (i) => [i * 45 - 90 + GAP / 2, (i + 1) * 45 - 90 - GAP / 2];
  const wedgeD = (i, rad = RAD) => { const [a0, a1] = ang(i), p0 = pol(a0, rad), p1 = pol(a1, rad); return `M0 0L${p0[0].toFixed(2)} ${p0[1].toFixed(2)}A${rad} ${rad} 0 0 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}Z`; };
  let defs = "";
  for (let i = 0; i < SL; i++) defs += `<clipPath id="w${i}"><path d="${wedgeD(i)}"/></clipPath>`;
  const slice = (i) => `<g class="slice" clip-path="url(#w${i})"><g class="base"></g><g class="tops"></g></g>`;
  let body = ""; for (let i = 0; i < SL; i++) if (i !== PULL) body += slice(i);
  svg.innerHTML = `<defs>${defs}</defs>
    <g class="spin"><g class="body">${body}</g><path class="pull-shadow" d="${wedgeD(PULL)}" fill="#5a2a10" opacity="0"/><g class="strings"></g><g class="pulled">${slice(PULL)}</g></g>`;
  const baseMarkup = Pizza.base(1997);
  $$(".base", svg).forEach((g) => (g.innerHTML = baseMarkup));
  const pulled = $(".pulled", svg), strings = $(".strings", svg), pshadow = $(".pull-shadow", svg);
  pshadow.setAttribute("d", wedgeD(PULL, 97));

  function setToppings(it, animate) {
    const list = Pizza.ingredients(it.desc, { salad: it.cat.salad });
    const markup = Pizza.toppings(list, Pizza.hash(it.n + it.name), 1.15);
    $$(".tops", svg).forEach((g) => {
      const old = Array.from(g.children);
      if (animate && !reduce) {
        old.forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: "forwards" }).onfinish = () => el.remove());
      } else old.forEach((el) => el.remove());
      const frag = document.createElementNS("http://www.w3.org/2000/svg", "g");
      frag.innerHTML = markup;
      const fresh = Array.from(frag.children);
      fresh.forEach((el) => g.appendChild(el));
      if (animate && !reduce) {
        fresh.forEach((wrap, k) => {
          const dz = wrap.querySelector(".dz");
          if (dz) {
            dz.style.strokeDasharray = "1"; 
            dz.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, delay: 380 + k * 8, easing: "cubic-bezier(.6,0,.2,1)", fill: "both" });
            return;
          }
          const tp = wrap.firstElementChild;
          tp.animate([{ transform: "scale(0) rotate(-40deg)", opacity: 0 }, { transform: "scale(1.15)", opacity: 1, offset: .7 }, { transform: "scale(1) rotate(0)", opacity: 1 }],
            { duration: 520, delay: 160 + k * 14, easing: "cubic-bezier(.2,.8,.3,1)", fill: "both" });
        });
      }
    });
  }

  // slice pulled out on scroll, with stretching cheese strings
  const [pa0, pa1] = ang(PULL), mid = (pa0 + pa1) / 2;
  const dirv = pol(mid, 1);
  const anchors = [[pa0, 34], [pa0, 58], [pa0, 76], [pa1, 30], [pa1, 52], [pa1, 72]];
  function pullSlice(p) {
    const d = p * 58;
    const dx = dirv[0] * d, dy = dirv[1] * d;
    pulled.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)}) rotate(${(p * 6).toFixed(2)})`);
    pshadow.setAttribute("transform", `translate(${(dx + 3 * p).toFixed(2)} ${(dy + 9 * p).toFixed(2)}) rotate(${(p * 6).toFixed(2)})`);
    pshadow.setAttribute("opacity", (Math.min(1, p * 4) * 0.13).toFixed(3));
    if (p < 0.02) { strings.innerHTML = ""; return; }
    const w = Math.max(0.6, 3.4 - p * 3), op = p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1;
    strings.innerHTML = anchors.map(([a, r], k) => {
      const [bx, by] = pol(a, r);
      const ex = bx + dx, ey = by + dy;
      const sag = (k % 2 ? 1 : -1) * 3 + 6 * p;
      const mx = (bx + ex) / 2 + dirv[1] * sag, my = (by + ey) / 2 - dirv[0] * sag + 4 * p;
      return `<path d="M${bx.toFixed(1)} ${by.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#F6DFA4" stroke-width="${(w * (k % 3 === 1 ? 1.3 : 1)).toFixed(2)}" stroke-linecap="round" fill="none" opacity="${op.toFixed(2)}"/>`;
    }).join("");
  }
  const hero = $(".hero"), heroPizza = $(".hero-pizza");
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const h = hero.offsetHeight;
      const p = Math.min(1, Math.max(0, scrollY / (h * 0.55)));
      pullSlice(reduce ? 0 : p);
      if (!reduce && document.documentElement.classList.contains("settled")) heroPizza.style.transform = `translateY(${(scrollY * 0.12).toFixed(1)}px)`;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* hero order cycle */
  const ORDERS = [["pizza-7", "fam"], ["pizza-24", "deep"], ["pizza-1", "alm"], ["pizza-17", "fam"], ["mexicansk-30", "deep"], ["pizza-13", "alm"], ["pizza-22", "fam"], ["pizza-8", "deep"], ["salatpizza-33", "fam"], ["pizza-14", "alm"], ["mexicansk-32", "fam"], ["pizza-4", "deep"]];
  let oi = 0, heroItem, heroSize;
  const cap = $("[data-caption]"), slotNum = $('[data-slot="num"]'), slotSize = $('[data-slot="size"]');
  function showOrder(i, animate) {
    const [key, sz] = ORDERS[i]; heroItem = byKey.get(key); heroSize = sz;
    if (animate) { rollSlot(slotNum, heroItem.n); rollSlot(slotSize, SIZE_WORD[sz]); }
    else { slotNum.firstElementChild.textContent = heroItem.n; slotSize.firstElementChild.textContent = SIZE_WORD[sz]; }
    $(".oc-name", cap).textContent = heroItem.name;
    $(".oc-desc", cap).textContent = heroItem.desc || "tomatsauce og ost";
    $(".oc-price", cap).textContent = `${SIZE_WORD[sz]} ${kr(priceFor(heroItem, sz))}`;
    $("#hero-title").setAttribute("aria-label", `Nummer ${heroItem.n}, ${SIZE_LONG[sz]}, tak.`);
    if (animate) { cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap"); }
    setToppings(heroItem, animate);
  }
  showOrder(0, false);
  let cycle = null, heroVisible = true, paused = false;
  function startCycle() {
    if (reduce || cycle) return;
    cycle = setInterval(() => { if (!heroVisible || paused || document.hidden) return; oi = (oi + 1) % ORDERS.length; showOrder(oi, true); }, 3600);
  }
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting), { threshold: 0.2 }).observe(hero);
  $(".hero-copy").addEventListener("pointerenter", () => (paused = true));
  $(".hero-copy").addEventListener("pointerleave", () => (paused = false));
  $("[data-hero-add]").addEventListener("click", (e) => addToBong(heroItem, heroSize, e.currentTarget));

  /* ------------------------------------------------------------ ticker */
  const names = [...new Set(items.filter((i) => i.cat.pizza).map((i) => i.name))];
  const track = $("[data-ticker]");
  const chunk = names.map((n) => `<span>${n}</span>`).join("");
  track.innerHTML = chunk + chunk;
  let tickerAnim = null, lastY = scrollY, boost = 0;
  if (!reduce) {
    tickerAnim = track.animate([{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }], { duration: 70000, iterations: Infinity });
    (function loop() {
      const v = Math.abs(scrollY - lastY); lastY = scrollY;
      boost = boost * 0.9 + v * 0.06;
      tickerAnim.playbackRate = 1 + Math.min(boost, 6);
      requestAnimationFrame(loop);
    })();
  }

  /* ------------------------------------------------------------ offers */
  $("[data-offers]").innerHTML = MENU.offers.map((o) => `
    <li class="offer" data-reveal data-key="offer-${o.id}">
      <span class="of-price">${kr(o.price)}</span>
      <div class="of-body"><h3 class="of-name">${o.name}</h3><p class="of-desc">${o.desc}</p></div>
      <button class="add" type="button" data-add="offer-${o.id}" aria-label="Læg ${o.name} på bongen">+</button>
    </li>`).join("");
  $$(".offer").forEach((li) => li.addEventListener("click", (e) => {
    if (e.target.closest(".add")) return;
    li.querySelector(".add").click();
  }));

  /* ------------------------------------------------------------ menu */
  const catsEl = $("[data-cats]"), navEl = $("[data-catnav]");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function priceCell(it) {
    if (it.cat.noAdd && it.cat.sizes) {
      return `<span class="duo">${it.prices.map((p, i) => `<span>${it.cat.sizes[i] === "fam" ? "fam" : "alm"}</span> ${kr(p)}`).join("<br>")}</span>`;
    }
    return `<span class="price-wrap"><span class="price" data-price="${it.key}"><span>${kr(priceFor(it))}</span></span></span>`;
  }
  catsEl.innerHTML = MENU.categories.map((cat) => `
    <section class="cat ${cat.pizza ? "is-pizza" : ""}" id="c-${cat.id}" data-cat="${cat.id}" aria-labelledby="h-${cat.id}">
      <div class="cat-head"><h3 id="h-${cat.id}">${cat.title}</h3>${cat.note ? `<p>${cat.note}</p>` : ""}</div>
      <ul class="items">
        ${cat.items.map((it) => `
          <li class="item" data-item="${it.key}">
            <span class="no">${it.n ? esc(it.n) : ""}</span>
            ${cat.pizza ? Pizza.mini(it, { salad: cat.salad }) : `<span class="no-mini"></span>`}
            <div class="txt"><h4>${esc(it.name)}</h4>${it.desc ? `<p>${esc(it.desc)}</p>` : ""}</div>
            ${priceCell(it)}
            ${cat.noAdd ? "" : `<button class="add" type="button" data-add="${it.key}" aria-label="Læg ${it.n ? "nr. " + esc(it.n) + " " : ""}${esc(it.name)} på bongen">+</button>`}
          </li>`).join("")}
      </ul>
    </section>`).join("");
  navEl.innerHTML = MENU.categories.map((c) => `<a href="#c-${c.id}" data-nav="${c.id}">${c.nav}<small>${c.items.length}</small></a>`).join("");

  // size toggle
  const sizesEl = $("[data-sizes]"), pill = $(".sizes-pill", sizesEl);
  function placePill() {
    const b = $(`[data-size="${size}"]`, sizesEl);
    pill.style.width = `${b.offsetWidth}px`;
    pill.style.transform = `translateX(${b.offsetLeft - 4}px)`;
  }
  function setSize(sz, animate) {
    const prevIdx = ["alm", "deep", "fam"].indexOf(size);
    size = sz; localStorage.setItem("lundby-size", sz);
    $$("button", sizesEl).forEach((b) => b.setAttribute("aria-checked", String(b.dataset.size === sz)));
    placePill();
    const dir = ["alm", "deep", "fam"].indexOf(sz) >= prevIdx ? 1 : -1;
    $$("[data-price]").forEach((el, k) => {
      const it = byKey.get(el.dataset.price);
      if (!it.cat.sizes) return;
      if (animate) setTimeout(() => roll(el, kr(priceFor(it)), dir), Math.min(k, 40) * 12);
      else el.firstElementChild.textContent = kr(priceFor(it));
    });
  }
  sizesEl.addEventListener("click", (e) => { const b = e.target.closest("[data-size]"); if (b && b.dataset.size !== size) setSize(b.dataset.size, true); });
  sizesEl.addEventListener("keydown", (e) => {
    const order = ["alm", "deep", "fam"]; let i = order.indexOf(size);
    if (e.key === "ArrowRight") i = Math.min(2, i + 1); else if (e.key === "ArrowLeft") i = Math.max(0, i - 1); else return;
    e.preventDefault(); setSize(order[i], true); $(`[data-size="${order[i]}"]`, sizesEl).focus();
  });
  setSize(size, false);
  addEventListener("resize", placePill);
  document.fonts && document.fonts.ready.then(placePill);

  // search
  const search = $("[data-search]"), emptyEl = $("[data-empty]");
  const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  search.addEventListener("input", () => {
    const q = norm(search.value.trim());
    let any = false;
    MENU.categories.forEach((cat) => {
      let hits = 0;
      cat.items.forEach((it) => {
        const li = $(`[data-item="${it.key}"]`);
        const hay = norm(`${it.n} ${it.name} ${it.desc} ${cat.title}`);
        const ok = !q || (/^\d+[a-z]?$/.test(q) ? norm(it.n) === q : hay.includes(q));
        li.hidden = !ok; if (ok) hits++;
        const h4 = $("h4", li), p = $("p", li);
        h4.innerHTML = mark(it.name, q); if (p) p.innerHTML = mark(it.desc, q);
      });
      $(`#c-${cat.id}`).hidden = hits === 0;
      $(`[data-nav="${cat.id}"]`).classList.toggle("dim", hits === 0);
      if (hits) any = true;
    });
    emptyEl.hidden = any;
  });
  function mark(text, q) {
    if (!q || /^\d/.test(q)) return esc(text);
    const i = norm(text).indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }

  // active category
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === e.target.dataset.cat));
      const a = $(`[data-nav="${e.target.dataset.cat}"]`);
      if (a && navEl.scrollWidth > navEl.clientWidth) navEl.scrollTo({ left: a.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" });
    });
  }, { rootMargin: "-35% 0px -60% 0px" });
  $$(".cat").forEach((c) => navObs.observe(c));

  /* ------------------------------------------------------------ bong */
  const bong = $("[data-bong]"), linesEl = $("[data-bong-lines]"), fab = $("[data-bong-toggle]"), paper = $("[data-paper]");
  let lines = [];
  try { lines = JSON.parse(localStorage.getItem("lundby-bong") || "[]").filter((l) => byKey.has(l.key)); } catch (e) { lines = []; }
  const save = () => localStorage.setItem("lundby-bong", JSON.stringify(lines));
  const lineSize = (it, sz) => (it.cat.sizes ? sz : null);

  function addToBong(it, sz, fromEl) {
    const s = lineSize(it, sz || size);
    const id = `${it.key}|${s || ""}`;
    const ex = lines.find((l) => l.id === id);
    if (ex) ex.qty++; else lines.push({ id, key: it.key, size: s, qty: 1 });
    save(); renderBong(true);
    if (fromEl) { fly(fromEl); fromEl.classList.add("done"); const t = fromEl.textContent; if (fromEl.classList.contains("add")) { fromEl.textContent = "✓"; setTimeout(() => { fromEl.textContent = t; fromEl.classList.remove("done"); }, 900); } }
  }
  function fly(fromEl) {
    if (reduce) return;
    const a = fromEl.getBoundingClientRect(), b = fab.getBoundingClientRect();
    const dot = document.createElement("span"); dot.className = "flyer"; document.body.appendChild(dot);
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + 40, y1 = b.top + b.height / 2;
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 120;
    dot.animate([
      { transform: `translate(${x0}px,${y0}px) scale(1)` },
      { transform: `translate(${mx}px,${my}px) scale(1.3)`, offset: 0.45 },
      { transform: `translate(${x1}px,${y1}px) scale(.4)` }
    ], { duration: 700, easing: "cubic-bezier(.5,0,.3,1)" }).onfinish = () => {
      dot.remove(); fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump");
    };
    dot.style.left = "0"; dot.style.top = "0";
  }
  function renderBong(changed) {
    let total = 0, count = 0;
    linesEl.innerHTML = lines.map((l) => {
      const it = byKey.get(l.key), p = priceFor(it, l.size || "alm") * l.qty;
      total += p; count += l.qty;
      const label = `${it.n ? `Nr. ${it.n} ` : ""}${it.name}`;
      return `<li data-line="${l.id}"><span class="p-qty"><button type="button" data-dec aria-label="Én mindre">−</button><b>${l.qty}</b><button type="button" data-inc aria-label="Én mere">+</button></span>
        <span class="p-name">${esc(label)}${l.size ? `<small>${SIZE_LONG[l.size]}</small>` : it.desc && it.cat.id === "offers" ? `<small>${esc(it.desc)}</small>` : ""}</span><span class="p-sum">${kr(p)}</span></li>`;
    }).join("");
    $("[data-bong-total]").textContent = kr(total);
    $("[data-bong-count]").textContent = count;
    $("[data-bong-fabtotal]").textContent = count ? kr(total) : "";
    bong.classList.toggle("empty", !count);
    bong.classList.toggle("has-items", count > 0);
    $("[data-bong-say]").innerHTML = count ? `<b>NÅR DU RINGER, SÅ SIG</b>${lines.map((l) => { const it = byKey.get(l.key); return `${l.qty} × ${it.n ? "nr. " + esc(it.n) : esc(it.name)}${l.size ? ", " + SIZE_LONG[l.size] : ""}`; }).join("<br>")}` : "";
    if (!changed) $$("li", linesEl).forEach((li) => (li.style.animation = "none"));
  }
  linesEl.addEventListener("click", (e) => {
    const li = e.target.closest("[data-line]"); if (!li) return;
    const l = lines.find((x) => x.id === li.dataset.line);
    if (e.target.closest("[data-inc]")) l.qty++;
    else if (e.target.closest("[data-dec]")) { l.qty--; if (l.qty <= 0) lines = lines.filter((x) => x !== l); }
    else return;
    save(); renderBong(false);
  });
  $("[data-bong-clear]").addEventListener("click", () => { lines = []; save(); renderBong(false); });
  function setOpen(open) {
    bong.dataset.open = String(open); fab.setAttribute("aria-expanded", String(open));
    if (open) {
      $("[data-bong-date]").textContent = new Intl.DateTimeFormat("da-DK", { timeZone: "Europe/Copenhagen", dateStyle: "short", timeStyle: "short" }).format(new Date());
      if (!reduce) { paper.classList.remove("print"); void paper.offsetWidth; paper.classList.add("print"); }
    }
  }
  fab.addEventListener("click", () => setOpen(bong.dataset.open !== "true"));
  $("[data-bong-close]").addEventListener("click", () => setOpen(false));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && bong.dataset.open === "true") { setOpen(false); fab.focus(); } });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]");
    if (b) addToBong(byKey.get(b.dataset.add), size, b);
  });
  renderBong(false);

  /* ------------------------------------------------------------ door sign */
  const sign = $("[data-sign]");
  const swing = () => { if (reduce) return; sign.classList.remove("swing"); void sign.offsetWidth; sign.classList.add("swing"); };
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { swing(); } }, { threshold: 0.6 }).observe(sign);
  sign.addEventListener("pointerenter", swing);
  sign.addEventListener("click", swing);

  /* ------------------------------------------------------------ reveal */
  $$(".sec-head, .menu-head, .visit-info, .cat-head, .about-text").forEach((el) => el.setAttribute("data-reveal", ""));
  const rev = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rev.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$("[data-reveal]").forEach((el, i) => { el.style.transitionDelay = el.classList.contains("offer") ? `${(i % 4) * 70}ms` : ""; rev.observe(el); });

  /* ------------------------------------------------------------ go */
  const go = () => {
    document.documentElement.classList.add("ready");
    setTimeout(() => { document.documentElement.classList.add("settled"); heroPizza.style.transition = "none"; startCycle(); onScroll(); }, 1900);
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(go));
  onScroll();
})();
