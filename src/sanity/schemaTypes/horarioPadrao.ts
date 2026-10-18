import { defineField, defineType } from "sanity";
import { DIAS } from "../lib/constantes";
import { camposAtividade, rotuloTipo } from "./atividade";

export const horarioPadrao = defineType({
  name: "horarioPadrao",
  title: "Horário padrão",
  type: "document",
  description: "Regra fixa. Serve de base para cada nova programação semanal.",
  fields: [
    defineField({
      name: "dias",
      title: "Dias da semana",
      type: "array",
      of: [{ type: "string" }],
      options: { list: [...DIAS], layout: "grid" },
      validation: (r) => r.required().min(1),
    }),
    ...camposAtividade,
  ],
  orderings: [{ title: "Hora", name: "hora", by: [{ field: "hora", direction: "asc" }] }],
  preview: {
    select: { dias: "dias", hora: "hora", tipo: "tipo", titulo: "titulo", local: "local.apelido" },
    prepare({ dias, hora, tipo, titulo, local }) {
      const nomes = (dias as string[] | undefined)
        ?.map((d) => DIAS.find((x) => x.value === d)?.title.slice(0, 3))
        .join(", ");
      return {
        title: `${hora ?? "--:--"} · ${titulo || rotuloTipo(tipo)}`,
        subtitle: [nomes, local].filter(Boolean).join(" · "),
      };
    },
  },
});
