"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { salvarAviso, type EstadoAviso } from "@/app/painel/(area)/avisos/acoes";
import { BotaoEnviar } from "./Botoes";

const CAMPO =
  "w-full rounded-[10px] border border-linha bg-fundo px-4 text-base text-tinta transition-colors duration-200 placeholder:text-suave hover:border-suave focus:border-tinta focus:outline-none aria-[invalid=true]:border-tinta";

export function FormAviso({
  aviso,
  hoje,
  sugestaoValidade,
}: {
  aviso?: { _id: string; texto: string; validoAte: string; link?: string };
  hoje: string;
  sugestaoValidade: string;
}) {
  const [estado, acao] = useActionState<EstadoAviso, FormData>(salvarAviso, {});
  const [texto, setTexto] = useState(aviso?.texto ?? "");
  const erros = estado.erros ?? {};

  return (
    <form action={acao} className="max-w-2xl space-y-8" noValidate>
      {aviso && <input type="hidden" name="id" value={aviso._id} />}

      {erros.geral && (
        <p role="alert" className="rounded-[10px] border border-tinta p-4">
          {erros.geral}
        </p>
      )}

      <div>
        <label htmlFor="texto" className="block text-lg font-medium">
          Aviso
        </label>
        <p id="texto-ajuda" className="mt-1 text-suave">
          Curto e direto. Aparece na página inicial e na página de avisos.
        </p>
        <textarea
          id="texto"
          name="texto"
          rows={4}
          required
          maxLength={500}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-invalid={Boolean(erros.texto)}
          aria-describedby="texto-ajuda texto-erro"
          className={`${CAMPO} mt-3 py-3 leading-relaxed`}
        />
        <div className="mt-2 flex justify-between gap-4 text-sm text-suave">
          <span id="texto-erro" className="text-tinta">
            {erros.texto}
          </span>
          <span className={texto.length > 280 ? "text-tinta" : ""}>{texto.length}/500</span>
        </div>
      </div>

      <div>
        <label htmlFor="validoAte" className="block text-lg font-medium">
          Mostrar até
        </label>
        <p id="validade-ajuda" className="mt-1 text-suave">
          Inclusive. Depois desse dia o aviso sai do site sozinho.
        </p>
        <input
          id="validoAte"
          name="validoAte"
          type="date"
          required
          min={hoje}
          defaultValue={aviso?.validoAte && aviso.validoAte >= hoje ? aviso.validoAte : sugestaoValidade}
          aria-invalid={Boolean(erros.validoAte)}
          aria-describedby="validade-ajuda validade-erro"
          className={`${CAMPO} mt-3 h-12 max-w-xs`}
        />
        <p id="validade-erro" className="mt-2 text-sm">
          {erros.validoAte}
        </p>
      </div>

      <div>
        <label htmlFor="link" className="block text-lg font-medium">
          Link <span className="font-normal text-suave">(opcional)</span>
        </label>
        <p id="link-ajuda" className="mt-1 text-suave">
          Um post do Instagram ou uma página do site, como /capela. Aparece como “Saiba mais”.
        </p>
        <input
          id="link"
          name="link"
          type="text"
          inputMode="url"
          defaultValue={aviso?.link ?? ""}
          placeholder="https://"
          aria-invalid={Boolean(erros.link)}
          aria-describedby="link-ajuda link-erro"
          className={`${CAMPO} mt-3 h-12`}
        />
        <p id="link-erro" className="mt-2 text-sm">
          {erros.link}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-linha pt-8">
        <BotaoEnviar>{aviso ? "Salvar alterações" : "Publicar aviso"}</BotaoEnviar>
        <Link href="/painel/avisos" className="link-sutil font-medium text-suave hover:text-tinta">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
