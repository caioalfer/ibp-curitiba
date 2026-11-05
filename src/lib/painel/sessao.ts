import "server-only";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { loginConfigurado, papelDe, type Papel } from "./acessos";
import { authOptions } from "./auth";

export type Usuario = { email: string; nome: string; papel: Papel };

/**
 * Camada de acesso do painel. Toda página E toda ação do servidor chamam isto antes de ler ou gravar:
 * a checagem na tela não protege as ações, que podem ser chamadas diretamente.
 * Confere a sessão e, de novo, se o e-mail continua liberado em PAINEL_ACESSOS.
 */
export async function exigirAcesso(papelMinimo: Papel = "editor"): Promise<Usuario> {
  // Sem as variáveis do login, ninguém entra (e a página não quebra): vai para a tela de entrada.
  if (!loginConfigurado()) redirect("/painel/entrar");
  const sessao = await getServerSession(authOptions);
  const email = sessao?.user?.email?.toLowerCase();
  const papel = papelDe(email);
  if (!email || !papel) redirect("/painel/entrar");
  if (papelMinimo === "admin" && papel !== "admin") redirect("/painel");
  return { email, nome: sessao?.user?.name ?? email, papel };
}
