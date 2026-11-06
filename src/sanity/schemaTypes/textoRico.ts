import { defineArrayMember, defineField, defineType } from "sanity";

// O mesmo formato que o editor do painel (src/components/painel/EditorTexto.tsx) escreve e que o site
// mostra (src/components/TextoRico.tsx). Ao mudar aqui, mudar nos dois e em limparCorpo (src/lib/painel/publicacoes.ts).
export const textoRico = defineType({
  name: "textoRico",
  title: "Texto",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Parágrafo", value: "normal" },
        { title: "Título", value: "h2" },
        { title: "Subtítulo", value: "h3" },
        { title: "Citação", value: "blockquote" },
      ],
      lists: [
        { title: "Lista com marcadores", value: "bullet" },
        { title: "Lista numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negrito", value: "strong" },
          { title: "Itálico", value: "em" },
          { title: "Riscado", value: "strike-through" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [defineField({ name: "href", title: "Endereço", type: "url" })],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Descrição da imagem", type: "string" }),
        defineField({ name: "legenda", title: "Legenda", type: "string" }),
        defineField({
          name: "link",
          title: "Link ao clicar na imagem",
          type: "url",
          validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https"] }),
        }),
      ],
    }),
    defineArrayMember({
      name: "video",
      title: "Vídeo do YouTube",
      type: "object",
      fields: [defineField({ name: "url", title: "Endereço do vídeo", type: "url", validation: (r) => r.required() })],
      preview: { select: { subtitle: "url" }, prepare: ({ subtitle }) => ({ title: "Vídeo do YouTube", subtitle }) },
    }),
    defineArrayMember({
      name: "botao",
      title: "Botão",
      type: "object",
      fields: [
        defineField({ name: "texto", title: "Texto do botão", type: "string", validation: (r) => r.required().max(60) }),
        defineField({
          name: "link",
          title: "Link",
          type: "url",
          validation: (r) => r.required().uri({ allowRelative: true, scheme: ["http", "https"] }),
        }),
      ],
      preview: { select: { title: "texto", subtitle: "link" } },
    }),
    defineArrayMember({
      name: "separador",
      title: "Linha separadora",
      type: "object",
      // O Sanity exige ao menos um campo; este fica escondido.
      fields: [defineField({ name: "estilo", type: "string", hidden: true, initialValue: "linha" })],
      preview: { prepare: () => ({ title: "Linha separadora" }) },
    }),
  ],
});
