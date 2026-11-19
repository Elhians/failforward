// Lot de 12 scénarios (cahier §6.1), embarqués dans l'application : aucun appel réseau le jour J.
// Pour remplacer un scénario : modifier son fichier JSON, puis `npm run validate`.
import type { Scenario } from "@/lib/types";
import crise_lancement from "./scenarios/crise_lancement.json";
import conflit_equipe from "./scenarios/conflit_equipe.json";
import dilemme_ethique from "./scenarios/dilemme_ethique.json";
import pivot_urgence from "./scenarios/pivot_urgence.json";
import panne_production from "./scenarios/panne_production.json";
import ressources_coupees from "./scenarios/ressources_coupees.json";
import fuite_information from "./scenarios/fuite_information.json";
import concurrent_rapide from "./scenarios/concurrent_rapide.json";
import changement_regles from "./scenarios/changement_regles.json";
import partenaire_desiste from "./scenarios/partenaire_desiste.json";
import demo_ratee from "./scenarios/demo_ratee.json";
import surcharge from "./scenarios/surcharge.json";

export const ALL_SCENARIOS = [
  crise_lancement,
  conflit_equipe,
  dilemme_ethique,
  pivot_urgence,
  panne_production,
  ressources_coupees,
  fuite_information,
  concurrent_rapide,
  changement_regles,
  partenaire_desiste,
  demo_ratee,
  surcharge,
] as Scenario[];
