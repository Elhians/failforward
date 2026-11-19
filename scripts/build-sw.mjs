// Après `next build` : liste les fichiers de out/ et les injecte dans out/sw.js (précache hors-ligne).
// Affiche aussi le poids total transféré (gzip) pour vérifier le budget < 500 Ko (cahier §10.1).
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";

const OUT = "out";
const SKIP = [/^sw\.js$/, /\.txt$/, /^404/, /^_not-found/, /\.map$/, /^fail-forward-secours\.html$/, /^\.nojekyll$/];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(OUT)
  .map((p) => relative(OUT, p).split(sep).join("/"))
  .filter((f) => !SKIP.some((re) => re.test(f)))
  .sort();

const hash = createHash("sha256");
let raw = 0;
let gz = 0;
for (const f of files) {
  const buf = readFileSync(join(OUT, f));
  hash.update(f).update(buf);
  raw += buf.length;
  gz += /\.(png|woff2)$/.test(f) ? buf.length : gzipSync(buf, { level: 9 }).length;
}
const version = hash.digest("hex").slice(0, 12);

// La racine "" correspond à index.html (navigation hors-ligne).
const precache = ["", ...files.filter((f) => f !== "index.html")];
const swPath = join(OUT, "sw.js");
const sw = readFileSync(swPath, "utf8")
  .replace("__VERSION__", version)
  .replace("/*__PRECACHE__*/ []", JSON.stringify(precache));
writeFileSync(swPath, sw);
// GitHub Pages : ne pas passer par Jekyll (qui ignorerait le dossier _next/).
writeFileSync(join(OUT, ".nojekyll"), "");

const kb = (n) => `${(n / 1024).toFixed(1)} Ko`;
console.log(`sw.js : ${precache.length} fichiers précachés, version ${version}`);
console.log(`Poids total : ${kb(raw)} brut, ~${kb(gz)} transféré (gzip)`);
if (gz > 500 * 1024) {
  console.error("Budget dépassé : plus de 500 Ko transférés.");
  process.exit(1);
}
