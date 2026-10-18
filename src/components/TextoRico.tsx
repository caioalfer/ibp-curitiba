import { PortableText, type PortableTextComponents, type PortableTextBlock } from "next-sanity";
import Image from "next/image";
import { urlImagem } from "@/sanity/lib/image";

const componentes: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure>
          <Image
            src={urlImagem(value).width(1200).url()}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 720px"
            className="h-auto w-full"
          />
          {value.legenda && <figcaption>{value.legenda}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const externo = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
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
