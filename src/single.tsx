// Point d'entrée de la version « fichier unique » (EF-16) : même application, sans Next.js.
// Construit par scripts/build-single.mjs en un seul .html autonome, utilisable en file://.
import { createRoot } from "react-dom/client";
import App from "@/components/App";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
