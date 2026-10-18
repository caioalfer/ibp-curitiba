import type { Local } from "@/sanity/lib/queries";

export function urlMapa(local: Local) {
  return local.mapaUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(local.endereco)}`;
}

export function LinkMapa({ local, className }: { local: Local; className?: string }) {
  return (
    <a href={urlMapa(local)} target="_blank" rel="noopener noreferrer" className={className}>
      {local.endereco}
    </a>
  );
}
