import { defineField, defineType } from "sanity";
import { agoraEmCuritiba } from "../../lib/datas";
import { TEMAS_ARTIGO } from "../lib/constantes";

const camposComuns = [
  defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
  defineField({
    name: "slug",
    title: "Endereço da página",
    type: "slug",
    options: { source: "titulo", maxLength: 96 },
    validation: (r) => r.required(),
  }),
  defineField({
    name: "data",
    title: "Data",
    type: "date",
    options: { dateFormat: "DD/MM/YYYY" },
    initialValue: () => agoraEmCuritiba().data,
    validation: (r) => r.required(),
  }),
  defineField({
    name: "resumo",
    title: "Resumo",
    type: "text",
    rows: 3,
    description: "Aparece nas listagens e ao compartilhar o link.",
    validation: (r) => r.max(300),
  }),
  defineField({
    name: "imagem",
    title: "Imagem de capa",
    type: "image",
    options: { hotspot: true },
    fields: [defineField({ name: "alt", title: "Descrição da imagem", type: "string" })],
  }),
];

export const noticia = defineType({
  name: "noticia",
  title: "Notícia",
  type: "document",
  fields: [...camposComuns, defineField({ name: "corpo", title: "Texto", type: "textoRico" })],
  orderings: [{ title: "Mais recente", name: "dataDesc", by: [{ field: "data", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "data", media: "imagem" } },
});

export const artigo = defineType({
  name: "artigo",
  title: "Artigo",
  type: "document",
  fields: [
    ...camposComuns,
    defineField({ name: "autor", title: "Autor", type: "reference", to: [{ type: "pessoa" }] }),
    defineField({
      name: "tema",
      title: "Tema",
      type: "string",
      options: { list: [...TEMAS_ARTIGO], layout: "radio" },
    }),
    defineField({ name: "corpo", title: "Texto", type: "textoRico" }),
  ],
  orderings: [{ title: "Mais recente", name: "dataDesc", by: [{ field: "data", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "autor.nome", media: "imagem" } },
});
