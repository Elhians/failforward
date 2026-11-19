// Validation automatique du lot de scénarios (cahier §7.3, étape 3).
// Usage : npm run validate [-- <dossier ou fichier .json>] [--partial]
//   --partial : n'exige pas les 12 thèmes (pour valider un fichier généré isolé).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
const partial = args.includes("--partial");
const target = args.find((a) => !a.startsWith("--")) || "src/content/scenarios";

export const THEMES = [
  "Crise de lancement",
  "Conflit d'équipe pluridisciplinaire",
  "Dilemme éthique et budgétaire",
  "Pivot d'urgence",
  "Panne en production",
  "Ressources coupées",
  "Fuite d'information",
  "Concurrent plus rapide",
  "Changement de règles",
  "Partenaire qui se désiste",
  "Première démonstration ratée",
  "Surcharge",
];
const TYPES = ["basique", "complexe", "intelligent"];
const CATS = ["maintenir", "ajuster", "changer"];
// Vocabulaire qui juge la personne (amendement P0 n°1) ou mots à relire.
const WATCH = ["négligence", "negligence", "négligent", "s'entêter", "entêtement", "entêté", "nul", "nulle", "stupide", "incompétent", "incompétente", "faute", "coupable", "aggravation"];

const errors = [];
const warns = [];
const words = (s) => (typeof s === "string" ? s.trim().split(/\s+/).filter(Boolean).length : 0);

/** Lit un fichier : un scénario seul, ou { scenarios: [...] }. */
function load(path) {
  try {
    const data = JSON.parse(readFileSync(path, "utf8"));
    return (Array.isArray(data.scenarios) ? data.scenarios : [data]).map((s) => ({ s, file: path }));
  } catch (e) {
    errors.push(`JSON invalide (${path}) : ${e.message}`);
    return [];
  }
}

if (!existsSync(target)) {
  console.error(`Introuvable : ${target}`);
  process.exit(1);
}
const entries = statSync(target).isDirectory()
  ? readdirSync(target)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .flatMap((f) => load(join(target, f)))
  : load(target);

const ids = new Set();
const themes = new Set();
const intelligentByCat = { maintenir: 0, ajuster: 0, changer: 0 };

