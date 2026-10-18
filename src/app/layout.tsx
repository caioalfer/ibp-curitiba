import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { SCRIPT_TEMA } from "@/lib/tema";
import "./globals.css";

const texto = Geist({ variable: "--font-texto", subsets: ["latin"], weight: ["300", "400", "500"] });
const destaque = Instrument_Serif({
  variable: "--font-destaque",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Instituto Bom Pastor – Curitiba",
    template: "%s · Instituto Bom Pastor – Curitiba",
  },
  description:
    "Missa Tradicional em Curitiba. Horários de Missas e confissões, avisos, notícias e artigos do Instituto Bom Pastor.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${texto.variable} ${destaque.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Tema antes da pintura; o atributo data-tema muda no navegador, daí o suppressHydrationWarning. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
