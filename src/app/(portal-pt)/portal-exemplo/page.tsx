import type { Metadata } from "next";
import { PortalExemplo } from "./PortalExemplo";

const TITLE = "Exemplo do acompanhamento do seu projeto";
const DESC =
  "Veja, com dados fictícios, como acompanho cada projeto: etapas, entregas, progresso, datas e comentários, tudo numa página só.";

export const metadata: Metadata = {
  metadataBase: new URL("https://pavin.me"),
  title: `${TITLE} · Fellipe Pavin`,
  description: DESC,
  alternates: { canonical: "https://pavin.me/portal-exemplo" },
  // Demonstração com conteúdo fino: fora do índice (e fora do sitemap.ts).
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://pavin.me/portal-exemplo",
    siteName: "pavin.me",
    title: TITLE,
    description: DESC,
    // Reaproveita a imagem de compartilhamento do site (src/app/opengraph-image.tsx).
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/opengraph-image"],
  },
};

export default function PortalExemploPage() {
  return (
    <>
      <div className="sticky top-0 z-40 border-b border-amber-500/30 bg-amber-500/15 px-4 py-1.5 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-amber-600 backdrop-blur dark:text-amber-400">
        Exemplo com dados fictícios
      </div>
      <PortalExemplo />
    </>
  );
}
