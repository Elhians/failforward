// Typographie française : espace insécable (U+00A0) avant « : ; ! ? » et dans les guillemets.
// Aucune police testée ne contient l'espace fine U+202F (rapport, § typographie).
const NBSP = " ";

export function frTypo(text: string): string {
  return text
    .replace(/ ([:;!?»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (h|%|Ko|Mo|s|min)\b/g, `$1${NBSP}$2`);
}
