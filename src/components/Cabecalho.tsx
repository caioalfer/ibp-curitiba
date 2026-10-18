"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Configuracoes } from "@/sanity/lib/queries";
import { BotaoAtendimento } from "./BotaoAtendimento";
import { SeletorTemaBotao, SeletorTemaLista } from "./SeletorTema";
import brasao from "@/assets/brasao.png";

const LINKS = [
  { href: "/horarios", rotulo: "Horários" },
  { href: "/avisos", rotulo: "Avisos" },
  { href: "/noticias", rotulo: "Notícias" },
  { href: "/artigos", rotulo: "Artigos" },
  { href: "/sobre", rotulo: "Sobre" },
];

export function Cabecalho({ config }: { config: Configuracoes }) {
  const caminho = usePathname();
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setMenuAberto(false);
    document.addEventListener("keydown", fechar);
    return () => document.removeEventListener("keydown", fechar);
  }, [menuAberto]);

  const ativo = (href: string) => caminho === href || caminho.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ease-lampada ${
        rolou || menuAberto ? "bg-fundo" : "bg-transparent"
      } text-tinta`}
    >
      <div className="mx-auto flex h-20 max-w-[75rem] md:h-24 items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3 md:gap-4" aria-label="Instituto Bom Pastor – Curitiba, início">
          <Image src={brasao} alt="" width={64} height={64} priority className="size-13 shrink-0 md:size-16" />
          <span className="leading-tight">
            <span className="block text-base font-medium md:text-[1.0625rem]">Instituto Bom Pastor</span>
            <span className="rotulo block text-suave">Curitiba</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={ativo(l.href) ? "page" : undefined}
                  className={`text-[0.9375rem] font-medium transition-colors duration-200 ${
                    ativo(l.href) ? "text-tinta" : "text-suave hover:text-tinta"
                  }`}
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <SeletorTemaBotao />
          </div>
          <div className="hidden md:block">
            <BotaoAtendimento config={config} posicao="cabecalho" />
          </div>
          <button
            type="button"
            className="pill pill-contorno min-h-10 px-4 text-[0.9375rem] lg:hidden"
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            onClick={() => setMenuAberto((v) => !v)}
          >
            {menuAberto ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {menuAberto && (
        <nav
          id="menu-principal"
          aria-label="Principal"
          className="fixed inset-x-0 top-20 bottom-0 md:top-24 z-40 overflow-y-auto bg-fundo px-5 pt-6 pb-28 lg:hidden"
        >
          <ul className="border-t border-linha">
            {[{ href: "/", rotulo: "Início" }, ...LINKS].map((l) => (
              <li key={l.href} className="border-b border-linha">
                <Link
                  href={l.href}
                  aria-current={caminho === l.href ? "page" : undefined}
                  onClick={() => setMenuAberto(false)}
                  className="block py-5 text-[2rem] leading-none font-light tracking-[-0.025em]"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 md:hidden">
            <p className="rotulo mb-3 text-suave">Tema</p>
            <SeletorTemaLista />
          </div>
        </nav>
      )}
    </header>
  );
}

