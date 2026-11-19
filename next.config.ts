import type { NextConfig } from "next";

// Site 100 % statique (cahier §8.1) : aucun serveur, aucune route dynamique.
// BASE_PATH permet de construire le miroir GitHub Pages (ex. BASE_PATH=/fail-forward-esp).
const basePath = process.env.BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
