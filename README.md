# TAMARÈ website

Open `index.html` in a browser to view the shop. No install needed.

## Files
- `products.js` holds every product and collection. This is the only file to edit when the real product list arrives.
- `images/` holds the product and lifestyle photos (resized from the PICS folder).
- `styles.css` holds colours, fonts and layout. The brand colours are at the top.
- `app.js` runs the pages, filters, personalisation and the bag.

## Adding a product
Copy one product block in `products.js`, change the `slug`, `name`, `type`, `price`, `tags` and `images`, and drop the photos into `images/`. Tags decide which collections it appears in (for example `bestseller`, `new`, `evening`, `bridal`, `gift`, `engravable`). Add `sizes` for rings and `engraving: { maxChars: 12, price: 12 }` to offer engraving.

## Pages
Home, Shop all, Bestsellers, New in, Ready to ship, Rings, Necklaces, Earrings, Bracelets, Pavé, Chains & drops, Hearts, Colour stones, Personalised, Everyday, Evening, Bridal, Gifts, Gifts under €50, product pages, bag, size guide with ring-size finder, Our story, Shipping & returns, FAQ & contact, Terms, Privacy, Imprint.

## Still to do before launch
- Replace the 16 placeholder products with the real ~40 pieces (names, prices, materials).
- Fill in the highlighted placeholders on Shipping, Terms, Privacy and Imprint, and have the legal pages checked.
- Connect real checkout and payments. Checkout currently shows a notice only.
