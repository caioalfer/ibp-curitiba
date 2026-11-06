import type { NextConfig } from "next";

// Cache Components (padrão do create-next-app 16) fica desligado: o site usa o modelo
// de ISR com `revalidate` + tags, revalidadas pelo webhook do Sanity (src/app/api/revalidar).
const nextConfig: NextConfig = {
  // Fotos do painel: o navegador já reduz para até ~1-2 MB, mas o padrão de 1 MB das Server Actions é pouco.
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
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
