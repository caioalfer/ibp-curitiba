import Image from "next/image";
import Link from "next/link";
import brasao from "@/assets/brasao.png";
import type { Configuracoes, Local } from "@/sanity/lib/queries";
import { urlMapa } from "./LinkMapa";

export function Rodape({ locais, config }: { locais: Local[]; config: Configuracoes }) {
  return (
    <footer className="mt-auto border-t border-linha">
      <div className="mx-auto max-w-[75rem] px-5 pt-24 pb-32 md:px-8 md:pb-16">
        <Image src={brasao} alt="Brasão do Instituto Bom Pastor" width={96} height={96} className="mb-10 size-24" />
        <p className="display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] font-light tracking-[-0.035em]">
          Ego sum pastor bonus.
        </p>
        <p className="mt-4 text-suave">Eu sou o Bom Pastor. — Jo 10,11</p>

        <div className="mt-20 grid gap-10 border-t border-linha pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {locais.map((l) => (
            <div key={l._id}>
              <p className="font-medium">{l.nome}</p>
              <a href={urlMapa(l)} target="_blank" rel="noopener noreferrer" className="link-sutil mt-1 block text-suave">
                {l.endereco}
              </a>
            </div>
          ))}
          <div>
            <ul className="space-y-1">
              {config.instagram && (
                <li>
                  <a href={config.instagram} target="_blank" rel="noopener noreferrer" className="link-sutil">
                    Instagram @ibpcuritiba
                  </a>
                </li>
              )}
              {config.email && (
                <li>
                  <a href={`mailto:${config.email}`} className="link-sutil">
                    {config.email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/avisos" className="link-sutil">
                  Avisos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link href="/sobre" className="link-sutil">
                  História e superiores
                </Link>
              </li>
              <li>
                <a href="https://ibpamericalatina.org/" target="_blank" rel="noopener noreferrer" className="link-sutil">
                  Distrito América Latina
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
