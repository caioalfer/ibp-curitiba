import "server-only";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { papelDe } from "./acessos";

/**
 * Login do painel: só Google, só e-mails liberados em PAINEL_ACESSOS.
 * Não guardamos senha: a senha e a verificação em duas etapas ficam com o Google.
 * A sessão é um JWT criptografado (NEXTAUTH_SECRET) num cookie HttpOnly, sem banco de dados.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Sempre mostra a escolha de conta: evita entrar sem querer com a conta errada do navegador.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  pages: { signIn: "/painel/entrar", error: "/painel/entrar" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const perfil = profile as { email?: string; email_verified?: boolean } | undefined;
      return Boolean(perfil?.email_verified && papelDe(perfil.email));
    },
    async jwt({ token }) {
      token.papel = papelDe(token.email) ?? undefined;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.papel = token.papel;
      return session;
    },
  },
};
