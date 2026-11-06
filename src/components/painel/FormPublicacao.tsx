"use client";

import type { PortableTextBlock } from "@portabletext/editor";
import dynamic from "next/dynamic";
import { useActionState, useEffect, useLayoutEffect, useRef, useState } from "react";
import { salvarPublicacao, type EstadoPublicacao } from "@/app/painel/(area)/publicacoes/acoes";
import { TIPOS_PUBLICACAO, type TipoPublicacao } from "@/lib/painel/tiposPublicacao";
import { alturaDaFoto, type Recorte } from "@/lib/proporcaoFoto";
import { TEMAS_ARTIGO } from "@/sanity/lib/constantes";
import { urlImagem } from "@/sanity/lib/image";
import type { Publicacao } from "@/sanity/lib/queries";
import { BotaoEnviar } from "./Botoes";
import { FotoDoPainel } from "./FotoDoPainel";
import { useFotoEnquadrada } from "./FotoEnquadrada";
import { Icone } from "./Icones";
import { PreVisualizacao } from "./PreVisualizacao";

// O editor só existe no navegador (mexe direto na página); no servidor fica um espaço do mesmo tamanho.
const EditorTexto = dynamic(() => import("./EditorTexto").then((m) => m.EditorTexto), {
  ssr: false,
  loading: () => (
    <div aria-label="Carregando o editor…" className="mx-auto max-w-[42rem] pt-24">
      <div className="h-12 w-3/4 rounded-[10px] bg-placa" />
      <div className="mt-6 h-6 w-1/2 rounded-[10px] bg-placa" />
      <div className="mt-12 h-64 rounded-[10px] bg-placa" />
    </div>
  ),
});

const PILULA =
  "inline-flex h-9 items-center gap-2 rounded-full border border-borda-campo px-3.5 text-[0.875rem] text-tinta transition-colors duration-200 hover:border-suave focus-within:border-tinta";

export type PublicacaoNoForm = {
  _id: string;
  titulo: string;
  data: string;
  resumo?: string;
  tema?: string;
  autor?: string;
  imagemId?: string;
  imagemAlt?: string;
  imagemRecorte?: Recorte;
  corpo?: PortableTextBlock[];
};

