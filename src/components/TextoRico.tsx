import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { Imagem } from "./Imagem";
import { alturaDaFoto } from "@/lib/proporcaoFoto";
import { idYoutube, playerYoutube } from "@/lib/youtube";
import { urlImagem } from "@/sanity/lib/image";

// Mostra o texto escrito no painel. Os tipos aceitos estão em src/sanity/schemaTypes/textoRico.ts.
// Também é usado na pré-visualização do painel, por isso nada aqui pode depender do servidor.

const externo = (href: string) => (/^https?:\/\//.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

const componentes: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const foto = (
        // Na proporção padrão (3:2), respeitando o enquadramento feito no painel.
        <Imagem
          src={urlImagem(value).width(1600).height(alturaDaFoto(1600)).fit("crop").url()}
          alt={value.alt ?? ""}
          width={1600}
          height={alturaDaFoto(1600)}
          sizes="(max-width: 768px) 100vw, 720px"
          className="aspect-[3/2] h-auto w-full object-cover"
        />
      );
      const link: string | undefined = value.link;
      return (
        <figure>
          {link ? (
            <a href={link} {...externo(link)} className="block">
              {foto}
            </a>
          ) : (
            foto
          )}
          {value.legenda && <figcaption>{value.legenda}</figcaption>}
        </figure>
      );
    },
    video: ({ value }) => {
      const id = idYoutube(value?.url ?? "");
      if (!id) return null;
      return (
        <figure>
          <iframe
            src={playerYoutube(id)}
            title="Vídeo do YouTube"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="aspect-video w-full rounded-[10px] bg-placa"
          />
        </figure>
      );
    },
    botao: ({ value }) =>
      value?.texto && value?.link ? (
        <p className="botao">
          <a href={value.link} {...externo(value.link)} className="pill pill-primaria">
            {value.texto}
          </a>
        </p>
      ) : null,
    separador: () => <hr />,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      return (
        <a href={href} {...externo(href)}>
          {children}
        </a>
      );
    },
    "strike-through": ({ children }) => <s>{children}</s>,
  },
};

export function TextoRico({ valor }: { valor?: PortableTextBlock[] }) {
  if (!valor?.length) return null;
  return (
    <div className="texto-rico">
      <PortableText value={valor} components={componentes} />
    </div>
  );
}
