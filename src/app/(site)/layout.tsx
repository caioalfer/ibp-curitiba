import { BotaoAtendimento } from "@/components/BotaoAtendimento";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { getConfiguracoes, getLocais } from "@/lib/conteudo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [config, locais] = await Promise.all([getConfiguracoes(), getLocais()]);
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 pill pill-primaria">
        Pular para o conteúdo
      </a>
      <Cabecalho config={config} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Rodape locais={locais} config={config} />
      <BotaoAtendimento config={config} posicao="flutuante" />
    </>
  );
}
