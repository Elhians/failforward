import type { Metadata, Viewport } from "next";
import "./globals.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Fail Forward ESP",
  description: "Ici, rater fait partie du jeu. Une simulation de décision, sans compte, qui fonctionne sans réseau.",
  manifest: `${base}/manifest.webmanifest`,
  icons: {
    icon: `${base}/favicon.png`,
    apple: `${base}/icons/apple-touch-icon.png`,
  },
  appleWebApp: { capable: true, title: "Fail Forward", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00786f" },
    { media: "(prefers-color-scheme: dark)", color: "#16100c" },
  ],
};

// Applique le thème avant le premier rendu (pas de flash blanc dans un amphi sombre).
const themeScript = `(function(){try{var t=localStorage.getItem("ffesp:v1:theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
