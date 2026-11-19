// Pseudos : saisie libre filtrée (EF-01, EF-02) et générateur « nom + adjectif accordé ».

type Gender = "m" | "f";
const NAMES: [string, Gender][] = [
  ["Loutre", "f"], ["Phénix", "m"], ["Colibri", "m"], ["Hibou", "m"], ["Panthère", "f"],
  ["Baobab", "m"], ["Gazelle", "f"], ["Lion", "m"], ["Tortue", "f"], ["Faucon", "m"],
  ["Comète", "f"], ["Dauphin", "m"], ["Fourmi", "f"], ["Pélican", "m"], ["Abeille", "f"],
  ["Caméléon", "m"], ["Girafe", "f"], ["Héron", "m"], ["Mangouste", "f"], ["Lynx", "m"],
  ["Boussole", "f"], ["Satellite", "m"], ["Fusée", "f"], ["Robot", "m"], ["Étoile", "f"],
  ["Volcan", "m"], ["Rivière", "f"], ["Cactus", "m"], ["Orque", "f"], ["Zèbre", "m"],
  ["Mouette", "f"], ["Pingouin", "m"], ["Luciole", "f"], ["Castor", "m"], ["Antilope", "f"],
  ["Hérisson", "m"], ["Baleine", "f"], ["Éléphant", "m"], ["Chouette", "f"], ["Requin", "m"],
];
// [masculin, féminin]
const ADJECTIVES: [string, string][] = [
  ["Audacieux", "Audacieuse"], ["Tenace", "Tenace"], ["Persévérant", "Persévérante"],
  ["Curieux", "Curieuse"], ["Agile", "Agile"], ["Inventif", "Inventive"], ["Serein", "Sereine"],
  ["Rusé", "Rusée"], ["Lucide", "Lucide"], ["Patient", "Patiente"], ["Vif", "Vive"],
  ["Créatif", "Créative"], ["Calme", "Calme"], ["Intrépide", "Intrépide"], ["Malin", "Maligne"],
  ["Résilient", "Résiliente"], ["Brillant", "Brillante"], ["Joyeux", "Joyeuse"],
  ["Prudent", "Prudente"], ["Rapide", "Rapide"], ["Solide", "Solide"], ["Généreux", "Généreuse"],
  ["Discret", "Discrète"], ["Agité", "Agitée"], ["Pensif", "Pensive"], ["Têtu", "Têtue"],
  ["Optimiste", "Optimiste"], ["Futé", "Futée"], ["Étonnant", "Étonnante"], ["Habile", "Habile"],
  ["Ingénieux", "Ingénieuse"], ["Vaillant", "Vaillante"], ["Attentif", "Attentive"],
  ["Rêveur", "Rêveuse"], ["Hardi", "Hardie"], ["Paisible", "Paisible"], ["Fougueux", "Fougueuse"],
  ["Studieux", "Studieuse"], ["Énergique", "Énergique"], ["Souriant", "Souriante"],
];

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

function pluralize(word: string): string {
  if (/[sxz]$/i.test(word)) return word;
  if (/eau$/i.test(word) || /eu$/i.test(word)) return word + "x";
  if (/al$/i.test(word)) return word.slice(0, -2) + "aux";
  return word + "s";
}

/** Génère un pseudo valide. En mode équipe : « Les Loutres Audacieuses ». */
export function randomPseudo(team = false, rand: () => number = Math.random): string {
  for (let i = 0; i < 30; i++) {
    const [name, g] = pick(NAMES, rand);
    const [m, f] = pick(ADJECTIVES, rand);
    const adj = g === "f" ? f : m;
    const p = team ? `Les ${pluralize(name)} ${pluralize(adj)}` : `${name} ${adj}`;
    if (p.length <= PSEUDO_MAX && validatePseudo(p, team).ok) return p;
  }
  // Repli court : « Les Loutres 42 » / « Loutre 42 ».
  const [name] = pick(NAMES.filter(([n]) => n.length <= 9), rand);
  const n = 10 + Math.floor(rand() * 90);
  return team ? `Les ${pluralize(name)} ${n}` : `${name} ${n}`;
}

export const PSEUDO_MIN = 3;
export const PSEUDO_MAX = 20;

// Lettres (accents compris), chiffres, espace, tiret, tiret bas, point, apostrophe.
const ALLOWED = /^[\p{L}\p{N} _.'’-]+$/u;

// Liste volontairement courte et non affichée à l'utilisateur ; à compléter par le comité.
const BANNED = [
  "connard", "connasse", "salope", "pute", "putain", "merde", "encule", "enculer", "batard",
  "nique", "niquer", "fdp", "pd", "pede", "bougnoul", "negro", "negre", "nazi", "hitler",
  "bite", "couille", "chatte", "cul", "porn", "porno", "sexe", "fuck", "shit", "bitch",
  "dick", "pussy", "nigger", "nigga", "rape", "viol", "kkk", "admin", "organisateur",
];

const LEET: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s" };

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => LEET[c] ?? c);
}

export type PseudoCheck =
  | { ok: true; value: string }
  | { ok: false; reason: "short" | "long" | "chars" | "banned"; message: string };

export function validatePseudo(raw: string, team = false): PseudoCheck {
  const v = team ? { choose: "Choisissez", try: "Essayez", take: "tirez" } : { choose: "Choisis", try: "Essaie", take: "tire" };
  const value = raw.trim().replace(/\s+/g, " ");
  if (value.length < PSEUDO_MIN)
    return { ok: false, reason: "short", message: `${v.choose} un pseudo de ${PSEUDO_MIN} à ${PSEUDO_MAX} caractères.` };
  if (value.length > PSEUDO_MAX)
    return { ok: false, reason: "long", message: `${PSEUDO_MAX} caractères maximum.` };
  if (!ALLOWED.test(value))
    return { ok: false, reason: "chars", message: "Lettres, chiffres, espaces et - _ . ' uniquement." };
  const n = normalize(value);
  const tokens = n.split(/[^a-z]+/).filter(Boolean);
  const compact = n.replace(/[^a-z]/g, "");
  const hit = BANNED.some((w) => tokens.includes(w) || (w.length >= 5 && compact.includes(w)));
  if (hit)
    return { ok: false, reason: "banned", message: `Ce pseudo n'est pas disponible. ${v.try}-en un autre ou ${v.take}-en un au hasard.` };
  return { ok: true, value };
}
