import { defineArrayMember, defineField, defineType } from "sanity";
import { agoraEmCuritiba, codigoDia, diaMesCurto, nomeDia, segundaDaSemana, somarDias } from "../../lib/datas";
import { apiVersion } from "../env";
import { CORES_LITURGICAS } from "../lib/constantes";
import { camposAtividade, rotuloTipo } from "./atividade";

type Padrao = {
  dias?: string[];
  hora?: string;
  tipo?: string;
  titulo?: string;
  nota?: string;
  local?: { _ref: string };
};

const chave = () => Math.random().toString(36).slice(2, 12);

export const semana = defineType({
  name: "semana",
  title: "Programação semanal",
  type: "document",
  description:
    "Já começa preenchida com os horários padrão. Ajuste só o que muda nesta semana (de segunda a domingo).",
  // Nova semana: começa na próxima segunda-feira e copia os horários padrão.
  initialValue: async (_params, { getClient }) => {
    const hoje = agoraEmCuritiba().data;
    const segundaAtual = segundaDaSemana(hoje);
    const inicio = segundaAtual === hoje ? hoje : somarDias(segundaAtual, 7);

    const padroes = await getClient({ apiVersion }).fetch<Padrao[]>(
      `*[_type == "horarioPadrao" && !(_id in path("drafts.**"))]{dias, hora, tipo, titulo, nota, local}`,
    );

    const itens = [];
    for (let i = 0; i < 7; i++) {
      const data = somarDias(inicio, i);
      for (const p of padroes.filter((x) => x.dias?.includes(codigoDia(data)))) {
        itens.push({
          _key: chave(),
          _type: "itemProgramacao",
          data,
          hora: p.hora,
          tipo: p.tipo,
          titulo: p.titulo,
          nota: p.nota,
          local: p.local ? { _type: "reference", _ref: p.local._ref } : undefined,
        });
      }
    }
    itens.sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`));

    return { inicio, itens };
  },
  fields: [
    defineField({
      name: "inicio",
      title: "Início da semana (segunda-feira)",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      description:
        "Se mudar esta data depois de criada, as datas dos itens abaixo não mudam sozinhas. Nesse caso é mais fácil apagar e criar a semana de novo.",
      validation: (r) =>
        r.required().custom(async (valor, contexto) => {
          if (!valor) return true;
          if (codigoDia(valor) !== "seg") return "A semana deve começar numa segunda-feira.";
          const id = contexto.document?._id.replace(/^drafts\./, "");
          const repetidas = await contexto
            .getClient({ apiVersion })
            .fetch<number>(
              `count(*[_type == "semana" && inicio == $valor && !(_id in [$id, "drafts." + $id])])`,
              { valor, id },
            );
          return repetidas > 0 ? "Já existe uma programação para esta semana." : true;
        }),
    }),
    defineField({
      name: "destaques",
      title: "Destaques dos dias",
      type: "array",
      description: 'Opcional. Festa ou observação de um dia, ex.: "Cristo Rei – I classe".',
      of: [
        defineArrayMember({
          name: "destaqueDia",
          type: "object",
          fields: [
            defineField({ name: "data", title: "Dia", type: "date", validation: (r) => r.required() }),
            defineField({ name: "texto", title: "Texto", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "cor",
              title: "Cor litúrgica",
              type: "string",
              options: { list: [...CORES_LITURGICAS] },
            }),
          ],
          preview: {
            select: { data: "data", texto: "texto" },
            prepare: ({ data, texto }) => ({
              title: texto,
              subtitle: data ? `${nomeDia(data)}, ${diaMesCurto(data)}` : "",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "itens",
      title: "Programação",
      type: "array",
      of: [
        defineArrayMember({
          name: "itemProgramacao",
          type: "object",
          fields: [
            defineField({ name: "data", title: "Dia", type: "date", validation: (r) => r.required() }),
            ...camposAtividade,
            defineField({
              name: "cancelado",
              title: "Cancelado",
              type: "boolean",
              description: "Marque para mostrar o horário riscado, em vez de simplesmente apagá-lo.",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              data: "data",
              hora: "hora",
              tipo: "tipo",
              titulo: "titulo",
              cancelado: "cancelado",
              local: "local.apelido",
            },
            prepare: ({ data, hora, tipo, titulo, cancelado, local }) => ({
              title: `${cancelado ? "[CANCELADO] " : ""}${hora ?? "--:--"} · ${titulo || rotuloTipo(tipo)}`,
              subtitle: [data ? `${nomeDia(data)}, ${diaMesCurto(data)}` : "", local].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
      validation: (r) =>
        r.custom((itens, contexto) => {
          const inicio = (contexto.document as { inicio?: string } | undefined)?.inicio;
          if (!inicio || !Array.isArray(itens)) return true;
          const fim = somarDias(inicio, 6);
          const fora = (itens as { data?: string }[]).filter((i) => i.data && (i.data < inicio || i.data > fim));
          return fora.length ? `${fora.length} item(ns) com data fora desta semana.` : true;
        }),
    }),
  ],
  orderings: [{ title: "Mais recente", name: "inicioDesc", by: [{ field: "inicio", direction: "desc" }] }],
  preview: {
    select: { inicio: "inicio" },
    prepare: ({ inicio }) => ({
      title: inicio ? `Semana de ${diaMesCurto(inicio)} a ${diaMesCurto(somarDias(inicio, 6))}` : "Nova semana",
    }),
  },
});
