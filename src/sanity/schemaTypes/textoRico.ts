import { defineArrayMember, defineField, defineType } from "sanity";

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
      marks: {
        decorators: [
          { title: "Negrito", value: "strong" },
          { title: "Itálico", value: "em" },
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
      ],
    }),
  ],
});
