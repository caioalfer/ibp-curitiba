import { NextStudio } from "next-sanity/studio";
import { sanityConfigurado } from "@/sanity/env";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!sanityConfigurado) {
    return (
      <div className="mx-auto max-w-xl p-10">
        <h1 className="text-3xl font-light">Painel ainda não configurado</h1>
        <p className="mt-3">
          Defina <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> no arquivo <code>.env.local</code> (veja o README).
        </p>
      </div>
    );
  }
  return <NextStudio config={config} />;
}
