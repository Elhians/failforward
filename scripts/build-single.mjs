// Construit out/fail-forward-secours.html : un seul fichier, sans réseau, partageable
// par WhatsApp, Bluetooth ou clé USB (cahier EF-16, §8.4). À lancer après `next build`.
import { build } from "esbuild";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");
const FILE = "fail-forward-secours.html";
const MAX = 500 * 1024;

// 1. JavaScript : l'application entière en un seul IIFE minifié.
const js = await build({
  entryPoints: [join(ROOT, "src/single.tsx")],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  target: ["es2020", "chrome90", "safari15", "firefox90"],
  jsx: "automatic",
  alias: { "@": join(ROOT, "src") },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_BASE_PATH": '""',
  },
  legalComments: "none",
  logLevel: "error",
});
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

// 2. CSS : celui compilé par Next (Tailwind), avec les polices intégrées en base64.
const cssDir = join(OUT, "_next/static/chunks");
const cssFile = readdirSync(cssDir).find((f) => f.endsWith(".css"));
if (!cssFile) throw new Error("CSS introuvable : lancer `next build` d'abord.");
let css = readFileSync(join(cssDir, cssFile), "utf8");
css = css.replace(/url\(([^)]+\.woff2)\)/g, (_, u) => {
  const clean = u.replace(/["']/g, "");
  const path = clean.startsWith("/") ? join(OUT, clean.replace(/^\/[^/]*?(?=\/_next)/, "")) : resolve(cssDir, clean);
  return `url(data:font/woff2;base64,${readFileSync(path).toString("base64")})`;
});

const favicon = readFileSync(join(ROOT, "public/favicon.png")).toString("base64");
const theme = `(function(){try{var t=localStorage.getItem("ffesp:v1:theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#00786f">
<title>Fail Forward ESP — version de secours</title>
<meta name="description" content="Version de secours, fichier unique : fonctionne sans réseau.">
<link rel="icon" href="data:image/png;base64,${favicon}">
<script>${theme}</script>
<style>${css}</style>
</head>
<body class="min-h-dvh antialiased">
<div id="root"></div>
<noscript><p style="padding:1rem">Cette application a besoin de JavaScript. Ouvre ce fichier dans Chrome, Firefox ou Safari.</p></noscript>
<script>${script}</script>
</body>
</html>
`;

writeFileSync(join(OUT, FILE), html);
const kb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`${FILE} : ${kb} Ko (fichier unique, hors-ligne)`);
if (Buffer.byteLength(html) > MAX) {
  console.error(`Fichier de secours trop lourd (> ${MAX / 1024} Ko).`);
  process.exit(1);
}
