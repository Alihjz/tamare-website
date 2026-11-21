/* TAMARÈ storefront — routing, rendering and cart. Products live in products.js. */
(function () {
  "use strict";
  const C = window.TAMARE;
  const IMG = "images/";
  const $ = (s, el = document) => el.querySelector(s);
  const app = $("#app");
  const fmt = new Intl.NumberFormat("de-DE", { style: "currency", currency: C.currency });
  const money = (n) => fmt.format(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const bySlug = (s) => C.products.find((p) => p.slug === s);
  const coll = (h) => C.collections.find((c) => c.handle === h);
  const inColl = (c) => C.products.filter((p) => (!c.match.type || p.type === c.match.type) && (!c.match.tag || p.tags.includes(c.match.tag)));
  const typeLabel = { rings: "Ring", necklaces: "Necklace", earrings: "Earrings", bracelets: "Bracelet" };

  const icon = {
    truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/></svg>',
    box: '<svg viewBox="0 0 24 24"><path d="M4 9h16v11H4zM3 5h18v4H3zM12 5v15"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/></svg>',
    ret: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3"/></svg>'
  };

  /* ---------------- cart (stored in this browser) ---------------- */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("tamare-cart") || "[]"); } catch (e) { return mem; } },
    set(v) { mem = v; try { localStorage.setItem("tamare-cart", JSON.stringify(v)); } catch (e) {} }
  };
  let mem = [];
  let cart = store.get();
  const lineKey = (l) => [l.slug, l.size || "", l.engraving || "", l.gift ? 1 : 0, l.giftMsg || ""].join("|");
  const unitPrice = (l) => { const p = bySlug(l.slug); return p ? p.price + (l.engraving ? (p.engraving?.price || 0) : 0) + (l.gift ? C.giftWrapPrice : 0) : 0; };
  const subtotal = () => cart.reduce((s, l) => s + unitPrice(l) * l.qty, 0);
  const itemCount = () => cart.reduce((s, l) => s + l.qty, 0);
  function addToCart(line) {
    const k = lineKey(line);
    const hit = cart.find((l) => lineKey(l) === k);
    if (hit) hit.qty += line.qty; else cart.push(line);
    save(); toast(`${bySlug(line.slug).name} added to your bag`); openCart();
  }
  function setQty(i, q) { if (q <= 0) cart.splice(i, 1); else cart[i].qty = q; save(); }
  function save() { cart = cart.filter((l) => bySlug(l.slug)); store.set(cart); renderCount(); renderCartDrawer(); if (route().name === "cart") render(); }

  /* ---------------- shared bits ---------------- */
  function card(p) {
    const badge = p.compareAt ? "Sale" : p.tags.includes("new") ? "New" : p.tags.includes("bestseller") ? "Bestseller" : "";
    return `<article class="card">
      <div class="card-media">
        <a class="card-link" href="#product-${p.slug}" aria-label="${esc(p.name)}">
        ${badge ? `<span class="badge">${badge}</span>` : ""}
        <img src="${IMG + p.images[0]}" alt="${esc(p.name)}" loading="lazy">
        ${p.images[1] ? `<img src="${IMG + p.images[1]}" alt="" loading="lazy">` : ""}
        </a>
        ${!p.sizes && !p.engraving ? `<button class="btn light quick" data-quick="${p.slug}">Add to bag</button>` : `<a class="btn light quick" href="#product-${p.slug}">Personalise</a>`}
      </div>
      <div class="card-info"><div><div class="card-name"><a href="#product-${p.slug}">${esc(p.name)}</a></div>
      <div class="card-sub">${typeLabel[p.type]}${p.engraving ? " · Engravable" : ""}</div></div>
      <div class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</div></div>
    </article>`;
  }
  const grid = (list) => `<div class="grid">${list.map(card).join("")}</div>`;
  const usp = () => `<section class="usp"><div class="wrap">
      <div>${icon.spark}<span>18K gold plated, nickel free</span></div>
      <div>${icon.truck}<span>Free shipping from ${money(C.freeShippingFrom)}</span></div>
      <div>${icon.box}<span>Velvet gift box with every order</span></div>
      <div>${icon.ret}<span>30-day returns</span></div></div></section>`;

  /* ---------------- pages ---------------- */
  function home() {
    const best = inColl(coll("bestsellers")).slice(0, 4);
    const fresh = inColl(coll("new-in")).slice(0, 4);
    const types = C.collections.filter((c) => c.group === "type");
    const occ = ["evening", "everyday", "bridal", "gifts", "gifts-under-50"].map(coll);
    return `
    <section class="hero">
      <div class="hero-media"><img src="${IMG}life-layered-necklaces.jpg" alt="Model wearing layered TAMARÈ gold necklaces and bracelet" fetchpriority="high"></div>
      <div class="hero-copy">
        <span class="eyebrow">The new collection</span>
        <h1>Sculpted <em>in</em> style</h1>
        <p>Gold-plated pieces set with bright stones, designed to be layered, stacked and worn every day. Each one arrives in our velvet box.</p>
        <div class="hero-cta"><a class="btn" href="#shop-new-in">Shop new in</a><a class="btn ghost" href="#shop-bestsellers">Bestsellers</a></div>
      </div>
    </section>
    ${usp()}
    <section class="section"><div class="wrap">
      <div class="section-head"><div><div class="eyebrow">Shop by category</div><h2>Find your piece</h2></div><a class="link" href="#shop-all">View all</a></div>
      <div class="cats">${types.map((c) => `<a class="cat" href="#shop-${c.handle}"><img src="${IMG + c.cover}" alt="" loading="lazy"><span>${c.title}</span></a>`).join("")}</div>
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head"><div><div class="eyebrow">Most loved</div><h2>Bestsellers</h2></div><a class="link" href="#shop-bestsellers">Shop bestsellers</a></div>
      ${grid(best)}
    </div></section>
    <section class="split">
      <div class="split-media"><img src="${IMG}life-gift-box.jpg" alt="TAMARÈ earrings in the plum velvet gift box" loading="lazy"></div>
      <div class="split-copy"><span class="eyebrow">Ready to give</span><h2>Every order arrives in the TAMARÈ velvet box</h2>
        <p>Add gift wrapping and a handwritten note at checkout. Prices never appear on the packing slip, so you can ship straight to the person you're celebrating.</p>
        <div><a class="btn" href="#shop-gifts">Shop gifts</a></div></div>
    </section>
    <section class="section"><div class="wrap">
      <div class="section-head"><div><div class="eyebrow">Shop by occasion</div><h2>For every moment</h2></div></div>
      <div class="occasions">${occ.map((c) => `<a class="cat" href="#shop-${c.handle}"><img src="${IMG + c.cover}" alt="" loading="lazy"><span>${c.title}</span></a>`).join("")}</div>
    </div></section>
    <section class="section" style="background:var(--paper)"><div class="wrap engrave-demo">
      <div>${ringSvg("Forever yours")}</div>
      <div class="copy"><span class="eyebrow">Personalisation</span><h2>Make it theirs</h2>
        <p>Selected rings, necklaces and bracelets can be engraved with a name, a date or initials. Type it on the product page and see a preview before you order.</p>
        <div><a class="btn ghost" href="#shop-personalised">Shop personalised</a></div></div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="section-head"><div><div class="eyebrow">Just landed</div><h2>New in</h2></div><a class="link" href="#shop-new-in">Shop new in</a></div>
      ${grid(fresh)}
    </div></section>
    <section class="split flip">
      <div class="split-media"><img src="${IMG}life-brand-necklaces.jpg" alt="Two TAMARÈ stone necklaces worn together" loading="lazy"></div>
      <div class="split-copy"><span class="eyebrow">Our story</span><h2>Jewellery with a sculptor's eye</h2>
        <p>TAMARÈ began with one idea: fine-jewellery shapes at a price you can wear every day. We design in small runs and finish every piece by hand.</p>
        <div><a class="btn ghost" href="#our-story">Read our story</a></div></div>
    </section>`;
  }

  function ringSvg(text) {
    const t = esc(text || "Your words here");
    return `<svg class="ring-preview" viewBox="0 0 400 400" role="img" aria-label="Engraving preview: ${t}">
      <defs><radialGradient id="g1" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#f3dfae"/><stop offset=".55" stop-color="#c9a464"/><stop offset="1" stop-color="#8a6a36"/></radialGradient>
      <path id="arc" d="M 90 200 A 110 110 0 0 1 310 200"/></defs>
      <circle cx="200" cy="200" r="150" fill="url(#g1)"/>
      <circle cx="200" cy="200" r="122" fill="#fffdfa"/>
      <circle cx="200" cy="200" r="122" fill="none" stroke="#b8945a" stroke-width="2"/>
      <circle cx="200" cy="200" r="136" fill="none" stroke="#f6e7c4" stroke-width="1" opacity=".7"/>
      <text font-family="Bodoni Moda, Georgia, serif" font-style="italic" font-size="26" fill="#8a6a36" letter-spacing="2"><textPath href="#arc" startOffset="50%" text-anchor="middle">${t}</textPath></text>
    </svg>`;
  }

  function collection(handle) {
    const c = coll(handle) || coll("all");
    const siblings = C.collections.filter((x) => x.group === c.group || (c.group === "edit" && x.group === "type"));
    const typeF = state.type || "";
    const sort = state.sort || "featured";
    let list = inColl(c).filter((p) => !typeF || p.type === typeF);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    const types = [...new Set(inColl(c).map((p) => p.type))];
    return `<div class="wrap">
      <header class="coll-head"><span class="eyebrow">${{ type: "Category", style: "Style", occasion: "Occasion", edit: "Collection" }[c.group]}</span><h1>${esc(c.title)}</h1><p>${esc(c.intro)}</p>
      <nav class="chips" aria-label="Related collections">${siblings.map((s) => `<a class="chip ${s.handle === c.handle ? "on" : ""}" href="#shop-${s.handle}">${esc(s.title)}</a>`).join("")}</nav></header>
      <div class="toolbar"><div class="filters">
        ${types.length > 1 ? `<label for="f-type">Type</label><select id="f-type" data-f="type"><option value="">All</option>${types.map((t) => `<option value="${t}" ${t === typeF ? "selected" : ""}>${t[0].toUpperCase() + t.slice(1)}</option>`).join("")}</select>` : ""}
        <span>${list.length} ${list.length === 1 ? "piece" : "pieces"}</span></div>
        <div class="filters"><label for="f-sort">Sort</label><select id="f-sort" data-f="sort">
          ${[["featured", "Featured"], ["low", "Price, low to high"], ["high", "Price, high to low"], ["az", "A to Z"]].map(([v, l]) => `<option value="${v}" ${v === sort ? "selected" : ""}>${l}</option>`).join("")}
        </select></div></div>
      ${list.length ? grid(list) : `<div class="empty"><p>No pieces here yet.</p><a class="btn ghost" href="#shop-all">Shop all</a></div>`}
      <div style="height:4rem"></div></div>`;
  }

  function product(slug) {
    const p = bySlug(slug);
    if (!p) return notFound();
    const c = coll(p.type);
    const related = C.products.filter((x) => x.slug !== p.slug && (x.type !== p.type) && x.tags.some((t) => p.tags.includes(t) && !["gift", "under-50"].includes(t))).slice(0, 4);
    const pd = state.pdp = { slug, img: 0, size: null, qty: 1, engrave: false, text: "", gift: false, msg: "" };
    return `<div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><a href="#shop-${c.handle}">${c.title}</a><span>/</span><span>${esc(p.name)}</span></nav>
      <div class="pdp">
        <div class="gallery">
          <div class="thumbs">${p.images.map((im, i) => `<button data-img="${i}" class="${i === 0 ? "on" : ""}" aria-label="Show image ${i + 1}"><img src="${IMG + im}" alt=""></button>`).join("")}</div>
          <div class="main-img"><img id="main-img" src="${IMG + p.images[0]}" alt="${esc(p.name)}"></div>
        </div>
        <div class="buy">
          <div style="display:grid;gap:.5rem"><span class="eyebrow">${typeLabel[p.type]}</span><h1>${esc(p.name)}</h1>
            <div class="price" id="pdp-price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</div>
            <div class="material">${esc(p.material)}</div></div>
          <p class="desc">${esc(p.description)}</p>
          ${p.sizes ? `<div><div class="opt-label"><span>Size${p.type === "rings" ? " (EU)" : ""}</span>${p.type === "rings" ? `<a class="link" href="#size-guide">Find my size</a>` : ""}</div>
            <div class="sizes" role="group" aria-label="Size">${p.sizes.map((s) => `<button data-size="${s}">${s}</button>`).join("")}</div></div>` : ""}
          ${p.engraving ? `<div class="personal">
            <label class="check"><input type="checkbox" id="engrave-on"> <span>Add engraving (+${money(p.engraving.price)})</span></label>
            <div id="engrave-box" hidden style="display:grid;gap:.6rem">
              <div class="field"><label for="engrave-text">Your text, up to ${p.engraving.maxChars} characters</label>
              <input class="input" id="engrave-text" maxlength="${p.engraving.maxChars}" placeholder="e.g. M · 12.06.26" autocomplete="off"></div>
              <div class="counter" id="engrave-count">0 / ${p.engraving.maxChars}</div>
              <div class="engr-preview" id="engrave-preview" aria-live="polite">Your words here</div>
              <p style="font-size:.8rem;color:var(--muted)">Engraved pieces are made to order and ship in 3 to 5 working days. They can't be returned unless faulty.</p>
            </div></div>` : ""}
          <div class="personal">
            <label class="check"><input type="checkbox" id="gift-on"> <span>Gift wrap with a handwritten note (+${money(C.giftWrapPrice)})</span></label>
            <div class="field" id="gift-box" hidden><label for="gift-msg">Your note</label><textarea class="input" id="gift-msg" maxlength="200" placeholder="Happy birthday, love…"></textarea></div>
          </div>
          <div class="add-row">
            <div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span id="pdp-qty">1</span><button data-q="1" aria-label="Increase quantity">+</button></div>
            <button class="btn" id="add-btn">Add to bag · <span id="add-total">${money(p.price)}</span></button>
          </div>
          <p class="notice" id="pdp-notice" hidden></p>
          <div class="perks">
            <div>${icon.truck}<span>${p.tags.includes("ready-to-ship") ? "In stock. Ships within 1 working day" : "Ships in 1 to 3 working days"}</span></div>
            <div>${icon.box}<span>Arrives in the TAMARÈ velvet box</span></div>
            <div>${icon.ret}<span>Free returns within 30 days</span></div>
          </div>
          <div>
            <details class="acc" open><summary>Details</summary><div class="acc-body"><ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}<li>${esc(p.material)}</li></ul></div></details>
            <details class="acc"><summary>Materials & care</summary><div class="acc-body"><p>Our pieces are thick 18K gold plating over a hypoallergenic, nickel-free base. To keep the shine, take them off before swimming, showering or using perfume, and store them in the box they came in.</p></div></details>
            <details class="acc"><summary>Shipping & returns</summary><div class="acc-body"><p>Free standard shipping within Germany on orders from ${money(C.freeShippingFrom)}. Returns are free within 30 days for unworn pieces. <a class="link" href="#shipping">Full details</a></p></div></details>
          </div>
        </div>
      </div>
      ${related.length ? `<section class="section" style="padding-top:1rem"><div class="section-head"><div><div class="eyebrow">Complete the look</div><h2>Wear it with</h2></div></div>${grid(related)}</section>` : ""}
    </div>`;
  }

  function cartPage() {
    if (!cart.length) return `<div class="wrap"><div class="empty" style="padding-block:6rem"><h1 style="font-size:var(--step-3)">Your bag is empty</h1><p>Start with our most loved pieces.</p><a class="btn" href="#shop-bestsellers">Shop bestsellers</a></div></div>`;
    return `<div class="wrap"><header class="coll-head"><h1>Your bag</h1></header>
      <div class="cart-page"><div>${cart.map(lineHtml).join("")}</div>
      <aside class="summary">${summaryHtml()}</aside></div></div>`;
  }
  function lineHtml(l, i) {
    const p = bySlug(l.slug);
    return `<div class="line"><a href="#product-${p.slug}"><img src="${IMG + p.images[0]}" alt=""></a>
      <div><div class="name"><a href="#product-${p.slug}">${esc(p.name)}</a></div>
        <div class="meta">${l.size ? `<span>Size: ${esc(l.size)}</span>` : ""}${l.engraving ? `<span>Engraving: “${esc(l.engraving)}”</span>` : ""}${l.gift ? `<span>Gift wrapped${l.giftMsg ? `: “${esc(l.giftMsg)}”` : ""}</span>` : ""}</div>
        <div class="ctrl"><div class="qty"><button data-line="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-line="${i}" data-d="1" aria-label="Increase">+</button></div>
        <button class="remove" data-remove="${i}">Remove</button></div></div>
      <div class="price">${money(unitPrice(l) * l.qty)}</div></div>`;
  }
  function summaryHtml() {
    const sub = subtotal();
    const left = Math.max(0, C.freeShippingFrom - sub);
    const ship = left > 0 ? 4.9 : 0;
    return `<div class="ship-bar"><span>${left > 0 ? `Add ${money(left)} more for free shipping` : "You've unlocked free shipping"}</span><div class="track"><div class="fill" style="width:${Math.min(100, (sub / C.freeShippingFrom) * 100)}%"></div></div></div>
      <div class="totals"><div><span>Subtotal</span><span>${money(sub)}</span></div><div><span>Shipping (Germany)</span><span>${ship ? money(ship) : "Free"}</span></div>
      <div class="grand"><span>Total</span><span>${money(sub + ship)}</span></div></div>
      <p class="pay-note">Prices include VAT.</p>
      <button class="btn block" data-checkout>Checkout</button>
      <p class="pay-note">Card, PayPal, Apple Pay and pay later</p>`;
  }

  /* text pages */
  const draft = `<p class="draft">Draft text. Highlighted values are placeholders to confirm, and legal pages should be checked by a lawyer before launch.</p>`;
  const ph = (t) => `<span class="ph">${t}</span>`;
  const pages = {
    "our-story": () => `<div class="wrap"><div class="page">
      <h1>Our story</h1>
      <div class="story-hero"><img src="${IMG}life-brand-necklaces.jpg" alt="TAMARÈ necklaces worn together"></div>
      ${draft}
      <p>TAMARÈ was founded in ${ph("[year]")} by ${ph("[founder name]")} with a simple belief: the shapes you see in fine-jewellery windows shouldn't be out of reach.</p>
      <h2>Sculpted in style</h2>
      <p>Every collection starts as a sketch of a single line: a bar, a curve, a drop. We build each piece around that line, then set it with bright stones so it catches the light from every side.</p>
      <h2>Made to be worn</h2>
      <p>We use thick 18K gold plating over a nickel-free base, so pieces stay comfortable on sensitive skin. They are made to be layered, stacked and lived in, not kept for best.</p>
      <h2>Small runs, finished by hand</h2>
      <p>We produce in small batches and check every piece by hand before it goes into its velvet box.</p>
      <div style="margin-top:1rem"><a class="btn" href="#shop-all">Explore the collection</a></div></div></div>`,

    "size-guide": () => `<div class="wrap"><div class="page">
      <h1>Size guide</h1>
      <h2>Find your ring size</h2>
      <p>Wrap a strip of paper around the base of your finger, mark where it overlaps, and measure the length in millimetres. Enter it below.</p>
      <form class="finder" id="finder"><div class="field"><label for="circ">Finger circumference (mm)</label><input class="input" id="circ" type="number" inputmode="decimal" min="40" max="70" step="0.5" value="54"></div>
      <button class="btn" type="submit">Find my size</button><div class="finder-out" id="finder-out" aria-live="polite"></div></form>
      <p style="font-size:.88rem;color:var(--muted)">Between two sizes? Choose the larger one. Fingers are slightly bigger in the evening and in warm weather.</p>
      <div class="table-wrap"><table id="ring-table"><thead><tr><th>EU</th><th>Circumference</th><th>Diameter</th><th>UK</th><th>US</th></tr></thead><tbody>
      ${RING.map((r) => `<tr data-eu="${r[0]}"><td>${r[0]}</td><td>${r[0]} mm</td><td>${(r[0] / Math.PI).toFixed(1)} mm</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
      </tbody></table></div>
      <h2>Necklace lengths</h2>
      <div class="table-wrap"><table><thead><tr><th>Length</th><th>Where it sits</th></tr></thead><tbody>
      <tr><td>38 cm</td><td>Collar, close to the base of the neck</td></tr><tr><td>40 cm</td><td>Just above the collarbone</td></tr><tr><td>45 cm</td><td>On the collarbone, our most popular length</td></tr><tr><td>50 cm</td><td>Below the collarbone, good for layering</td></tr></tbody></table></div>
      <h2>Bracelet sizes</h2>
      <p>Measure your wrist snugly and add 1 to 2 cm for comfort. Most wrists suit our 17 cm length.</p></div></div>`,

    shipping: () => `<div class="wrap"><div class="page">
      <h1>Shipping & returns</h1>${draft}
      <div class="table-wrap"><table><thead><tr><th>Destination</th><th>Delivery time</th><th>Cost</th></tr></thead><tbody>
      <tr><td>Germany</td><td>${ph("1 to 3 working days")}</td><td>${ph("€4.90, free from €60")}</td></tr>
      <tr><td>EU</td><td>${ph("3 to 6 working days")}</td><td>${ph("€8.90, free from €100")}</td></tr>
      <tr><td>Rest of world</td><td>${ph("5 to 10 working days")}</td><td>${ph("€15.00")}</td></tr></tbody></table></div>
      <h2>Dispatch</h2><p>Orders placed before ${ph("2 pm")} on a working day leave our studio the same day. Engraved pieces are made to order and ship in 3 to 5 working days.</p>
      <h2>Returns</h2><p>You can return unworn pieces in their original packaging within 30 days of delivery. Engraved and personalised pieces can't be returned unless faulty. Start a return by emailing ${ph("hello@tamare.com")} with your order number.</p>
      <h2>Refunds</h2><p>We refund to your original payment method within 14 days of receiving your return.</p></div></div>`,

    faq: () => `<div class="wrap"><div class="page"><h1>Help & FAQ</h1>
      ${[["Will the gold plating last?", "Our pieces use a thick 18K gold plating. With everyday care, avoiding water, perfume and lotions, they keep their colour for a long time."],
        ["Is the jewellery suitable for sensitive skin?", "Yes. All pieces are nickel free and hypoallergenic."],
        ["How long does engraving take?", "Engraved pieces are made to order and ship in 3 to 5 working days."],
        ["Can I send an order as a gift?", "Yes. Every order arrives in our velvet box, and you can add gift wrapping and a note on the product page. Prices are never shown on the packing slip."],
        ["How do I find my ring size?", "Use our size guide, which converts your finger measurement to EU, UK and US sizes."],
        ["Can I change or cancel my order?", "Email us within 2 hours of ordering and we'll do our best before it ships."]]
        .map(([q, a]) => `<details class="acc"><summary>${q}</summary><div class="acc-body"><p>${a}</p></div></details>`).join("")}
      <h2>Contact us</h2><p>Email ${ph("hello@tamare.com")}. We reply within one working day, Monday to Friday.</p>
      <form class="finder" id="contact-form" style="grid-template-columns:1fr"><div class="field"><label for="c-name">Name</label><input class="input" id="c-name" required></div>
      <div class="field"><label for="c-email">Email</label><input class="input" id="c-email" type="email" required></div>
      <div class="field"><label for="c-msg">Message</label><textarea class="input" id="c-msg" required></textarea></div>
      <button class="btn" type="submit">Send message</button><div class="finder-out" id="contact-out" aria-live="polite"></div></form></div></div>`,

    terms: () => `<div class="wrap"><div class="page"><h1>Terms & conditions</h1>${draft}
      <h2>1. Scope</h2><p>These terms apply to all orders placed at ${ph("tamare.com")} by consumers with ${ph("[company name, legal form]")}, ${ph("[address]")}.</p>
      <h2>2. Contract</h2><p>Product listings are an invitation to order. A contract is formed when we confirm dispatch by email.</p>
      <h2>3. Prices and payment</h2><p>All prices are in euros and include statutory VAT. Shipping costs are shown before you place your order.</p>
      <h2>4. Right of withdrawal</h2><p>Consumers have a 14-day statutory right of withdrawal. Personalised items are excluded under § 312g (2) no. 1 BGB. ${ph("[Insert full withdrawal notice and model form]")}</p>
      <h2>5. Warranty</h2><p>Statutory warranty rights apply.</p>
      <h2>6. Online dispute resolution</h2><p>${ph("[ODR / consumer arbitration statement]")}</p></div></div>`,

    privacy: () => `<div class="wrap"><div class="page"><h1>Privacy policy</h1>${draft}
      <h2>Controller</h2><p>${ph("[Company name, address, email]")}</p>
      <h2>What we collect</h2><ul><li>Order data: name, address, email, items, engraving text</li><li>Payment data, processed by ${ph("[payment provider]")}</li><li>Newsletter email, only with your consent</li><li>Technical data needed to run the site</li></ul>
      <h2>Your bag</h2><p>Your shopping bag is saved in your own browser's local storage so it's still there when you come back. It isn't sent to us until you check out.</p>
      <h2>Your rights</h2><p>You can request access, correction, deletion or a copy of your data, and object to processing, at any time by emailing ${ph("[privacy email]")}.</p></div></div>`,

    imprint: () => `<div class="wrap"><div class="page"><h1>Imprint</h1>${draft}
      <p>${ph("[Company name and legal form]")}<br>${ph("[Street and number]")}<br>${ph("[Postcode, city]")}, Germany</p>
      <p>Represented by: ${ph("[managing director]")}<br>Email: ${ph("[email]")}<br>Phone: ${ph("[phone]")}</p>
      <p>Commercial register: ${ph("[court, HRB number]")}<br>VAT ID: ${ph("[DE…]")}</p></div></div>`
  };
  const RING = [[46, "H½", "3¾"], [48, "J", "4½"], [50, "L", "5¼"], [52, "M", "6"], [54, "N½", "6¾"], [56, "P", "7½"], [58, "Q½", "8¼"], [60, "S", "9"], [62, "T½", "10"]];

  function notFound() { return `<div class="wrap"><div class="empty" style="padding-block:6rem"><h1 style="font-size:var(--step-3)">We couldn't find that page</h1><a class="btn" href="#home">Back to home</a></div></div>`; }

  /* ---------------- chrome: header, menus, drawer, search ---------------- */
  function navData() {
    const g = (k) => C.collections.filter((c) => c.group === k);
    return { type: g("type"), style: g("style"), occasion: g("occasion"), edit: g("edit") };
  }
  function renderChrome() {
    const n = navData();
    const li = (arr) => arr.map((c) => `<li><a href="#shop-${c.handle}">${esc(c.title)}</a></li>`).join("");
    $("#nav").innerHTML = `
      <div class="has-menu"><a href="#shop-all">Shop</a>
        <div class="mega"><div class="wrap">
          <div><h4>Category</h4><ul>${li(n.type)}${li(n.edit)}</ul></div>
          <div><h4>Style</h4><ul>${li(n.style)}</ul></div>
          <div><h4>Occasion</h4><ul>${li(n.occasion)}</ul></div>
          <a class="mega-feature" href="#shop-new-in"><img src="${IMG}life-tennis-necklace.jpg" alt=""><span>New in</span></a>
        </div></div></div>
      <a href="#shop-bestsellers">Bestsellers</a><a href="#shop-personalised">Personalised</a><a href="#shop-gifts">Gifts</a><a href="#our-story">Our story</a>`;
    $("#mnav").innerHTML = `<div><h4>Category</h4><ul>${li(n.type)}</ul></div><div><h4>Edits</h4><ul>${li(n.edit)}</ul></div>
      <div><h4>Style</h4><ul>${li(n.style)}</ul></div><div><h4>Occasion</h4><ul>${li(n.occasion)}</ul></div>
      <div><h4>About</h4><ul><li><a href="#our-story">Our story</a></li><li><a href="#size-guide">Size guide</a></li><li><a href="#shipping">Shipping & returns</a></li><li><a href="#faq">Help & FAQ</a></li></ul></div>`;
    $("#foot-shop").innerHTML = li([...n.type, coll("bestsellers"), coll("new-in"), coll("gifts")]);
  }
  function renderCount() { const n = itemCount(); const el = $("#cart-count"); el.textContent = n; el.hidden = !n; }
  function renderCartDrawer() {
    $("#cart-body").innerHTML = cart.length ? cart.map(lineHtml).join("") : `<div class="empty"><p>Your bag is empty.</p><a class="btn ghost" href="#shop-bestsellers">Shop bestsellers</a></div>`;
    $("#cart-foot").innerHTML = cart.length ? summaryHtml() + `<a style="justify-self:center;font-size:.85rem;text-decoration:underline" href="#cart">View full bag</a>` : "";
    $("#cart-foot").hidden = !cart.length;
    $("#cart-title").textContent = `Your bag (${itemCount()})`;
  }
  const scrim = $("#scrim");
  function openDrawer(id) { closeAll(); $(id).classList.add("open"); scrim.classList.add("on"); }
  function openCart() { openDrawer("#cart-drawer"); }
  function closeAll() { document.querySelectorAll(".drawer.open,.search-panel.open").forEach((d) => d.classList.remove("open")); scrim.classList.remove("on"); }
  function runSearch(q) {
    q = q.trim().toLowerCase();
    const res = q ? C.products.filter((p) => [p.name, p.type, p.material, p.description, ...p.tags].join(" ").toLowerCase().includes(q)) : C.products.filter((p) => p.tags.includes("bestseller"));
    $("#search-res").innerHTML = `<p class="eyebrow" style="margin-bottom:1rem">${q ? `${res.length} results` : "Popular"}</p>` + (res.length ? grid(res.slice(0, 8)) : `<p>No pieces match “${esc(q)}”.</p>`);
  }
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }

  /* ---------------- router ---------------- */
  const state = {};
  function route() {
    const h = (location.hash || "").replace(/^#/, "");
    if (!h || h === "home") return { name: "home" };
    if (h.startsWith("shop-")) return { name: "shop", arg: h.slice(5) };
    if (h.startsWith("product-")) return { name: "product", arg: h.slice(8) };
    if (h === "cart") return { name: "cart" };
    if (pages[h]) return { name: "page", arg: h };
    return { name: "404" };
  }
  let last = "";
  function render() {
    const r = route();
    const key = r.name + (r.arg || "");
    if (key !== last) { state.type = ""; state.sort = ""; }
    let html, title = "TAMARÈ · Fine gold jewellery";
    if (r.name === "home") html = home();
    else if (r.name === "shop") { html = collection(r.arg); title = `${(coll(r.arg) || coll("all")).title} · TAMARÈ`; }
    else if (r.name === "product") { html = product(r.arg); const p = bySlug(r.arg); if (p) title = `${p.name} · TAMARÈ`; }
    else if (r.name === "cart") { html = cartPage(); title = "Your bag · TAMARÈ"; }
    else if (r.name === "page") html = pages[r.arg]();
    else html = notFound();
    app.innerHTML = html;
    document.title = title;
    if (key !== last) window.scrollTo(0, 0);
    last = key;
    closeAll();
    if (r.name === "page" && r.arg === "size-guide") ringFinder();
  }
  function ringFinder() {
    const f = $("#finder"); if (!f) return;
    const go = () => {
      const v = parseFloat($("#circ").value);
      document.querySelectorAll("#ring-table tr.hit").forEach((t) => t.classList.remove("hit"));
      if (!(v >= 40 && v <= 70)) { $("#finder-out").textContent = "Enter a measurement between 40 and 70 mm."; return; }
      const r = RING.find((x) => x[0] >= v) || RING[RING.length - 1];
      $("#finder-out").innerHTML = `Your size is <strong>EU ${r[0]}</strong> (UK ${r[1]}, US ${r[2]}).`;
      const row = document.querySelector(`#ring-table tr[data-eu="${r[0]}"]`); if (row) row.classList.add("hit");
    };
    f.addEventListener("submit", (e) => { e.preventDefault(); go(); });
    go();
  }

  /* ---------------- product page interactions ---------------- */
  function pdpTotal() {
    const pd = state.pdp, p = bySlug(pd.slug);
    const each = p.price + (pd.engrave ? p.engraving.price : 0) + (pd.gift ? C.giftWrapPrice : 0);
    $("#add-total").textContent = money(each * pd.qty);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) { if (e.target === scrim) closeAll(); return; }
    const d = t.dataset;
    if (t.matches("a[href^='#']") && location.hash === t.getAttribute("href")) { closeAll(); }
    if (d.open === "menu") return openDrawer("#menu-drawer");
    if (d.open === "cart") return openCart();
    if (d.open === "search") { closeAll(); $("#search").classList.add("open"); scrim.classList.add("on"); runSearch($("#q").value); setTimeout(() => $("#q").focus(), 50); return; }
    if (d.close !== undefined) return closeAll();
    if (d.quick) { e.preventDefault(); return addToCart({ slug: d.quick, qty: 1 }); }
    if (d.line) { const i = +d.line; return setQty(i, cart[i].qty + +d.d); }
    if (d.remove) return setQty(+d.remove, 0);
    if (d.checkout !== undefined) return toast("Checkout connects once payments are set up");
    if (state.pdp && route().name === "product") {
      const pd = state.pdp, p = bySlug(pd.slug);
      if (d.img) { pd.img = +d.img; $("#main-img").src = IMG + p.images[pd.img]; document.querySelectorAll(".thumbs button").forEach((b, i) => b.classList.toggle("on", i === pd.img)); }
      if (d.size) { pd.size = d.size; document.querySelectorAll(".sizes button").forEach((b) => b.classList.toggle("on", b.dataset.size === d.size)); $("#pdp-notice").hidden = true; }
      if (d.q) { pd.qty = Math.max(1, Math.min(10, pd.qty + +d.q)); $("#pdp-qty").textContent = pd.qty; pdpTotal(); }
      if (t.id === "add-btn") {
        const n = $("#pdp-notice");
        if (p.sizes && !pd.size) { n.textContent = "Choose a size first."; n.hidden = false; return; }
        if (pd.engrave && !pd.text.trim()) { n.textContent = "Type your engraving text, or untick engraving."; n.hidden = false; $("#engrave-text").focus(); return; }
        n.hidden = true;
        addToCart({ slug: p.slug, qty: pd.qty, size: pd.size, engraving: pd.engrave ? pd.text.trim() : "", gift: pd.gift, giftMsg: pd.gift ? pd.msg.trim() : "" });
      }
    }
  });
  document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "q") return runSearch(t.value);
    const pd = state.pdp; if (!pd) return;
    if (t.id === "engrave-text") { pd.text = t.value; $("#engrave-count").textContent = `${t.value.length} / ${t.maxLength}`; $("#engrave-preview").textContent = t.value || "Your words here"; }
    if (t.id === "gift-msg") pd.msg = t.value;
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.f) { state[t.dataset.f] = t.value; const y = scrollY; render(); scrollTo(0, y); return; }
    const pd = state.pdp; if (!pd) return;
    if (t.id === "engrave-on") { pd.engrave = t.checked; $("#engrave-box").hidden = !t.checked; pdpTotal(); }
    if (t.id === "gift-on") { pd.gift = t.checked; $("#gift-box").hidden = !t.checked; pdpTotal(); }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id === "nl-form") { e.preventDefault(); e.target.reset(); toast("Thanks. You're on the list."); }
    if (e.target.id === "contact-form") { e.preventDefault(); $("#contact-out").textContent = "Thanks. This form will send once the shop is live."; }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  window.addEventListener("hashchange", render);

  renderChrome(); renderCount(); renderCartDrawer(); render();
})();