for (const { s, file } of entries) {
  const at = (m) => errors.push(`[${s.id ?? basename(file)}] ${m}`);
  if (!s.id || !/^[a-z0-9_]+$/.test(s.id)) at("id manquant ou invalide (a-z, 0-9, _).");
  if (statSync(target).isDirectory() && basename(file, ".json") !== s.id) at(`le nom du fichier doit être « ${s.id}.json ».`);
  if (ids.has(s.id)) at("id en double.");
  ids.add(s.id);
  if (!s.theme) at("thème manquant.");
  else if (!THEMES.includes(s.theme)) warns.push(`[${s.id}] thème hors liste §6.1 : « ${s.theme} »`);
  if (themes.has(s.theme)) at(`thème déjà utilisé : ${s.theme}`);
  themes.add(s.theme);
  if (s.stake && words(s.stake) > 25) at("phrase d'enjeu (stake) trop longue (> 25 mots).");
  const w = words(s.situation);
  if (w < 80 || w > 120) at(`situation de ${w} mots (attendu 80 à 120).`);

  if (!Array.isArray(s.choices) || s.choices.length !== 3) at("il faut exactement 3 choix.");
  for (const [i, c] of (s.choices ?? []).entries()) {
    if (c.id !== "ABC"[i]) at(`choix n°${i + 1} : id attendu « ${"ABC"[i]} ».`);
    if (!c.label) at(`choix ${c.id} : libellé manquant.`);
    if (words(c.label) > 14) at(`choix ${c.id} : libellé trop long (> 14 mots).`);
    if (!c.failure_event) at(`choix ${c.id} : événement d'échec manquant.`);
    if (words(c.failure_event) > 60) at(`choix ${c.id} : événement d'échec > 60 mots.`);
  }

  const checkPivots = (pv, where) => {
    if (!Array.isArray(pv) || pv.length !== 3) return at(`${where} : il faut exactement 3 pivots.`);
    pv.forEach((p, i) => {
      if (p.id !== String(i + 1)) at(`${where} : pivot n°${i + 1}, id attendu « ${i + 1} ».`);
      if (!p.label) at(`${where} : pivot ${p.id} sans libellé.`);
      if (words(p.label) > 18) at(`${where} : pivot ${p.id} trop long (> 18 mots).`);
      if (p.category && p.category !== CATS[i]) at(`${where} : le pivot ${p.id} doit avoir la catégorie « ${CATS[i]} ».`);
    });
  };
  checkPivots(s.pivots, "pivots");
  if (s.pivots_by_choice) for (const c of "ABC") checkPivots(s.pivots_by_choice[c], `pivots_by_choice.${c}`);
  else warns.push(`[${s.id}] pas de pivots_by_choice : les pivots génériques seront affichés.`);

  const keys = Object.keys(s.bilans ?? {});
  if (keys.length !== 9) at(`${keys.length} bilans (attendu 9).`);
  const typesSeen = new Set();
  for (const c of "ABC") {
    let intelligentInRow = 0;
    for (const p of "123") {
      const b = s.bilans?.[`${c}_${p}`];
      if (!b) {
        at(`bilan ${c}_${p} manquant.`);
        continue;
      }
      for (const f of ["turning_point", "pivot_evaluation", "outcome", "key_takeaway"]) {
        if (!b[f]) at(`bilan ${c}_${p} : champ « ${f} » vide.`);
        else if (words(b[f]) > 60) at(`bilan ${c}_${p} : « ${f} » dépasse 60 mots (${words(b[f])}).`);
      }
      if (!TYPES.includes(b.failure_type)) at(`bilan ${c}_${p} : failure_type invalide « ${b.failure_type} ».`);
      typesSeen.add(b.failure_type);
      if (b.failure_type === "intelligent") {
        intelligentInRow++;
        intelligentByCat[CATS[Number(p) - 1]]++;
      }
    }
    if (intelligentInRow === 0) warns.push(`[${s.id}] aucun rebond « intelligent » après le choix ${c}.`);
  }
  if (typesSeen.size < 2) warns.push(`[${s.id}] un seul type d'échec sur les 9 bilans.`);

  // Ton : mots à relire (recherche par mot entier).
  const text = JSON.stringify(s).toLowerCase();
  for (const bad of WATCH) {
    const re = new RegExp(`(^|[^\\p{L}])${bad}($|[^\\p{L}])`, "u");
    if (re.test(text)) warns.push(`[${s.id}] vocabulaire à relire : « ${bad} »`);
  }
}

if (!partial) {
  if (entries.length !== 12) errors.push(`${entries.length} scénario(s) trouvé(s), 12 attendus (§6.1).`);
  for (const t of THEMES) if (!themes.has(t)) errors.push(`thème manquant : « ${t} »`);
}

// Diversité : la « bonne » catégorie de pivot ne doit pas être toujours la même (amendement P0 n°2).
const totalIntel = Object.values(intelligentByCat).reduce((a, b) => a + b, 0);
if (totalIntel >= 6) {
  for (const [cat, n] of Object.entries(intelligentByCat))
    if (n / totalIntel > 0.6) warns.push(`le rebond « intelligent » est « ${cat} » dans ${Math.round((100 * n) / totalIntel)} % des cas : réponse trop prévisible.`);
}

warns.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✗ ${e}`));
  console.error(`\n${errors.length} erreur(s) dans ${target}.`);
  process.exit(1);
}
const dist = Object.entries(intelligentByCat).map(([k, v]) => `${k} ${v}`).join(", ");
console.log(`✓ ${entries.length} scénario(s) valides, ${entries.length * 9} bilans (${target}).`);
console.log(`  Rebonds « intelligents » par catégorie : ${dist}.`);
