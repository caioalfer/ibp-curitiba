import { defineField, defineType } from "sanity";

export const local = defineType({
  name: "local",
  title: "Local",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      description: "Ex.: Capela da Imaculada Conceição",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "apelido",
      title: "Nome curto",
      type: "string",
      description: "Aparece na programação. Ex.: Capela",
    }),
    defineField({
      name: "endereco",
      title: "Endereço",
      type: "string",
      description: "Ex.: Av. Lamenha Lins, 2115 – Rebouças",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "mapaUrl",
      title: "Link do mapa",
      type: "url",
      description: "Opcional. Se vazio, o site gera um link do Google Maps a partir do endereço.",
    }),
  ],
  preview: { select: { title: "nome", subtitle: "endereco" } },
});
