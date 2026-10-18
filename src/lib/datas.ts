// Datas como strings ISO "AAAA-MM-DD", sempre no fuso de Curitiba.
// Usado pelo site e pelo painel (Sanity Studio), por isso sem dependências.

export const FUSO = "America/Sao_Paulo";

const CODIGOS_DIA = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const;
const NOMES_DIA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Data e hora atuais em Curitiba: { data: "2026-10-17", hora: "14:05" }. */
export function agoraEmCuritiba(agora = new Date()) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(agora);
  const p = (tipo: string) => partes.find((x) => x.type === tipo)?.value ?? "";
  return { data: `${p("year")}-${p("month")}-${p("day")}`, hora: `${p("hour")}:${p("minute")}` };
}

function paraUTC(iso: string) {
  return new Date(`${iso}T12:00:00Z`);
}

export function somarDias(iso: string, dias: number) {
  const d = paraUTC(iso);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function indiceDiaSemana(iso: string) {
  return paraUTC(iso).getUTCDay();
}

export function codigoDia(iso: string) {
  return CODIGOS_DIA[indiceDiaSemana(iso)];
}

export function nomeDia(iso: string) {
  return NOMES_DIA[indiceDiaSemana(iso)];
}

/** "17 out" */
export function diaMes(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MESES[Number(m) - 1]}`;
}

/** "17/10" */
export function diaMesCurto(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** "17 de outubro de 2026" */
export function dataPorExtenso(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "UTC" }).format(paraUTC(iso));
}

/** A segunda-feira da semana de `iso`, ou a própria data se já for segunda. */
export function segundaDaSemana(iso: string) {
  const offset = (indiceDiaSemana(iso) + 6) % 7;
  return somarDias(iso, -offset);
}

/** "08:30" → "8h30", "19:00" → "19h" */
export function formatarHora(hora: string) {
  const [h, m] = hora.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}
