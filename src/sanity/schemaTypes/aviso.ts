import { defineField, defineType } from "sanity";
import { agoraEmCuritiba, diaMesCurto, somarDias } from "../../lib/datas";

export const aviso = defineType({
  name: "aviso",
  title: "Aviso",
  type: "document",
  description: "Texto curto. Some do site automaticamente depois da data de validade.",
  fields: [
    defineField({
      name: "texto",
      title: "Aviso",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(280).warning("Avisos curtos funcionam melhor."),
    }),
    defineField({
      name: "validoAte",
      title: "Mostrar até (inclusive)",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      initialValue: () => somarDias(agoraEmCuritiba().data, 7),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Opcional. Ex.: um post do Instagram ou uma notícia.",
      validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  orderings: [{ title: "Validade", name: "validade", by: [{ field: "validoAte", direction: "desc" }] }],
  preview: {
    select: { texto: "texto", validoAte: "validoAte" },
    prepare: ({ texto, validoAte }) => {
      const vencido = validoAte && validoAte < agoraEmCuritiba().data;
      return {
        title: texto,
        subtitle: validoAte ? `${vencido ? "Expirado em" : "Até"} ${diaMesCurto(validoAte)}` : "",
      };
    },
  },
});
