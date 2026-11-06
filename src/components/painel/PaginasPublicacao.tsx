// Páginas do painel para artigos e notícias (mesmo código para os dois; muda só o tipo).
// Componentes de servidor: cada rota em src/app/painel/(area)/{artigos,noticias} só chama um destes.

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  descartarRascunho,
  despublicar,
  excluirPublicacao,
} from "@/app/painel/(area)/publicacoes/acoes";
import { agoraEmCuritiba, dataPorExtenso } from "@/lib/datas";
import { lerPainel, lerPainelComRascunhos } from "@/lib/painel/sanity";
import { exigirAcesso } from "@/lib/painel/sessao";
import {
  TIPOS_PUBLICACAO,
  type TipoPublicacao,
} from "@/lib/painel/tiposPublicacao";
import { idDocumento } from "@/lib/painel/validar";
import { TEMAS_ARTIGO } from "@/sanity/lib/constantes";
import { BotaoConfirmar } from "./Botoes";
import { FormPublicacao, type PublicacaoNoForm } from "./FormPublicacao";
import { quandoAlterado, Voltar } from "./Voltar";

const TITULO =
  "text-[clamp(2.5rem,6vw,4rem)] leading-none font-light tracking-[-0.04em]";
// Nas telas de escrever, o cabeçalho fica discreto: o destaque é o título do próprio texto.
const COLUNA = "mx-auto max-w-[42rem]";
const TITULO_DISCRETO =
  "mt-3 text-[1.375rem] leading-tight font-light tracking-[-0.02em]";

type Situacao = "publicado" | "rascunho" | "alterado";

const ROTULO_SITUACAO: Record<Situacao, string> = {
  publicado: "No site",
  rascunho: "Rascunho",
  alterado: "No site, com alterações não publicadas",
};

