// Microcopie : tutoiement en Solo, vouvoiement en Équipe (amendement P2 n°14).
import type { FailureType, Mode, PivotCategory } from "./types";

export function t(mode: Mode) {
  const team = mode === "team";
  return {
    you: team ? "vous" : "tu",
    your: team ? "votre" : "ton",
    yourF: team ? "votre" : "ta",
    yours: team ? "vos" : "tes",
    whatDo: team ? "Que faites-vous ?" : "Que fais-tu ?",
    nowWhat: "Et maintenant ?",
    debate: "Prenez une minute pour en parler avant de valider.",
    continueSetback: team ? "Voyons comment rebondir" : "Voyons comment rebondir",
    reassure: team
      ? "C'était prévu : chaque scénario contient un imprévu. La suite dépend de votre rebond."
      : "C'était prévu : chaque scénario contient un imprévu. La suite dépend de ton rebond.",
    linkedTo: team ? "Lié à votre option" : "Lié à ton option",
    validateChoice: "Valider ce choix",
    validatePivot: team ? "Valider notre rebond" : "Valider mon rebond",
    seeDebrief: team ? "Voir notre bilan" : "Voir mon bilan",
    debriefTitle: team ? "Votre bilan" : "Ton bilan",
    journey: team ? "Votre parcours" : "Ton parcours",
    rebound: team ? "Votre rebond" : "Ton rebond",
    lesson: team ? "Votre leçon" : "Ta leçon",
    lessonPrompt: team ? "Votre leçon en une phrase" : "Ta leçon en une phrase",
    lessonHint: team
      ? "Écrivez-la avec vos mots avant de lire la leçon proposée."
      : "Écris-la avec tes mots avant de lire la leçon proposée.",
    dig: team ? "À vous de creuser" : "À toi de creuser",
    pivotTime: team ? "Votre temps de réflexion au pivot" : "Ton temps de réflexion au pivot",
    copy: team ? "Copier notre bilan (texte)" : "Copier mon bilan (texte)",
    keepCopy: team
      ? "Vos réponses restent uniquement sur ce téléphone et peuvent disparaître (surtout en navigation privée). Gardez une copie :"
      : "Tes réponses restent uniquement sur ce téléphone et peuvent disparaître (surtout en navigation privée). Garde une copie :",
    copied: team
      ? "Copié ✓ — collez-le dans vos notes ou envoyez-le par message."
      : "Copié ✓ — colle-le dans tes notes ou envoie-le-toi par message.",
    questions: team
      ? {
          root_cause: { label: "Selon vous, quelle est la cause profonde ?", help: "Astuce : demandez-vous « pourquoi ? » plusieurs fois.", ph: "Ex. : on a promis sans vérifier…" },
          impact: { label: "Quel aurait été l'impact réel ?", help: "Pour les personnes concernées, le projet, l'équipe.", ph: "Ex. : l'association perdait sa subvention…" },
          next_action: { label: "Quelle sera votre prochaine action concrète ?", help: "Une action que vous pourriez faire cette semaine.", ph: "Ex. : lister les échéances du client dès le début…" },
        }
      : {
          root_cause: { label: "Selon toi, quelle est la cause profonde ?", help: "Astuce : demande-toi « pourquoi ? » plusieurs fois.", ph: "Ex. : on a promis sans vérifier…" },
          impact: { label: "Quel aurait été l'impact réel ?", help: "Pour les personnes concernées, le projet, l'équipe.", ph: "Ex. : l'association perdait sa subvention…" },
          next_action: { label: "Quelle sera ta prochaine action concrète ?", help: "Une action que tu pourrais faire cette semaine.", ph: "Ex. : lister les échéances du client dès le début…" },
        },
  };
}

export const FAILURE_TYPES: Record<FailureType, { label: string; short: string; text: string }> = {
  basique: {
    label: "Échec basique",
    short: "basique",
    text: "Une cause unique en terrain connu : un garde-fou simple (une checklist, une vérification) l'aurait arrêtée.",
  },
  complexe: {
    label: "Échec complexe",
    short: "complexe",
    text: "Plusieurs facteurs se sont combinés ; des signaux faibles existaient.",
  },
  intelligent: {
    label: "Échec intelligent",
    short: "intelligent",
    text: "Un essai réfléchi en terrain inconnu : c'est l'échec qui fait avancer.",
  },
};

export const PIVOT_CATEGORIES: Record<PivotCategory, string> = {
  maintenir: "Maintenir",
  ajuster: "Ajuster",
  changer: "Changer",
};

export const STEPS = ["Situation", "Imprévu", "Pivot", "Résultat"] as const;
