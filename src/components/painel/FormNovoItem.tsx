"use client";

import { useActionState, useEffect, useRef } from "react";
import { adicionarItem, type EstadoNovoItem } from "@/app/painel/(area)/semana/acoes";
import { TIPOS_ATIVIDADE } from "@/sanity/lib/constantes";
import { BotaoEnviar } from "./Botoes";

const CAMPO =
  "h-12 w-full rounded-[10px] border border-linha bg-fundo px-4 text-base text-tinta transition-colors duration-200 hover:border-suave focus:border-tinta focus:outline-none aria-[invalid=true]:border-tinta";

export function FormNovoItem({
  semanaId,
  dias,
  locais,
}: {
  semanaId: string;
  dias: { data: string; rotulo: string }[];
  locais: { _id: string; nome: string }[];
}) {
  const [estado, acao] = useActionState<EstadoNovoItem, FormData>(adicionarItem, {});
  const form = useRef<HTMLFormElement>(null);
  const erros = estado.erros ?? {};

  // Depois de acrescentar, limpa hora, título e observação (mantém dia, tipo e local para lançar vários).
  useEffect(() => {
    if (!estado.ok || !form.current) return;
    for (const nome of ["hora", "titulo", "nota"]) {
      const campo = form.current.elements.namedItem(nome) as HTMLInputElement | null;
      if (campo) campo.value = "";
    }
  }, [estado.ok]);

  return (
    <form ref={form} action={acao} className="rounded-[10px] bg-placa p-7 md:p-9" noValidate>
      <input type="hidden" name="semanaId" value={semanaId} />
      <h2 className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">Acrescentar horário</h2>
      <p className="mt-2 text-suave">Missa, confissão ou devoção extra nesta semana.</p>

      {erros.geral && (
        <p role="alert" className="mt-6 rounded-[10px] border border-tinta p-4">
          {erros.geral}
        </p>
      )}
      {estado.ok && !estado.erros && (
        <p role="status" className="mt-6 text-suave">
          Horário acrescentado.
        </p>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Campo rotulo="Dia" erro={erros.data} id="novo-data">
          <select id="novo-data" name="data" className={CAMPO} aria-invalid={Boolean(erros.data)}>
            {dias.map((d) => (
              <option key={d.data} value={d.data}>
                {d.rotulo}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Hora" erro={erros.hora} id="novo-hora">
          <input id="novo-hora" name="hora" type="time" required className={CAMPO} aria-invalid={Boolean(erros.hora)} />
        </Campo>
        <Campo rotulo="Tipo" erro={erros.tipo} id="novo-tipo">
          <select id="novo-tipo" name="tipo" className={CAMPO} aria-invalid={Boolean(erros.tipo)}>
            {TIPOS_ATIVIDADE.map((t) => (
              <option key={t.value} value={t.value}>
                {t.title}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Local" erro={erros.local} id="novo-local">
          <select id="novo-local" name="local" defaultValue="" className={CAMPO} aria-invalid={Boolean(erros.local)}>
            <option value="" disabled>
              Escolha…
            </option>
            {locais.map((l) => (
              <option key={l._id} value={l._id}>
                {l.nome}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Título (opcional)" id="novo-titulo" dica="Ex.: Missa de Cristo Rei" className="sm:col-span-2">
          <input id="novo-titulo" name="titulo" type="text" maxLength={80} className={CAMPO} />
        </Campo>
        <Campo rotulo="Observação (opcional)" id="novo-nota" dica="Ex.: seguida de bênção" className="sm:col-span-2">
          <input id="novo-nota" name="nota" type="text" maxLength={120} className={CAMPO} />
        </Campo>
      </div>

      <div className="mt-8">
        <BotaoEnviar pendente="Acrescentando…">Acrescentar</BotaoEnviar>
      </div>
    </form>
  );
}

function Campo({
  rotulo,
  id,
  erro,
  dica,
  className = "",
  children,
}: {
  rotulo: string;
  id: string;
  erro?: string;
  dica?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-medium">
        {rotulo}
      </label>
      {children}
      {(erro || dica) && <p className={`mt-1.5 text-sm ${erro ? "text-tinta" : "text-suave"}`}>{erro ?? dica}</p>}
    </div>
  );
}
