import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import brasao from "@/assets/brasao.png";
import { EntrarComGoogle } from "@/components/painel/BotoesLogin";
import { loginConfigurado, papelDe } from "@/lib/painel/acessos";
import { authOptions } from "@/lib/painel/auth";

export const metadata = { title: "Entrar" };

const ERROS: Record<string, string> = {
  AccessDenied: "Este e-mail não tem acesso ao painel. Fale com o responsável pelo site.",
  Configuration: "O login do painel ainda não está configurado.",
};

export default async function Entrar({ searchParams }: PageProps<"/painel/entrar">) {
  const configurado = loginConfigurado();
  if (configurado) {
    const sessao = await getServerSession(authOptions);
    if (papelDe(sessao?.user?.email)) redirect("/painel");
  }

  const { error } = await searchParams;
  const codigo = typeof error === "string" ? error : undefined;
  const erro = codigo ? (ERROS[codigo] ?? "Não foi possível entrar. Tente de novo.") : null;

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Image src={brasao} alt="" width={80} height={80} priority className="size-20" />
        <h1 className="mt-10 text-[clamp(2.75rem,8vw,3.5rem)] leading-none font-light tracking-[-0.04em]">Painel</h1>
        <p className="mt-3 text-lg text-suave">Instituto Bom Pastor – Curitiba</p>

        <div className="mt-12">
          <EntrarComGoogle desativado={!configurado} />
        </div>

        {(erro || !configurado) && (
          <p role="alert" className="mt-6 rounded-[10px] border border-linha p-4 text-[0.9375rem] text-suave">
            {erro ?? ERROS.Configuration}
          </p>
        )}

        <p className="mt-10 text-sm text-suave">
          Só entram os e-mails autorizados.{" "}
          <Link href="/" className="link-sutil">
            Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  );
}
