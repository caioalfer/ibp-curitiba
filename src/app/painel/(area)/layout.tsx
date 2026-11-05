import Image from "next/image";
import Link from "next/link";
import brasao from "@/assets/brasao.png";
import { Sair } from "@/components/painel/BotoesLogin";
import { exigirAcesso } from "@/lib/painel/sessao";

export default async function AreaDoPainel({ children }: { children: React.ReactNode }) {
  const usuario = await exigirAcesso();
  return (
    <>
      <header className="border-b border-linha">
        <div className="mx-auto flex h-18 max-w-[75rem] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/painel" className="flex items-center gap-3 leading-tight">
            <Image src={brasao} alt="" width={40} height={40} className="size-10" />
            <span>
              <span className="block text-[0.9375rem] font-medium">Painel</span>
              <span className="rotulo block text-suave">IBP Curitiba</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden text-[0.9375rem] text-suave sm:inline">{usuario.email}</span>
            <Link href="/" className="link-sutil text-[0.9375rem] font-medium text-suave hover:text-tinta">
              Ver o site
            </Link>
            <Sair />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[75rem] flex-1 px-5 pt-12 pb-24 md:px-8 md:pt-16">{children}</main>
    </>
  );
}
