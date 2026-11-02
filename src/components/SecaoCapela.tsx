import Link from "next/link";
import type { Capela } from "@/sanity/lib/queries";
import { ImagemCapela } from "./ImagemCapela";

/** Chamada da campanha na página inicial: resumo e foto à esquerda; "Quero ajudar" leva à página /capela. */
export function SecaoCapela({ capela }: { capela: Capela }) {
  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
      <div>
        <ImagemCapela capela={capela} />
        {capela.resumo && <p className="max-w-[40rem] text-[1.375rem] leading-relaxed font-light">{capela.resumo}</p>}
      </div>

      <div className="flex h-fit flex-col gap-6 rounded-[10px] bg-placa p-7 md:p-9">
        <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">Como ajudar</p>
        <p className="text-suave">
          Conheça o projeto e doe pelo Pix (QR code) ou por transferência bancária.
        </p>
        <Link href="/capela" className="pill pill-primaria self-start">
          Quero ajudar
        </Link>
      </div>
    </div>
  );
}
