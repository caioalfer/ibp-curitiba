export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// Sem projectId o site roda com os dados de exemplo de src/lib/fallback.ts.
export const sanityConfigurado = projectId.length > 0;
