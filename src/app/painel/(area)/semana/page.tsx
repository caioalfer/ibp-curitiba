import Link from "next/link";
import { CorLiturgica } from "@/components/CorLiturgica";
import { BotaoConfirmar, BotaoEnviar } from "@/components/painel/Botoes";
import { FormNovoItem } from "@/components/painel/FormNovoItem";
import { quandoAlterado, Voltar } from "@/components/painel/Voltar";
import { agoraEmCuritiba, diaMes, formatarHora, nomeDia, segundaDaSemana, somarDias } from "@/lib/datas";
import { lerPainel } from "@/lib/painel/sanity";
import {
  itensDosPadroes,
  QUERY_PADROES_PAINEL,
  QUERY_SEMANA_PAINEL,
  type ItemSemana,
  type PadraoBruto,
  type SemanaPainel,
} from "@/lib/painel/semana";
import { exigirAcesso } from "@/lib/painel/sessao";
import { CORES_LITURGICAS, rotuloTipo } from "@/sanity/lib/constantes";
import { alternarCancelado, comecarSemana, definirLocal, definirLocalDosSemLocal, removerItem, salvarDestaque } from "./acoes";

export const metadata = { title: "Programação" };

type LocalPainel = { _id: string; nome: string; apelido?: string };

const CAMPO =
  "h-11 rounded-[10px] border border-borda-campo bg-fundo px-3 text-base text-tinta transition-colors duration-200 hover:border-suave focus:border-tinta focus:outline-none";

