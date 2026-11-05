"use client";

import { useFormStatus } from "react-dom";

/** Botão de envio que se desativa enquanto a ação roda. */
export function BotaoEnviar({
  children,
  pendente = "Salvando…",
  className = "pill pill-primaria",
  ...resto
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendente?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-60`} {...resto}>
      {pending ? pendente : children}
    </button>
  );
}

/** Botão de envio que pede confirmação antes (excluir, remover). */
export function BotaoConfirmar({
  children,
  pergunta,
  className = "pill pill-contorno",
  ...resto
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { pergunta: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(pergunta)) e.preventDefault();
      }}
      className={`${className} disabled:opacity-60`}
      {...resto}
    >
      {children}
    </button>
  );
}
