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

const camposDoPainel = [
  defineField({ name: "atualizadoPor", title: "Última alteração por", type: "string", readOnly: true, description: "Preenchido pelo painel do site." }),
  defineField({ name: "atualizadoEm", title: "Última alteração em", type: "datetime", readOnly: true }),
];

export const noticia = defineType({
  name: "noticia",
  title: "Notícia",
  type: "document",
  fields: [...camposComuns, defineField({ name: "corpo", title: "Texto", type: "textoRico" }), ...camposDoPainel],
  orderings: [{ title: "Mais recente", name: "dataDesc", by: [{ field: "data", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "data", media: "imagem" } },
});

export const artigo = defineType({
  name: "artigo",
  title: "Artigo",
  type: "document",
  fields: [
    ...camposComuns,
    defineField({
      name: "autor",
      title: "Autor",
      type: "string",
      description: "Nome como deve aparecer no site. Ex.: Pe. Thiago Bonifácio",
    }),
    defineField({
      name: "tema",
      title: "Tema",
      type: "string",
      options: { list: [...TEMAS_ARTIGO], layout: "radio" },
    }),
    defineField({ name: "corpo", title: "Texto", type: "textoRico" }),
    ...camposDoPainel,
  ],
  orderings: [{ title: "Mais recente", name: "dataDesc", by: [{ field: "data", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "autor", media: "imagem" } },
});