export default async function SemanaDoPainel({ searchParams }: PageProps<"/painel/semana">) {
  await exigirAcesso();
  const { s } = await searchParams;
  const hoje = agoraEmCuritiba().data;
  const segunda = segundaDaSemana(hoje);
  const proxima = s === "proxima";
  const inicio = proxima ? somarDias(segunda, 7) : segunda;

  const [semana, padroes, locais] = await Promise.all([
    lerPainel<SemanaPainel | null>(QUERY_SEMANA_PAINEL, { inicio }),
    lerPainel<PadraoBruto[]>(QUERY_PADROES_PAINEL),
    lerPainel<LocalPainel[]>(`*[_type == "local"] | order(nome asc){_id, nome, apelido}`),
  ]);

  const dias = Array.from({ length: 7 }, (_, i) => somarDias(inicio, i));
  const periodo = (ini: string) => `${diaMes(ini)} a ${diaMes(somarDias(ini, 6))}`;
  const semLocal = semana?.itens?.filter((i) => !i.local && !i.cancelado).length ?? 0;

  return (
    <>
      <Voltar href="/painel">Painel</Voltar>
      <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] leading-none font-light tracking-[-0.04em]">Programação</h1>

      <nav aria-label="Semana" className="mt-8 flex flex-wrap gap-3">
        <Link href="/painel/semana" aria-current={!proxima ? "page" : undefined} className={`pill ${!proxima ? "pill-primaria" : "pill-contorno"} min-h-10 text-[0.9375rem]`}>
          Esta semana · {periodo(segunda)}
        </Link>
        <Link href="/painel/semana?s=proxima" aria-current={proxima ? "page" : undefined} className={`pill ${proxima ? "pill-primaria" : "pill-contorno"} min-h-10 text-[0.9375rem]`}>
          Próxima semana · {periodo(somarDias(segunda, 7))}
        </Link>
      </nav>

      {!semana ? (
        <SemanaNaoIniciada inicio={inicio} itens={itensDosPadroes(inicio, padroes)} locais={locais} hoje={hoje} />
      ) : (
        <>
          <div className="mt-8 space-y-3 text-suave">
            {semana.atualizadoPor && (
              <p>
                Última alteração por {semana.atualizadoPor}, {quandoAlterado(semana.atualizadoEm)}.
              </p>
            )}
            {semLocal > 0 && (
              <div role="status" className="rounded-[10px] border border-tinta p-4 text-tinta md:p-5">
                <p>
                  {semLocal === 1 ? "1 horário está" : `${semLocal} horários estão`} sem local. No site aparece “local a confirmar”.
                  Escolha em cada horário abaixo ou marque todos de uma vez:
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {locais.map((l) => (
                    <form key={l._id} action={definirLocalDosSemLocal}>
                      <input type="hidden" name="semanaId" value={semana._id} />
                      <input type="hidden" name="local" value={l._id} />
                      <BotaoEnviar pendente="Marcando…" className="pill pill-contorno min-h-10 text-[0.9375rem]">
                        Todos na {l.apelido || l.nome}
                      </BotaoEnviar>
                    </form>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ol className="mt-10 border-t border-linha">
            {dias.map((data) => {
              const itens = (semana.itens ?? []).filter((i) => i.data === data).sort((a, b) => a.hora.localeCompare(b.hora));
              const destaque = semana.destaques?.find((d) => d.data === data);
              return (
                <li key={data} className="grid gap-x-10 gap-y-5 border-b border-linha py-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
                  <div>
                    <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">{nomeDia(data)}</p>
                    <p className="mt-1 text-suave">
                      {diaMes(data)}
                      {data === hoje && " · hoje"}
                    </p>
                  </div>
                  <div className="space-y-5">
                    {/* A chave muda com o conteúdo salvo: o formulário é recriado e mostra o valor gravado (o React limpa formulários depois de enviar). */}
                    <FormDestaque
                      key={`${data}-${destaque?.texto ?? ""}-${destaque?.cor ?? ""}`}
                      semanaId={semana._id}
                      data={data}
                      destaque={destaque}
                    />
                    {itens.length === 0 ? (
                      <p className="text-suave">Sem horários neste dia.</p>
                    ) : (
                      <ul className="space-y-3">
                        {itens.map((item) => (
                          <LinhaItem key={item._key} semanaId={semana._id} item={item} locais={locais} />
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12">
            <FormNovoItem
              semanaId={semana._id}
              dias={dias.map((d) => ({ data: d, rotulo: `${nomeDia(d)}, ${diaMes(d)}` }))}
              locais={locais}
            />
          </div>
        </>
      )}
    </>
  );
}

function SemanaNaoIniciada({ inicio, itens, locais, hoje }: { inicio: string; itens: ReturnType<typeof itensDosPadroes>; locais: LocalPainel[]; hoje: string }) {
  const nomeLocal = (id?: string) => locais.find((l) => l._id === id)?.apelido;
  return (
    <>
      <div className="mt-10 rounded-[10px] bg-placa p-7 md:p-9">
        <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">Esta semana segue os horários habituais</p>
        <p className="mt-3 max-w-2xl text-suave">
          Para cancelar ou acrescentar horários, escolher o local de cada um ou destacar a festa do dia, comece a ajustar a
          semana. Os horários habituais já vêm preenchidos.
        </p>
        <form action={comecarSemana} className="mt-6">
          <input type="hidden" name="inicio" value={inicio} />
          <BotaoEnviar pendente="Preparando…">Ajustar esta semana</BotaoEnviar>
        </form>
      </div>

      <h2 className="mt-12 text-[1.75rem] leading-tight font-light tracking-[-0.025em]">Como está no site</h2>
      <ol className="mt-6 border-t border-linha text-suave">
        {Array.from({ length: 7 }, (_, i) => somarDias(inicio, i)).map((data) => {
          const doDia = itens.filter((i) => i.data === data);
          return (
            <li key={data} className="grid gap-x-10 gap-y-2 border-b border-linha py-5 lg:grid-cols-[12rem_minmax(0,1fr)]">
              <p className="text-tinta">
                {nomeDia(data)}, {diaMes(data)}
                {data === hoje && " · hoje"}
              </p>
              <p>
                {doDia.length === 0
                  ? "Sem horários"
                  : doDia.map((i) => `${formatarHora(i.hora)} ${i.titulo || rotuloTipo(i.tipo)}${nomeLocal(i.local?._ref) ? ` (${nomeLocal(i.local?._ref)})` : ""}`).join(" · ")}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function LinhaItem({ semanaId, item, locais }: { semanaId: string; item: ItemSemana; locais: LocalPainel[] }) {
  const nome = item.titulo || rotuloTipo(item.tipo);
  const ocultos = (
    <>
      <input type="hidden" name="semanaId" value={semanaId} />
      <input type="hidden" name="chave" value={item._key} />
    </>
  );
  return (
    <li className={`rounded-[10px] border p-4 md:p-5 ${!item.local && !item.cancelado ? "border-tinta" : "border-linha"}`}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className={`text-lg tabular-nums ${item.cancelado ? "text-suave line-through" : ""}`}>{formatarHora(item.hora)}</span>
        <span className={`text-lg ${item.cancelado ? "text-suave line-through" : "font-medium"}`}>{nome}</span>
        {item.cancelado && <span className="rotulo text-suave">Cancelado</span>}
        {!item.local && !item.cancelado && <span className="rotulo">Sem local</span>}
        {item.nota && <span className="basis-full text-sm text-suave">{item.nota}</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-suave">Local:</span>
        {locais.map((l) => {
          const escolhido = item.local === l._id;
          return (
            <form key={l._id} action={definirLocal}>
              {ocultos}
              <input type="hidden" name="local" value={escolhido ? "" : l._id} />
              <BotaoEnviar
                pendente="…"
                aria-pressed={escolhido}
                title={escolhido ? "Clique para desmarcar" : `Marcar ${l.nome}`}
                className={`pill min-h-9 px-4 text-[0.875rem] ${escolhido ? "pill-primaria" : "pill-contorno"}`}
              >
                {l.apelido || l.nome}
              </BotaoEnviar>
            </form>
          );
        })}
        <span className="mx-1 hidden h-5 w-px bg-linha sm:block" aria-hidden="true" />
        <form action={alternarCancelado}>
          {ocultos}
          <BotaoEnviar pendente="…" className="pill pill-contorno min-h-9 px-4 text-[0.875rem]">
            {item.cancelado ? "Reativar" : "Cancelar"}
          </BotaoEnviar>
        </form>
        <form action={removerItem}>
          {ocultos}
          <BotaoConfirmar
            pergunta={`Remover ${nome} das ${formatarHora(item.hora)}? Para só avisar que não vai acontecer, use "Cancelar".`}
            className="pill min-h-9 px-4 text-[0.875rem] text-suave hover:text-tinta"
          >
            Remover
          </BotaoConfirmar>
        </form>
      </div>
    </li>
  );
}

function FormDestaque({ semanaId, data, destaque }: { semanaId: string; data: string; destaque?: { texto: string; cor?: string } }) {
  return (
    <form action={salvarDestaque} className="flex flex-wrap items-center gap-2">
      {destaque?.cor && <CorLiturgica cor={destaque.cor} className="mr-1" />}
      <input type="hidden" name="semanaId" value={semanaId} />
      <input type="hidden" name="data" value={data} />
      <label className="sr-only" htmlFor={`destaque-${data}`}>
        Festa ou observação do dia
      </label>
      <input
        id={`destaque-${data}`}
        name="texto"
        type="text"
        maxLength={80}
        defaultValue={destaque?.texto ?? ""}
        placeholder="Festa ou observação do dia (opcional)"
        className={`${CAMPO} min-w-0 flex-1 basis-56`}
      />
      <label className="sr-only" htmlFor={`cor-${data}`}>
        Cor litúrgica
      </label>
      <select id={`cor-${data}`} name="cor" defaultValue={destaque?.cor ?? ""} className={CAMPO}>
        <option value="">Sem cor</option>
        {CORES_LITURGICAS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.title}
          </option>
        ))}
      </select>
      <BotaoEnviar pendente="…" className="pill pill-contorno min-h-11 px-4 text-[0.875rem]">
        Salvar
      </BotaoEnviar>
      {destaque && (
        <BotaoEnviar name="remover" value="1" pendente="…" className="pill min-h-11 px-4 text-[0.875rem] text-suave hover:text-tinta">
          Tirar
        </BotaoEnviar>
      )}
    </form>
  );
}
