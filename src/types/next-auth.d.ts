import type { DefaultSession } from "next-auth";
import type { Papel } from "@/lib/painel/acessos";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & { papel?: Papel };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    papel?: Papel;
  }
}
