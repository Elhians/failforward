#!/usr/bin/env node
// Génération des scénarios AVANT l'événement, sur l'ordinateur du développeur (cahier §7.3).
// Aucune clé n'est jamais écrite dans le dépôt : elles viennent de l'environnement ou de .env.local.
//
//   node scripts/generate-scenarios.mjs --provider groq --theme "Surcharge"
//   node scripts/generate-scenarios.mjs --provider gemini --all
//   node scripts/generate-scenarios.mjs --dry-run --theme "Surcharge"   (affiche la requête, aucun appel)
//
// Les fichiers sont écrits dans src/content/generated/ (ignoré par git). Après relecture humaine,
// copier un fichier dans src/content/scenarios/ puis lancer `npm run validate`.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const THEMES = {
  "Crise de lancement": ["crise_lancement", "un prestataire clé fait défaut 48 h avant la livraison"],
  "Conflit d'équipe pluridisciplinaire": ["conflit_equipe", "blocage de communication et retard sur un livrable"],
  "Dilemme éthique et budgétaire": ["dilemme_ethique", "un client presse de valider un livrable non testé"],
  "Pivot d'urgence": ["pivot_urgence", "l'hypothèse de marché de départ s'avère fausse"],
  "Panne en production": ["panne_production", "un incident survient pendant une démonstration"],
  "Ressources coupées": ["ressources_coupees", "le budget ou l'équipe est réduit en cours de projet"],
  "Fuite d'information": ["fuite_information", "un document interne circule hors de l'équipe"],
  "Concurrent plus rapide": ["concurrent_rapide", "un projet quasi identique sort avant le vôtre"],
  "Changement de règles": ["changement_regles", "une réglementation ou un cahier des charges change en cours de route"],
  "Partenaire qui se désiste": ["partenaire_desiste", "un lieu ou un fournisseur annule à la dernière minute"],
  "Première démonstration ratée": ["demo_ratee", "le retour du client est très négatif"],
  Surcharge: ["surcharge", "trop de tâches en parallèle et un membre clé s'épuise"],
};

const PROVIDERS = {
  groq: { env: "GROQ_API_KEY", model: "llama-3.3-70b-versatile", perMinute: 30 },
  gemini: { env: "GEMINI_API_KEY", model: "gemini-2.5-flash", perMinute: 10 },
};

function parseArgs(argv) {
  const a = { provider: "groq", out: "src/content/generated", retries: 2 };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const next = () => argv[++i];
    if (k === "--provider") a.provider = next();
    else if (k === "--model") a.model = next();
    else if (k === "--theme") a.theme = next();
    else if (k === "--all") a.all = true;
    else if (k === "--out") a.out = next();
    else if (k === "--dry-run") a.dry = true;
    else if (k === "--help" || k === "-h") a.help = true;
    else throw new Error(`Option inconnue : ${k}`);
  }
  return a;
}

const HELP = `Génère des scénarios Fail Forward avec Groq ou Google AI Studio.

Options :
  --provider groq|gemini   fournisseur (défaut : groq)
  --model <nom>            modèle (défauts : ${PROVIDERS.groq.model} / ${PROVIDERS.gemini.model}, à revérifier dans la console)
  --theme "<thème>"        un seul thème, parmi :
${Object.keys(THEMES).map((t) => `                             - ${t}`).join("\n")}
  --all                    les 12 thèmes, un appel chacun
  --out <dossier>          sortie (défaut : src/content/generated)
  --dry-run                affiche la requête sans appeler l'API (aucune clé nécessaire)

Clés : GROQ_API_KEY ou GEMINI_API_KEY, dans l'environnement ou dans .env.local (jamais dans le dépôt).`;

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

function buildMessages(theme) {
  const [id, hint] = THEMES[theme];
  const system = readFileSync("scripts/prompt-systeme.md", "utf8");
  const example = readFileSync("src/content/scenarios/crise_lancement.json", "utf8");
  const user = [
    `Thème imposé : ${theme} (${hint}).`,
    `Identifiant imposé : "${id}". Champ "theme" : "${theme}".`,
    `Le champ "pivots" contient toujours ces 3 pivots génériques : Maintenir le cap (maintenir), Ajuster partiellement (ajuster), Changer radicalement (changer).`,
    "Écris une situation nouvelle, différente de l'exemple.",
    "",
    "Exemple au format attendu (autre thème) :",
    example,
  ].join("\n");
  return { system, user, id };
}

async function callGroq(model, key, { system, user }) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status} : ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callGemini(model, key, { system, user }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status} : ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
}

/** Valide un fichier avec le validateur du projet ; renvoie la sortie en cas d'erreur. */
function validate(file) {
  try {
    execFileSync(process.execPath, ["scripts/validate-content.mjs", file, "--partial"], { stdio: "pipe" });
    return null;
  } catch (e) {
    return `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.theme && !args.all)) {
    console.log(HELP);
    return;
  }
  const prov = PROVIDERS[args.provider];
  if (!prov) throw new Error(`Fournisseur inconnu : ${args.provider}`);
  const model = args.model || prov.model;
  const themes = args.all ? Object.keys(THEMES) : [args.theme];
  for (const t of themes) if (!THEMES[t]) throw new Error(`Thème inconnu : « ${t} ». Voir --help.`);

  if (args.dry) {
    const m = buildMessages(themes[0]);
    console.log(`--- ${args.provider} / ${model} ---\n[system]\n${m.system}\n[user]\n${m.user}`);
    return;
  }

  loadEnvLocal();
  const key = process.env[prov.env];
  if (!key) throw new Error(`Clé manquante : définir ${prov.env} (environnement ou .env.local).`);
  mkdirSync(args.out, { recursive: true });
  const gap = Math.ceil(60000 / prov.perMinute) + 500;
  const call = args.provider === "groq" ? callGroq : callGemini;

  let ok = 0;
  for (const theme of themes) {
    const msgs = buildMessages(theme);
    const file = join(args.out, `${msgs.id}.json`);
    let lastError = "";
    for (let attempt = 0; attempt <= args.retries; attempt++) {
      process.stdout.write(`${theme} — essai ${attempt + 1}… `);
      try {
        const raw = await call(model, key, {
          ...msgs,
          user: lastError ? `${msgs.user}\n\nLa réponse précédente était invalide :\n${lastError}\nCorrige ces points.` : msgs.user,
        });
        const json = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
        json.id = msgs.id;
        json.theme = theme;
        writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
        lastError = validate(file) ?? "";
        if (!lastError) {
          console.log(`ok → ${file}`);
          ok++;
          break;
        }
        console.log("invalide");
        console.log(lastError.split("\n").slice(0, 8).join("\n"));
      } catch (e) {
        lastError = e.message;
        console.log(`erreur : ${e.message}`);
      }
      await sleep(gap);
    }
    if (themes.length > 1) await sleep(gap);
  }
  console.log(`\n${ok}/${themes.length} scénario(s) valides dans ${args.out}. Relire chaque fichier avant de le copier dans src/content/scenarios/.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
