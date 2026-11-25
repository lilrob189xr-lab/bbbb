// Run through `npm run validate:catalog` (compiles src/data first).
const fs = require("fs");
const path = require("path");
const build = path.join(__dirname, "..", ".validate-build");
const { validateCatalog } = require(path.join(build, "validate.js"));
const { products } = require(path.join(build, "products.js"));
const errs = validateCatalog();
for (const p of products) for (const im of p.images) {
  for (const f of [im.src, im.card && im.card.src, im.thumb && im.thumb.src].filter(Boolean)) {
    if (!fs.existsSync(path.join(__dirname, "..", "public", f))) errs.push(`[${p.id}] missing file public${f}`);
  }
}
const pub = products.filter((p) => p.status === "published").length;
console.log(`products: ${products.length} (published ${pub}, draft ${products.length - pub})`);
if (errs.length) { console.error("\nCatalog problems:\n - " + errs.join("\n - ")); process.exit(1); }
console.log("Catalog OK");