function Selo({ situacao }: { situacao: Situacao }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full px-3 text-[0.8125rem] font-medium ${
        situacao === "publicado"
          ? "bg-marca text-marca-texto"
          : "border border-linha text-suave"
      }`}
    >
      {ROTULO_SITUACAO[situacao]}
    </span>
  );
}

function situacaoDe(publicado: boolean, rascunho: boolean): Situacao {
  if (publicado && rascunho) return "alterado";
  return publicado ? "publicado" : "rascunho";
}

// ---------- Lista ----------

type Versao = {
  _id: string;
  titulo?: string;
  data?: string;
  tema?: string;
  slug?: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
};

const MENSAGENS_LISTA: Record<string, string> = {
  excluido: "Excluído. Saiu do site e do painel.",
};

export async function ListaPublicacoes({
  tipo,
  ok,
}: {
  tipo: TipoPublicacao;
  ok?: string | string[];
}) {
  await exigirAcesso();
  const config = TIPOS_PUBLICACAO[tipo];
  const versoes = await lerPainelComRascunhos<Versao[]>(
    `*[_type == $tipo]{_id, titulo, data, tema, "slug": slug.current, atualizadoPor, atualizadoEm}`,
    { tipo },
  );

  // Junta publicado e rascunho do mesmo texto numa linha só; o rascunho é a versão mais nova.
  const porId = new Map<string, { publicado?: Versao; rascunho?: Versao }>();
  for (const v of versoes) {
    const rascunho = v._id.startsWith("drafts.");
    const id = rascunho ? v._id.slice(7) : v._id;
    const atual = porId.get(id) ?? {};
    porId.set(
      id,
      rascunho ? { ...atual, rascunho: v } : { ...atual, publicado: v },
    );
  }
  const linhas = [...porId.entries()]
    .map(([id, { publicado, rascunho }]) => {
      const v = (rascunho ?? publicado)!;
      return {
        id,
        ...v,
        situacao: situacaoDe(Boolean(publicado), Boolean(rascunho)),
        slugNoSite: publicado?.slug,
      };
    })
    .sort(
      (a, b) =>
        (b.data ?? "").localeCompare(a.data ?? "") || b.id.localeCompare(a.id),
    );

  const mensagem = typeof ok === "string" ? MENSAGENS_LISTA[ok] : undefined;
  const rascunhos = linhas.filter((l) => l.situacao === "rascunho").length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Voltar href="/painel">Painel</Voltar>
          <h1 className={`mt-4 ${TITULO}`}>{config.plural}</h1>
        </div>
        <Link href={`${config.rota}/novo`} className="pill pill-primaria">
          {config.novo}
        </Link>
      </div>

      {mensagem && (
        <p role="status" className="mt-8 rounded-[10px] bg-placa p-4">
          {mensagem}
        </p>
      )}

      <p className="mt-8 text-suave">
        {linhas.length === 0
          ? `${config.nenhum} ainda.`
          : `${linhas.length} no total${rascunhos ? `, ${rascunhos === 1 ? "1 rascunho" : `${rascunhos} rascunhos`}` : ""}. Nada sai do site com o tempo: tudo fica no arquivo.`}
      </p>

      {linhas.length > 0 && (
        <ul className="mt-6 border-t border-linha">
          {linhas.map((l) => (
            <li
              key={l.id}
              className="grid gap-4 border-b border-linha py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Link
                    href={`${config.rota}/${l.id}`}
                    className="text-xl leading-snug font-medium hover:underline"
                  >
                    {l.titulo || "Sem título"}
                  </Link>
                  <Selo situacao={l.situacao} />
                </p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-suave">
                  {l.data && <span>{dataPorExtenso(l.data)}</span>}
                  {l.tema && (
                    <span>
                      {TEMAS_ARTIGO.find((t) => t.value === l.tema)?.title}
                    </span>
                  )}
                  {l.atualizadoPor && (
                    <span>
                      Alterado por {l.atualizadoPor},{" "}
                      {quandoAlterado(l.atualizadoEm)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`${config.rota}/${l.id}`}
                  className="pill pill-contorno min-h-10 text-[0.9375rem]"
                >
                  Editar
                </Link>
                {l.slugNoSite && (
                  <Link
                    href={`${config.rotaSite}/${l.slugNoSite}`}
                    target="_blank"
                    className="pill min-h-10 text-[0.9375rem] text-suave hover:text-tinta"
                  >
                    Ver no site
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ---------- Novo e editar ----------

/** Sugestões para o campo Autor (texto livre): os padres cadastrados e quem já assinou artigos. */
async function dadosDoFormulario() {
  const [padres, jaUsados] = await Promise.all([
    lerPainel<string[]>(`*[_type == "pessoa" && defined(nome)].nome`),
    lerPainel<unknown[]>(`*[_type == "artigo" && defined(autor)].autor`),
  ]);
  const nomes = [
    ...padres,
    ...jaUsados.filter((n): n is string => typeof n === "string"),
  ]
    .map((n) => n.trim())
    .filter(Boolean);
  const sugestoesAutor = [...new Set(nomes)].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  return { sugestoesAutor, hoje: agoraEmCuritiba().data };
}

export async function NovaPublicacao({ tipo }: { tipo: TipoPublicacao }) {
  await exigirAcesso();
  const config = TIPOS_PUBLICACAO[tipo];
  const dados = await dadosDoFormulario();
  return (
    <>
      <div className={`${COLUNA} mb-4`}>
        <Voltar href={config.rota}>{config.plural}</Voltar>
        <h1 className={TITULO_DISCRETO}>{config.novo}</h1>
      </div>
      <FormPublicacao tipo={tipo} {...dados} />
    </>
  );
}

type VersaoCompleta = PublicacaoNoForm & {
  slug?: string;
  atualizadoPor?: string;
  atualizadoEm?: string;
};

export async function EditarPublicacao({
  tipo,
  idBruto,
  ok,
}: {
  tipo: TipoPublicacao;
  idBruto: string;
  ok?: string | string[];
}) {
  await exigirAcesso();
  const config = TIPOS_PUBLICACAO[tipo];
  const id = idDocumento(idBruto);
  if (!id || id.startsWith("drafts.")) notFound();

  const [versoes, dados] = await Promise.all([
    lerPainelComRascunhos<VersaoCompleta[]>(
      `*[_type == $tipo && _id in [$id, "drafts." + $id]]{
        _id, titulo, data, resumo, tema, "autor": coalesce(autor->nome, autor), "imagemId": imagem.asset._ref, "imagemAlt": imagem.alt, "imagemRecorte": imagem.crop{top, bottom, left, right},
        corpo, "slug": slug.current, atualizadoPor, atualizadoEm
      }`,
      { tipo, id },
    ),
    dadosDoFormulario(),
  ]);
  const publicado = versoes.find((v) => v._id === id);
  const rascunho = versoes.find((v) => v._id === `drafts.${id}`);
  const atual = rascunho ?? publicado;
  if (!atual) notFound();

  const situacao = situacaoDe(Boolean(publicado), Boolean(rascunho));
  const linkNoSite = publicado?.slug
    ? `${config.rotaSite}/${publicado.slug}`
    : undefined;
  const mensagem = mensagemEdicao(
    typeof ok === "string" ? ok : undefined,
    config.o,
    Boolean(publicado),
  );

  return (
    <>
      <div className={`${COLUNA} mb-4`}>
        <Voltar href={config.rota}>{config.plural}</Voltar>
        <h1 className={TITULO_DISCRETO}>Editar {config.singular}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-suave">
          <Selo situacao={situacao} />
          {atual.atualizadoPor && (
            <span>
              Alterado por {atual.atualizadoPor},{" "}
              {quandoAlterado(atual.atualizadoEm)}
            </span>
          )}
          {linkNoSite && (
            <Link
              href={linkNoSite}
              target="_blank"
              className="link-sutil font-medium text-tinta"
            >
              Ver no site
            </Link>
          )}
        </div>

        {mensagem && (
          <p role="status" className="mt-6 rounded-[10px] bg-placa p-4">
            {mensagem}
          </p>
        )}
      </div>

      <FormPublicacao
        key={`${atual._id}-${atual.atualizadoEm ?? ""}`}
        tipo={tipo}
        publicacao={{ ...atual, _id: id }}
        {...dados}
      />

      <section className={`${COLUNA} mt-20 border-t border-linha pt-10`}>
        <h2 className="text-[1.75rem] leading-tight font-light tracking-[-0.025em]">
          Outras ações
        </h2>
        <ul className="mt-6 space-y-6">
          {rascunho && publicado && (
            <AcaoPerigosa
              acao={descartarRascunho}
              tipo={tipo}
              id={id}
              botao="Descartar alterações"
              pergunta="Descartar as alterações não publicadas? O site continua como está."
              texto="Joga fora o rascunho e volta para a versão que está no site."
            />
          )}
          {publicado && (
            <AcaoPerigosa
              acao={despublicar}
              tipo={tipo}
              id={id}
              botao="Tirar do site"
              pergunta={`Tirar ${config.este} do site? O texto fica guardado como rascunho.`}
              texto="Sai do site e do arquivo, mas o texto fica guardado aqui como rascunho."
            />
          )}
          <AcaoPerigosa
            acao={excluirPublicacao}
            tipo={tipo}
            id={id}
            botao="Excluir"
            pergunta={`Excluir ${config.este} de vez? Não dá para desfazer.`}
            texto="Apaga do site e do painel, sem volta."
          />
        </ul>
      </section>
    </>
  );
}

function AcaoPerigosa({
  acao,
  tipo,
  id,
  botao,
  pergunta,
  texto,
}: {
  acao: (formData: FormData) => Promise<void>;
  tipo: TipoPublicacao;
  id: string;
  botao: string;
  pergunta: string;
  texto: string;
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <form action={acao}>
        <input type="hidden" name="tipo" value={tipo} />
        <input type="hidden" name="id" value={id} />
        <BotaoConfirmar
          pergunta={pergunta}
          className="pill pill-contorno min-h-10 w-52 text-[0.9375rem]"
        >
          {botao}
        </BotaoConfirmar>
      </form>
      <p className="text-suave">{texto}</p>
    </li>
  );
}

function mensagemEdicao(
  ok: string | undefined,
  oTipo: string,
  temVersaoNoSite: boolean,
) {
  switch (ok) {
    case "publicado":
      return "Publicado. Já está no site.";
    case "rascunho":
      return temVersaoNoSite
        ? "Rascunho salvo. O site continua mostrando a versão publicada até você clicar em Publicar."
        : `Rascunho salvo. ${oTipo[0].toUpperCase()}${oTipo.slice(1)} ainda não aparece no site.`;
    case "despublicado":
      return "Saiu do site. O texto ficou guardado aqui como rascunho.";
    case "descartado":
      return "Alterações descartadas. Ficou valendo o que está no site.";
    default:
      return undefined;
  }
}
