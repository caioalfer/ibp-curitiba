import "server-only";

export type Papel = "admin" | "editor";

/**
 * Quem pode entrar no painel: variável de ambiente PAINEL_ACESSOS, nunca o código.
 * Formato: "email:papel,email:papel" (papel = admin ou editor). Ex.:
 *   PAINEL_ACESSOS="fulano@gmail.com:admin,curitibaibp@gmail.com:editor"
 * Lida a cada verificação: tirar um e-mail daqui corta o acesso na próxima ação, mesmo com sessão aberta.
 */
function lerAcessos(): Map<string, Papel> {
  const acessos = new Map<string, Papel>();
  for (const parte of (process.env.PAINEL_ACESSOS ?? "").split(",")) {
    const [email, papel] = parte.trim().split(":").map((s) => s?.trim().toLowerCase());
    if (email && (papel === "admin" || papel === "editor")) acessos.set(email, papel);
  }
  return acessos;
}

export function papelDe(email: string | null | undefined): Papel | null {
  if (!email) return null;
  return lerAcessos().get(email.toLowerCase()) ?? null;
}

export function loginConfigurado() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET && process.env.PAINEL_ACESSOS,
  );
}