export function FormPublicacao({
  tipo,
  publicacao,
  sugestoesAutor,
  hoje,
}: {
  tipo: TipoPublicacao;
  publicacao?: PublicacaoNoForm;
  sugestoesAutor: string[];
  hoje: string;
}) {
  const config = TIPOS_PUBLICACAO[tipo];
  const [estado, acao] = useActionState<EstadoPublicacao, FormData>(salvarPublicacao, {});
  const erros = estado.erros ?? {};

  // Tudo controlado: se o servidor recusar (falta o título, por exemplo), nada do que foi escrito se perde.
  const [titulo, setTitulo] = useState(publicacao?.titulo ?? "");
  const [data, setData] = useState(publicacao?.data ?? hoje);
  const [resumo, setResumo] = useState(publicacao?.resumo ?? "");
  const [tema, setTema] = useState(publicacao?.tema ?? "");
  const [autor, setAutor] = useState(publicacao?.autor ?? "");
  const [imagem, setImagem] = useState<Capa>({ id: publicacao?.imagemId ?? "", alt: publicacao?.imagemAlt ?? "", recorte: publicacao?.imagemRecorte });
  const [corpo, setCorpo] = useState<PortableTextBlock[]>(publicacao?.corpo ?? []);
  const [alterado, setAlterado] = useState(false);
  const [previa, setPrevia] = useState(false);
  const enviando = useRef(false);
  const formulario = useRef<HTMLFormElement>(null);

  // Alterações não salvas: avisa antes de fechar a aba e antes de seguir um link do painel.
  useEffect(() => {
    if (!alterado) return;
    const aoSair = (e: BeforeUnloadEvent) => {
      if (!enviando.current) e.preventDefault();
    };
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.("a[href]");
      if (!link || link.closest('[role="dialog"]') || link.getAttribute("target") === "_blank") return;
      if (!window.confirm("Sair sem salvar? O que você escreveu desde a última vez que salvou será perdido.")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", aoSair);
    document.addEventListener("click", aoClicar, true);
    return () => {
      window.removeEventListener("beforeunload", aoSair);
      document.removeEventListener("click", aoClicar, true);
    };
  }, [alterado]);

  function mudou<T>(definir: (v: T) => void) {
    return (v: T) => {
      definir(v);
      setAlterado(true);
    };
  }

  const focarTexto = () => formulario.current?.querySelector<HTMLElement>('[contenteditable="true"]')?.focus();

  const dadosDaPrevia = (): Publicacao => ({
    _id: publicacao?._id ?? "previa",
    titulo: titulo.trim() || "Sem título",
    slug: "previa",
    data: data || hoje,
    resumo: resumo.trim() || undefined,
    tema: config.temaEAutor ? tema || undefined : undefined,
    autor: config.temaEAutor ? autor.trim() || undefined : undefined,
    imagem: imagem.id ? { _type: "image", asset: { _type: "reference", _ref: imagem.id }, crop: imagem.recorte, alt: imagem.alt } : undefined,
    corpo: corpo as unknown as Publicacao["corpo"],
  });

  const cabecalho = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {!imagem.id && <CampoCapa imagem={imagem} aoMudar={mudou(setImagem)} />}
        <label className={PILULA}>
          <Icone nome="calendario" className="size-4 text-suave" />
          <span className="sr-only">Data</span>
          <input
            name="data"
            type="date"
            required
            value={data}
            onChange={(e) => mudou(setData)(e.target.value)}
            aria-invalid={Boolean(erros.data)}
            className="bg-transparent focus:outline-none"
          />
        </label>
        {config.temaEAutor && (
          <label className={PILULA}>
            <span className="text-suave">Tema</span>
            <select name="tema" value={tema} onChange={(e) => mudou(setTema)(e.target.value)} className="cursor-pointer bg-transparent focus:outline-none">
              <option value="">Sem tema</option>
              {TEMAS_ARTIGO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {erros.data && <p className="mt-2 text-sm">{erros.data}</p>}
      {erros.imagem && <p className="mt-2 text-sm">{erros.imagem}</p>}

      {imagem.id && <CampoCapa imagem={imagem} aoMudar={mudou(setImagem)} />}

      <label htmlFor="titulo" className="sr-only">
        Título
      </label>
      <AreaDeTexto
        id="titulo"
        name="titulo"
        valor={titulo}
        maxLength={120}
        placeholder="Título"
        aria-invalid={Boolean(erros.titulo)}
        aria-describedby="titulo-erro"
        onChange={(e) => mudou(setTitulo)(e.target.value.replace(/\n/g, " "))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("resumo")?.focus();
          }
        }}
        className="mt-8 w-full resize-none overflow-hidden bg-transparent text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.08] font-light tracking-[-0.04em] text-tinta placeholder:text-apagado focus:outline-none"
      />
      {erros.titulo && (
        <p id="titulo-erro" role="alert" className="mt-1 text-sm">
          {erros.titulo}
        </p>
      )}

      <label htmlFor="resumo" className="sr-only">
        Subtítulo
      </label>
      <AreaDeTexto
        id="resumo"
        name="resumo"
        valor={resumo}
        maxLength={300}
        placeholder="Subtítulo: uma ou duas frases sobre o texto"
        aria-invalid={Boolean(erros.resumo)}
        aria-describedby="resumo-ajuda"
        onChange={(e) => mudou(setResumo)(e.target.value.replace(/\n/g, " "))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            focarTexto();
          }
        }}
        className="peer mt-4 w-full resize-none overflow-hidden bg-transparent text-xl leading-snug text-suave placeholder:text-apagado focus:outline-none"
      />
      <p id="resumo-ajuda" className="hidden text-sm text-apagado peer-focus:block">
        Aparece também na lista de {config.plural.toLowerCase()}, na busca e quando alguém compartilha o link.
        {resumo.length > 240 && ` ${resumo.length}/300`}
      </p>
      {erros.resumo && <p className="mt-1 text-sm">{erros.resumo}</p>}

      {config.temaEAutor && (
        <div className="mt-6 flex items-center gap-3">
          <label htmlFor="autor" className="text-[0.9375rem] text-suave">
            Por
          </label>
          <input
            id="autor"
            name="autor"
            type="text"
            list="autores-sugeridos"
            autoComplete="off"
            maxLength={80}
            value={autor}
            onChange={(e) => mudou(setAutor)(e.target.value)}
            placeholder="Nome do autor"
            aria-invalid={Boolean(erros.autor)}
            className="h-9 w-full max-w-xs rounded-full border border-borda-campo bg-transparent px-4 text-[0.9375rem] text-tinta placeholder:text-apagado hover:border-suave focus:border-tinta focus:outline-none"
          />
          <datalist id="autores-sugeridos">
            {sugestoesAutor.map((nome) => (
              <option key={nome} value={nome} />
            ))}
          </datalist>
        </div>
      )}
      {erros.autor && <p className="mt-1 text-sm">{erros.autor}</p>}
      <div aria-hidden="true" className="mt-8 border-t border-linha" />
    </>
  );

  return (
    <form
      ref={formulario}
      action={acao}
      onSubmit={() => {
        enviando.current = true;
        setTimeout(() => (enviando.current = false), 4000);
      }}
      // Enter num campo de uma linha não envia o formulário: publicaria sem querer.
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) e.preventDefault();
      }}
      noValidate
    >
      <input type="hidden" name="tipo" value={tipo} />
      {publicacao && <input type="hidden" name="id" value={publicacao._id} />}
      <input type="hidden" name="corpo" value={JSON.stringify(corpo)} />
      <input type="hidden" name="imagemId" value={imagem.id} />
      <input type="hidden" name="imagemAlt" value={imagem.id ? imagem.alt : ""} />
      <input type="hidden" name="imagemRecorte" value={imagem.id && imagem.recorte ? JSON.stringify(imagem.recorte) : ""} />

      {erros.geral && (
        <p role="alert" className="mx-auto mb-6 max-w-[42rem] rounded-[10px] border border-tinta p-4">
          {erros.geral}
        </p>
      )}

      <EditorTexto
        valorInicial={publicacao?.corpo}
        cabecalho={cabecalho}
        aoMudar={(valor) => {
          setCorpo(valor);
          setAlterado(true);
        }}
      />

      {erros.corpo && (
        <p role="alert" className="mx-auto mb-6 max-w-[42rem] rounded-[10px] border border-tinta p-4">
          {erros.corpo}
        </p>
      )}

      <div className="sticky bottom-0 z-20 border-t border-linha bg-fundo/95 backdrop-blur">
        <div className="mx-auto flex max-w-[42rem] flex-wrap items-center gap-3 py-4">
          <BotaoEnviar name="acao" value="publicar" pendente="Publicando…">
            Publicar
          </BotaoEnviar>
          <BotaoEnviar name="acao" value="rascunho" className="pill pill-contorno" pendente="Salvando…">
            Salvar rascunho
          </BotaoEnviar>
          <button type="button" onClick={() => setPrevia(true)} className="pill gap-2 px-3 font-medium text-suave hover:text-tinta">
            <Icone nome="olho" />
            Pré-visualizar
          </button>
          {alterado && <span className="ml-auto text-sm text-suave">Alterações não salvas</span>}
        </div>
      </div>

      {previa && (
        <PreVisualizacao
          publicacao={dadosDaPrevia()}
          voltar={{ href: config.rotaSite, rotulo: config.plural }}
          aoFechar={() => setPrevia(false)}
        />
      )}
    </form>
  );
}

