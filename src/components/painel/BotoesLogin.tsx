"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function EntrarComGoogle({ desativado = false }: { desativado?: boolean }) {
  const [enviando, setEnviando] = useState(false);
  return (
    <button
      type="button"
      disabled={desativado || enviando}
      onClick={() => {
        setEnviando(true);
        signIn("google", { callbackUrl: "/painel" });
      }}
      className="pill pill-primaria min-h-12 w-full justify-center gap-3 px-6 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.32 2.97-7.35ZM12 22c2.7 0 4.97-.9 6.63-2.42l-3.24-2.5c-.9.6-2.04.95-3.39.95-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Zm-5.6-8.09a6 6 0 0 1 0-3.82V7.5H3.06a10 10 0 0 0 0 9l3.34-2.59ZM12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.5l3.34 2.59C7.19 7.74 9.4 5.98 12 5.98Z" />
      </svg>
      {enviando ? "Abrindo o Google…" : "Entrar com Google"}
    </button>
  );
}

export function Sair() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/painel/entrar" })}
      className="link-sutil text-[0.9375rem] font-medium text-suave hover:text-tinta"
    >
      Sair
    </button>
  );
}
