export const DIAS = [
  { value: "dom", title: "Domingo" },
  { value: "seg", title: "Segunda-feira" },
  { value: "ter", title: "Terça-feira" },
  { value: "qua", title: "Quarta-feira" },
  { value: "qui", title: "Quinta-feira" },
  { value: "sex", title: "Sexta-feira" },
  { value: "sab", title: "Sábado" },
] as const;

export type Dia = (typeof DIAS)[number]["value"];

export const TIPOS_ATIVIDADE = [
  { value: "missa-rezada", title: "Missa rezada" },
  { value: "missa-cantada", title: "Missa cantada" },
  { value: "missa-solene", title: "Missa solene" },
  { value: "confissoes", title: "Confissões" },
  { value: "exposicao", title: "Exposição do Santíssimo" },
  { value: "terco", title: "Santo Terço" },
  { value: "outro", title: "Outro" },
] as const;

export type TipoAtividade = (typeof TIPOS_ATIVIDADE)[number]["value"];

export const CORES_LITURGICAS = [
  { value: "branco", title: "Branco" },
  { value: "vermelho", title: "Vermelho" },
  { value: "verde", title: "Verde" },
  { value: "roxo", title: "Roxo" },
  { value: "rosa", title: "Rosa" },
  { value: "preto", title: "Preto" },
] as const;

export type CorLiturgica = (typeof CORES_LITURGICAS)[number]["value"];

export const TEMAS_ARTIGO = [
  { value: "liturgia", title: "Liturgia" },
  { value: "doutrina", title: "Doutrina" },
  { value: "vida-espiritual", title: "Vida espiritual" },
  { value: "familia", title: "Família" },
  { value: "sermao", title: "Sermão" },
] as const;

export const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export function rotuloTipo(tipo?: string) {
  return TIPOS_ATIVIDADE.find((t) => t.value === tipo)?.title ?? tipo ?? "";
}
