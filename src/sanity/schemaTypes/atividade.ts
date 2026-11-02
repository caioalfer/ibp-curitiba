import { defineField } from "sanity";
import { HORA_REGEX, TIPOS_ATIVIDADE } from "../lib/constantes";

export { rotuloTipo } from "../lib/constantes";

// Campos comuns a um horário padrão e a um item da programação semanal.
/** Local de um item da programação semanal: é o administrador quem define, a cada semana. */
export const campoLocalSemana = defineField({
  name: "local",
  title: "Local",
  type: "reference",
  to: [{ type: "local" }],
  description: "Onde será: na Capela ou na Casa do Padre. Obrigatório, a menos que o horário esteja cancelado.",
  validation: (r) =>
    r.custom((valor, contexto) => {
      const cancelado = (contexto.parent as { cancelado?: boolean } | undefined)?.cancelado;
      return valor || cancelado ? true : "Escolha o local deste horário.";
    }),
});

export const camposAtividade = [
  defineField({
    name: "hora",
    title: "Hora",
    type: "string",
    description: "Formato 24h, ex.: 08:30",
    validation: (r) =>
      r.required().custom((v) => (!v || HORA_REGEX.test(v) ? true : "Use o formato HH:MM, ex.: 08:30")),
  }),
  defineField({
    name: "tipo",
    title: "Tipo",
    type: "string",
    options: { list: [...TIPOS_ATIVIDADE], layout: "dropdown" },
    validation: (r) => r.required(),
  }),
  defineField({
    name: "titulo",
    title: "Título personalizado",
    type: "string",
    description: 'Opcional. Substitui o nome do tipo, ex.: "Procissão de Cristo Rei"',
  }),
  defineField({
    name: "local",
    title: "Local",
    type: "reference",
    to: [{ type: "local" }],
    description: "Opcional. Se preenchido, já vem marcado em cada semana nova; o administrador pode mudar.",
  }),
  defineField({
    name: "nota",
    title: "Observação",
    type: "string",
    description: 'Opcional. Ex.: "Seguida de bênção"',
  }),
];