/** Caixa de texto que cresce com o conteúdo (título e subtítulo). */
function AreaDeTexto({ valor, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { valor: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [valor]);
  return <textarea ref={ref} rows={1} value={valor} {...props} />;
}

type Capa = { id: string; alt: string; recorte?: Recorte };

/** Foto de capa: sem foto, um botão pequeno; com foto, a foto grande como no site, já na proporção padrão. */
function CampoCapa({ imagem, aoMudar }: { imagem: Capa; aoMudar: (v: Capa) => void }) {
  const arquivo = useRef<HTMLInputElement>(null);
  const foto = useFotoEnquadrada(({ id, recorte }) => aoMudar({ id, alt: id === imagem.id ? imagem.alt : "", recorte }));

  const entrada = (
    <input
      ref={arquivo}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      aria-label="Foto de capa"
      className="hidden"
      onChange={(e) => {
        const escolhido = e.target.files?.[0];
        e.target.value = "";
        if (escolhido) foto.escolher(escolhido);
      }}
    />
  );
  const extras = (
    <>
      {entrada}
      {foto.janela}
      {foto.erro && (
        <p role="alert" className="mt-2 w-full text-sm">
          {foto.erro}
        </p>
      )}
    </>
  );
  const capaSrc = imagem.id ? urlImagem({ asset: { _ref: imagem.id }, crop: imagem.recorte }).width(1400).height(alturaDaFoto(1400)).fit("crop").url() : "";
  const botaoSobreFoto = "pill min-h-9 bg-superficie/90 px-4 text-[0.875rem] shadow-sm backdrop-blur";

  if (!imagem.id) {
    return (
      <>
        <button type="button" onClick={() => arquivo.current?.click()} className={PILULA}>
          <Icone nome="foto" className="size-4 text-suave" />
          Foto de capa
        </button>
        {extras}
      </>
    );
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <FotoDoPainel key={capaSrc} src={capaSrc} className="aspect-[3/2] w-full rounded-[10px] bg-placa object-cover" />
        <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => foto.ajustar(imagem.id, imagem.recorte)} className={botaoSobreFoto}>
            Enquadrar
          </button>
          <button type="button" onClick={() => arquivo.current?.click()} className={botaoSobreFoto}>
            Trocar foto
          </button>
          <button type="button" onClick={() => aoMudar({ id: "", alt: "" })} className={botaoSobreFoto}>
            Tirar
          </button>
        </div>
      </div>
      {extras}
      <label htmlFor="capa-alt" className="sr-only">
        Descrição da foto de capa
      </label>
      <input
        id="capa-alt"
        type="text"
        maxLength={160}
        value={imagem.alt}
        onChange={(e) => aoMudar({ ...imagem, alt: e.target.value })}
        placeholder="Descreva a foto (opcional)"
        aria-describedby="capa-alt-ajuda"
        className="peer mt-2 w-full bg-transparent text-center text-sm text-suave placeholder:text-apagado focus:text-tinta focus:outline-none"
      />
      <p id="capa-alt-ajuda" className="mx-auto mt-1 hidden max-w-md text-center text-xs text-suave peer-focus:block">
        Opcional. É lida em voz alta para pessoas cegas (pelo leitor de tela do celular ou computador) e aparece no lugar da foto se ela não carregar. Ex.: Fiéis na procissão de Corpus Christi.
      </p>
    </div>
  );
}
