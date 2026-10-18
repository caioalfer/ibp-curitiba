import type { NextConfig } from "next";

// Cache Components (padrão do create-next-app 16) fica desligado: o site usa o modelo
// de ISR com `revalidate` + tags, revalidadas pelo webhook do Sanity (src/app/api/revalidar).
const nextConfig: NextConfig = {
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
