import Image from "next/image";
import { urlImagem } from "@/sanity/lib/image";
import type { Capela } from "@/sanity/lib/queries";

/** Imagem principal do projeto da capela: a do painel ou, sem ela, a arte da campanha. */
export function ImagemCapela({ capela, prioridade = false }: { capela: Capela; prioridade?: boolean }) {
  if (!capela.imagem && !capela.imagemLocal) return null;
  return (
    <figure className="mb-10">
      {capela.imagem ? (
        <Image
          src={urlImagem(capela.imagem).width(1400).url()}
          alt={capela.imagem.alt ?? ""}
          width={1400}
          height={900}
          priority={prioridade}
          sizes="(max-width: 768px) 100vw, 640px"
          className="h-auto w-full rounded-[10px]"
        />
      ) : (
        <Image
          src={capela.imagemLocal!}
          alt={capela.imagemAlt ?? ""}
          priority={prioridade}
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, 640px"
          className="h-auto w-full rounded-[10px]"
        />
      )}
    </figure>
  );
}
