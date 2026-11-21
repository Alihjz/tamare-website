/* ==========================================================================
   TAMARÈ catalogue — the ONLY file you need to edit to change products.
   --------------------------------------------------------------------------
   Every product marked `placeholder: true` uses a working name, price and
   description. Replace them with the real list; images live in /images.

   Product fields
     slug        url id, lowercase-with-hyphens, must be unique
     name        display name
     type        "rings" | "necklaces" | "earrings" | "bracelets"
     price       in EUR, number
     compareAt   optional old price (shows as sale)
     material    short material line
     tags        drive collections: bestseller, new, everyday, evening,
                 bridal, gift, pave, chain, heart, colour-stone, statement,
                 ready-to-ship, engravable, under-50
     images      first = main shot, second = shown on hover
     sizes       optional list (rings: EU sizes)
     engraving   optional { maxChars, price } → personalisation on product page
     description / details  copy for the product page
   ========================================================================== */

window.TAMARE = {
  currency: "EUR",
  locale: "en-DE",
  freeShippingFrom: 60,
  giftWrapPrice: 4,

  products: [
    {
      slug: "cascade-hoops", name: "Cascade Hoops", type: "earrings", price: 59,
      material: "18K gold plated · cubic zirconia",
      tags: ["bestseller", "evening", "bridal", "gift", "chain", "statement"],
      images: ["cascade-hoops.jpg", "cascade-hoops-2.jpg", "life-gift-box.jpg"],
      description: "Small huggie hoops with a falling line of clear stones that moves when you do. Bright enough for an evening out, light enough for all day.",
      details: ["Drop length approx. 5 cm", "Hinged huggie closure", "Sold as a pair"],
      placeholder: true
    },
    {
      slug: "orbit-pave-hoops", name: "Orbit Pavé Hoops", type: "earrings", price: 69,
      material: "18K gold plated · cubic zirconia",
      tags: ["bestseller", "evening", "pave", "statement", "gift"],
      images: ["orbit-pave-hoops.jpg", "life-orbit-hoops-model.jpg", "orbit-pave-hoops-2.jpg", "life-orbit-hoops-table.jpg"],
      description: "A polished gold hoop carrying a removable pavé ring. Wear them together, or slip the pavé ring off for a simpler look.",
      details: ["Hoop height approx. 2.2 cm", "Removable pavé charm", "Sold as a pair"],
      placeholder: true
    },
    {
      slug: "heart-station-necklace", name: "Heart Station Necklace", type: "necklaces", price: 55,
      material: "18K gold plated · cubic zirconia",
      tags: ["bestseller", "everyday", "heart", "gift", "engravable", "pave"],
      images: ["heart-station-necklace.jpg", "life-heart-necklace-model.jpg", "heart-station-necklace-2.jpg"],
      description: "Five pavé hearts spaced along a fine chain. A soft, everyday piece that layers well with a lariat or collar.",
      details: ["Chain length 40 cm + 5 cm extender", "Lobster clasp", "Clasp tag can be engraved"],
      engraving: { maxChars: 10, price: 12 },
      placeholder: true
    },
    {
      slug: "wave-pave-ring", name: "Wave Pavé Ring", type: "rings", price: 49,
      material: "18K gold plated · cubic zirconia",
      tags: ["bestseller", "everyday", "pave", "engravable", "under-50", "gift"],
      images: ["wave-pave-ring.jpg", "life-hand-rings.jpg"],
      description: "Two softly curved bands, one polished, one set with pavé, joined into a single ring that sits like a stack.",
      details: ["Band width approx. 5 mm", "Engravable inside the band"],
      sizes: [48, 50, 52, 54, 56, 58, 60],
      engraving: { maxChars: 12, price: 12 },
      placeholder: true
    },
    {
      slug: "heart-lariat", name: "Heart Lariat", type: "necklaces", price: 62,
      material: "18K gold plated · cubic zirconia",
      tags: ["new", "evening", "heart", "bridal", "gift"],
      images: ["heart-lariat.jpg", "life-layered-necklaces.jpg"],
      description: "A Y-shaped necklace with pavé hearts at the collarbone and a long fall ending in a small heart drop.",
      details: ["Chain length 42 cm, drop 8 cm", "Lobster clasp"],
      placeholder: true
    },
    {
      slug: "etrier-lariat", name: "Étrier Lariat", type: "necklaces", price: 65,
      material: "18K gold plated · cubic zirconia",
      tags: ["new", "statement", "evening", "pave"],
      images: ["etrier-lariat.jpg"],
      description: "Two sculpted pavé loops, one at the collarbone and one at the end of the drop, on a fine slide chain.",
      details: ["Chain length 45 cm, drop 7 cm", "Adjustable slide"],
      placeholder: true
    },
    {
      slug: "sculpt-bar-necklace", name: "Sculpt Bar Necklace", type: "necklaces", price: 79,
      material: "18K gold plated · cubic zirconia",
      tags: ["bestseller", "statement", "evening", "bridal", "colour-stone"],
      images: ["sculpt-bar-necklace.jpg", "life-brand-necklaces.jpg"],
      description: "Polished gold bars linked by clusters of soft pink and clear stones. Our signature shape, made to be worn alone or doubled.",
      details: ["Length 42 cm", "Box clasp with safety catch"],
      placeholder: true
    },
    {
      slug: "halo-collar", name: "Halo Collar", type: "necklaces", price: 72,
      material: "18K gold plated · cubic zirconia",
      tags: ["new", "evening", "statement", "bridal"],
      images: ["halo-collar.jpg", "life-tennis-necklace.jpg"],
      description: "A slim rigid collar with stone stations around the neckline. Clean and architectural.",
      details: ["Inner circumference 38 cm", "Hidden box clasp"],
      placeholder: true
    },
    {
      slug: "rose-bar-bracelet", name: "Rosé Bar Bracelet", type: "bracelets", price: 58,
      material: "18K gold plated · cubic zirconia",
      tags: ["new", "everyday", "colour-stone", "gift", "engravable"],
      images: ["rose-bar-bracelet.jpg"],
      description: "The bracelet partner to our Sculpt Bar Necklace: gold bars with pink and clear stone clusters.",
      details: ["Length 17 cm", "Box clasp with safety catch", "Clasp tag can be engraved"],
      sizes: ["16 cm", "17 cm", "18 cm"],
      engraving: { maxChars: 8, price: 12 },
      placeholder: true
    },
    {
      slug: "dune-ring-set", name: "Dune Ring Set", type: "rings", price: 45,
      material: "18K gold plated · cubic zirconia",
      tags: ["everyday", "pave", "under-50", "gift", "engravable"],
      images: ["dune-ring-set.jpg", "life-hand-rings.jpg"],
      description: "Two domed rings, one polished and one pavé. Wear them stacked or split them between hands.",
      details: ["Set of 2 rings", "Dome height approx. 4 mm"],
      sizes: [48, 50, 52, 54, 56, 58, 60],
      engraving: { maxChars: 12, price: 12 },
      placeholder: true
    },
    {
      slug: "spiral-wrap-ring", name: "Spiral Wrap Ring", type: "rings", price: 39,
      material: "18K gold plated · cubic zirconia",
      tags: ["new", "everyday", "under-50", "ready-to-ship"],
      images: ["spiral-wrap-ring.jpg", "spiral-wrap-ring-pair.jpg"],
      description: "An open spiral ring with a baguette and a trillion stone set between the coils.",
      details: ["Open design, lightly adjustable", "Band width approx. 2 mm"],
      sizes: [50, 52, 54, 56, 58],
      placeholder: true
    },
    {
      slug: "heartfall-hoops", name: "Heartfall Hoops", type: "earrings", price: 54,
      material: "18K gold plated · cubic zirconia",
      tags: ["heart", "evening", "gift", "statement"],
      images: ["heartfall-hoops.jpg"],
      description: "Pavé heart hoops with a tumble of gold and pavé hearts on fine chains.",
      details: ["Drop length approx. 6 cm", "Hinged huggie closure", "Sold as a pair"],
      placeholder: true
    },
    {
      slug: "chain-veil-hoops", name: "Chain Veil Hoops", type: "earrings", price: 44,
      material: "18K gold plated · cubic zirconia",
      tags: ["everyday", "chain", "under-50", "ready-to-ship", "gift"],
      images: ["chain-veil-hoops.jpg", "life-ear-chain.jpg"],
      description: "Pavé huggies with a loop of fine chain and two bezel stones that swing underneath.",
      details: ["Drop length approx. 4.5 cm", "Sold as a pair"],
      placeholder: true
    },
    {
      slug: "double-chain-huggies", name: "Double Chain Huggies", type: "earrings", price: 42,
      material: "18K gold plated · cubic zirconia",
      tags: ["everyday", "chain", "under-50", "ready-to-ship"],
      images: ["double-chain-huggies.jpg", "life-huggies-wood.jpg", "double-chain-huggies-2.jpg"],
      description: "Two lengths of fine chain draped from a pavé huggie. Easy movement for everyday.",
      details: ["Drop length approx. 4 cm", "Sold as a pair"],
      placeholder: true
    },
    {
      slug: "marquise-drops", name: "Marquise Line Drops", type: "earrings", price: 48,
      material: "18K gold plated · cubic zirconia · enamel",
      tags: ["evening", "under-50", "bridal"],
      images: ["marquise-drops.jpg"],
      description: "A clean vertical line of marquise stones and black enamel bars on a stud.",
      details: ["Drop length approx. 5.5 cm", "Butterfly back", "Sold as a pair"],
      placeholder: true
    },
    {
      slug: "rose-line-drops", name: "Rosé Line Drops", type: "earrings", price: 46,
      material: "18K gold plated · cubic zirconia",
      tags: ["new", "evening", "colour-stone", "under-50", "gift"],
      images: ["rose-line-drops.jpg", "life-drops-model.jpg"],
      description: "Long, light drops of pink marquise stones on slim gold bars.",
      details: ["Drop length approx. 6 cm", "Butterfly back", "Sold as a pair"],
      placeholder: true
    }
  ],

  /* Collections are built from product `type` and `tags`.
     group: "type" | "style" | "occasion" | "edit" decides where it shows in the menu. */
  collections: [
    { handle: "all", title: "Shop all", group: "edit", match: {}, intro: "Every TAMARÈ piece, in one place." },
    { handle: "bestsellers", title: "Bestsellers", group: "edit", match: { tag: "bestseller" }, intro: "The pieces our customers come back for." },
    { handle: "new-in", title: "New in", group: "edit", match: { tag: "new" }, intro: "The latest pieces from the studio." },
    { handle: "ready-to-ship", title: "Ready to ship", group: "edit", match: { tag: "ready-to-ship" }, intro: "In stock and dispatched within one working day." },

    { handle: "rings", title: "Rings", group: "type", match: { type: "rings" }, intro: "Stackable bands, pavé and sculpted shapes.", cover: "life-hand-rings.jpg" },
    { handle: "necklaces", title: "Necklaces", group: "type", match: { type: "necklaces" }, intro: "Lariats, collars and fine chains for layering.", cover: "life-layered-necklaces.jpg" },
    { handle: "earrings", title: "Earrings", group: "type", match: { type: "earrings" }, intro: "Huggies, hoops and drops that catch the light.", cover: "life-orbit-hoops-model.jpg" },
    { handle: "bracelets", title: "Bracelets", group: "type", match: { type: "bracelets" }, intro: "Bar bracelets and fine links for the wrist.", cover: "rose-bar-bracelet.jpg" },

    { handle: "pave", title: "Pavé", group: "style", match: { tag: "pave" }, intro: "Surfaces set edge to edge with small stones." },
    { handle: "chains", title: "Chains & drops", group: "style", match: { tag: "chain" }, intro: "Fine chain that moves with you." },
    { handle: "hearts", title: "Hearts", group: "style", match: { tag: "heart" }, intro: "Pavé and polished hearts." },
    { handle: "colour-stones", title: "Colour stones", group: "style", match: { tag: "colour-stone" }, intro: "Soft pink stones set in gold." },
    { handle: "personalised", title: "Personalised", group: "style", match: { tag: "engravable" }, intro: "Pieces we can engrave with a name, date or initials." },

    { handle: "everyday", title: "Everyday", group: "occasion", match: { tag: "everyday" }, intro: "Light pieces you can leave on.", cover: "life-heart-necklace-model.jpg" },
    { handle: "evening", title: "Evening", group: "occasion", match: { tag: "evening" }, intro: "More stone, more shine.", cover: "life-tennis-necklace.jpg" },
    { handle: "bridal", title: "Bridal", group: "occasion", match: { tag: "bridal" }, intro: "For the day itself and the bridal party.", cover: "life-drops-model.jpg" },
    { handle: "gifts", title: "Gifts", group: "occasion", match: { tag: "gift" }, intro: "Every order arrives in the TAMARÈ velvet box.", cover: "life-gift-box.jpg" },
    { handle: "gifts-under-50", title: "Gifts under €50", group: "occasion", match: { tag: "under-50" }, intro: "Thoughtful pieces under €50.", cover: "life-huggies-wood.jpg" }
  ]
};
