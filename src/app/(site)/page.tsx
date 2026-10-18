import Image from "next/image";
import Link from "next/link";
import { ListaAvisos } from "@/components/ListaAvisos";
import { Programacao } from "@/components/Programacao";
import { ProximaMissa } from "@/components/ProximaMissa";
import { ListaArtigos, ListaPublicacoes } from "@/components/Publicacoes";
import { Envoltorio } from "@/components/Titulo";
import { getArtigos, getAvisos, getConfiguracoes, getNoticias, getProgramacao, getSobre } from "@/lib/conteudo";
import { agoraEmCuritiba } from "@/lib/datas";
import { urlImagem } from "@/sanity/lib/image";
import fotoCapaPadrao from "@/assets/capa-missa.png";

export default async function Home() {
  const [dias, avisos, noticias, artigos, config, sobre] = await Promise.all([
    getProgramacao(),
    getAvisos(),
    getNoticias(2),
    getArtigos(3),
    getConfiguracoes(),
    getSobre(),
  ]);
  const superiores = [sobre.superiorGeral, sobre.prior].filter((p) => p !== undefined);
  const agora = agoraEmCuritiba();

  return (
    <>
      <section
        aria-labelledby="titulo-inicio"
        className="relative -mt-20 flex md:-mt-24 min-h-[100svh] flex-col justify-end overflow-hidden bg-fundo pt-44 pb-40 text-tinta md:pt-36 md:pb-20"
      >
        {/* Foto do painel (Configurações → Foto da página inicial); sem ela, a foto padrão do projeto. */}
        <Image
          src={config.fotoCapa ? urlImagem(config.fotoCapa).width(2400).url() : fotoCapaPadrao}
          alt={config.fotoCapa?.alt ?? "Padre em oração diante do altar, com paramentos brancos bordados a ouro"}
          fill
          priority
          sizes="100vw"
          placeholder={config.fotoCapa ? "empty" : "blur"}
          className="object-cover object-[70%_center]"
        />
        {/* Véu na cor do fundo (branco no claro, preto no escuro); intensidade por tema em globals.css. */}
        <span aria-hidden="true" className="veu-hero absolute inset-0" />

        <Envoltorio className="relative flex flex-1 flex-col justify-between gap-16">
          <h1
            id="titulo-inicio"
            className="max-w-3xl text-base leading-snug font-normal text-tinta/80 md:text-[clamp(1.75rem,3.6vw,2.75rem)] md:leading-[1.1] md:font-light md:tracking-[-0.025em]"
          >
            Instituto Bom Pastor. A Missa Tradicional em Curitiba, no rito de 1962.
          </h1>

          <ProximaMissa dias={dias} agoraServidor={agora} />
        </Envoltorio>
      </section>

      <div className="space-y-24 py-20 md:space-y-32 md:py-28">
        {avisos.length > 0 && (
          <Secao id="avisos" titulo="Avisos" descricao="O que você precisa saber nesta semana." link={{ href: "/avisos", rotulo: "Todos os avisos" }}>
            <ListaAvisos avisos={avisos.slice(0, 3)} />
          </Secao>
        )}

        <Secao
          id="semana"
          titulo="Esta semana"
          descricao="Missas, confissões e devoções dos próximos sete dias."
          link={{ href: "/horarios", rotulo: "Horários habituais" }}
        >
          <Programacao dias={dias} agoraServidor={agora} />
        </Secao>

        {artigos.length > 0 && (
          <Secao
            id="artigos"
            titulo="Palavra do padre"
            descricao="Ensaios sobre a fé, a liturgia e a vida do espírito."
            link={{ href: "/artigos", rotulo: "Todos os artigos" }}
          >
            <ListaArtigos itens={artigos} />
          </Secao>
        )}

        {noticias.length > 0 && (
          <Secao
            id="noticias"
            titulo="Notícias"
            descricao="A vida do apostolado em Curitiba."
            link={{ href: "/noticias", rotulo: "Todas as notícias" }}
          >
            <ListaPublicacoes itens={noticias} base="/noticias" />
          </Secao>
        )}

        <Secao
          id="sobre"
          titulo="O Instituto"
          descricao="Sociedade de vida apostólica de direito pontifício, fundada em Roma em 2006."
          link={{ href: "/sobre", rotulo: "História e superiores" }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-6 rounded-[10px] bg-placa p-7 md:p-9">
              <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">Primeira vez na Missa Tradicional?</p>
              <p className="text-lg text-suave">
                O Instituto Bom Pastor celebra exclusivamente no Rito Romano Tradicional, segundo os livros litúrgicos de
                1962. Todos são bem-vindos: venha alguns minutos antes, acompanhe pelo missal e, se precisar, fale com o
                padre ao fim da Missa.
              </p>
              <Link href="/horarios" className="link-sutil mt-auto self-start font-medium">
                Ver os horários das Missas
              </Link>
            </div>
            {superiores.length > 0 && (
              <ul className="flex flex-col rounded-[10px] border border-linha">
                {superiores.map((p) => (
                  <li key={p._id} className="flex items-center gap-5 border-b border-linha p-7 last:border-b-0 md:p-9">
                    {(p.foto || p.fotoLocal) && (
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-full md:size-20">
                        <Image
                          src={p.foto ? urlImagem(p.foto).width(160).height(160).fit("crop").url() : p.fotoLocal!}
                          alt=""
                          fill
                          sizes="160px"
                          className={p.foto ? "object-cover" : "scale-[1.8] object-cover"}
                          style={p.foto ? undefined : { objectPosition: p.fotoFoco, transformOrigin: p.fotoFoco }}
                        />
                      </span>
                    )}
                    <div>
                      <p className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">{p.nome}</p>
                      {p.cargo && <p className="mt-2 text-suave">{p.cargo}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Secao>
      </div>
    </>
  );
}

/** Cada tópico da home: linha fina no topo, título e descrição à esquerda, link para a página completa. */
function Secao({
  id,
  titulo,
  descricao,
  link,
  children,
}: {
  id: string;
  titulo: string;
  descricao: string;
  link: { href: string; rotulo: string };
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`titulo-${id}`} className="scroll-mt-28">
      <Envoltorio>
        <div className="mb-10 grid gap-x-10 gap-y-4 border-t border-linha pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:pt-10">
          <div>
            <h2 id={`titulo-${id}`} className="text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-light tracking-[-0.035em]">
              {titulo}
            </h2>
            <p className="mt-3 text-lg text-suave">{descricao}</p>
          </div>
          <LinkTodos href={link.href}>{link.rotulo}</LinkTodos>
        </div>
        {children}
      </Envoltorio>
    </section>
  );
}

function LinkTodos({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-sutil text-[0.9375rem] font-medium text-suave hover:text-tinta">
      {children}
    </Link>
  );
}
