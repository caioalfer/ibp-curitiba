"use client";

import {
  defineAnnotation,
  defineBlockObject,
  defineDecorator,
  defineSchema,
  defineTextBlock,
  EditorProvider,
  PortableTextEditable,
  useEditor,
  useEditorSelector,
  type BlockObjectRenderProps,
  type BlockPath,
  type PortableTextBlock,
  type TextBlockRenderProps,
} from "@portabletext/editor";
import { EventListenerPlugin, NodePlugin } from "@portabletext/editor/plugins";
import * as selectors from "@portabletext/editor/selectors";
import { ListIndexProvider, useListIndex } from "@portabletext/plugin-list-index";
import { useRef, useState } from "react";
import type { Recorte } from "@/lib/proporcaoFoto";
import { enderecoYoutube, idYoutube, miniaturaYoutube } from "@/lib/youtube";
import { urlImagem } from "@/sanity/lib/image";
import { Dialogo } from "./Dialogo";
import { FotoDoPainel } from "./FotoDoPainel";
import { useFotoEnquadrada } from "./FotoEnquadrada";
import { Icone, type NomeIcone } from "./Icones";

// Editor de artigos e notícias, no jeito do Substack: barra de ferramentas no alto e o texto com a
// mesma aparência do site. Grava no mesmo formato que o site mostra (src/sanity/schemaTypes/textoRico.ts);
// o servidor confere tudo de novo antes de salvar (limparCorpo, em src/lib/painel/publicacoes.ts).

const esquema = defineSchema({
  decorators: [{ name: "strong" }, { name: "em" }, { name: "strike-through" }],
  styles: [{ name: "normal" }, { name: "h2" }, { name: "h3" }, { name: "blockquote" }],
  lists: [{ name: "bullet" }, { name: "number" }],
  annotations: [{ name: "link", fields: [{ name: "href", type: "string" }] }],
  inlineObjects: [],
  blockObjects: [
    {
      name: "image",
      fields: [
        { name: "asset", type: "object" },
        { name: "alt", type: "string" },
        { name: "legenda", type: "string" },
        { name: "link", type: "string" },
        { name: "crop", type: "object" },
      ],
    },
    { name: "video", fields: [{ name: "url", type: "string" }] },
    {
      name: "botao",
      fields: [
        { name: "texto", type: "string" },
        { name: "link", type: "string" },
      ],
    },
    { name: "separador", fields: [] },
  ],
});

type Atributos = React.HTMLAttributes<HTMLElement>;

/** Link aceito: https://… ou uma página do site (/capela). O servidor confere de novo. */
export function linkValido(href: string) {
  return /^https?:\/\/[^\s/]+\.[^\s]+$/.test(href) || /^\/(?!\/)\S*$/.test(href);
}

// Fica fora do componente: um array novo a cada render faria o editor registrar tudo de novo a cada tecla.
const nos = [
  defineTextBlock({ type: "block", render: (props) => <BlocoDeTexto {...props} /> }),
  defineDecorator({ type: "strong", render: ({ children }) => <strong>{children}</strong> }),
  defineDecorator({ type: "em", render: ({ children }) => <em>{children}</em> }),
  defineDecorator({ type: "strike-through", render: ({ children }) => <s>{children}</s> }),
  defineAnnotation({
    type: "link",
    render: ({ annotation, children }) => (
      <a href={String(annotation.href ?? "")} title={String(annotation.href ?? "")} onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    ),
  }),
  defineBlockObject({ type: "image", render: (props) => <FotoNoTexto {...props} /> }),
  defineBlockObject({ type: "video", render: (props) => <VideoNoTexto {...props} /> }),
  defineBlockObject({ type: "botao", render: (props) => <BotaoNoTexto {...props} /> }),
  defineBlockObject({ type: "separador", render: (props) => <SeparadorNoTexto {...props} /> }),
];

function BlocoDeTexto(props: TextBlockRenderProps) {
  const indice = useListIndex(props.path);
  const { listItem, level, style } = props.node;
  const atributos = props.attributes as Atributos;
  const extra = listItem
    ? { "data-lista": listItem, "data-indice": indice, style: { ...atributos.style, "--nivel": level ?? 1 } as React.CSSProperties }
    : {};
  if (style === "h2") return <h2 {...atributos} {...extra}>{props.children}</h2>;
  if (style === "h3") return <h3 {...atributos} {...extra}>{props.children}</h3>;
  if (style === "blockquote") return <blockquote {...atributos} {...extra}>{props.children}</blockquote>;
  return <p {...atributos} {...extra}>{props.children}</p>;
}

export function EditorTexto({
  valorInicial,
  aoMudar,
  cabecalho,
}: {
  valorInicial?: PortableTextBlock[];
  aoMudar: (valor: PortableTextBlock[]) => void;
  /** Título, subtítulo e autor: ficam entre a barra e o texto, como no Substack. */
  cabecalho?: React.ReactNode;
}) {
  return (
    <EditorProvider initialConfig={{ schemaDefinition: esquema, initialValue: valorInicial }}>
      <EventListenerPlugin
        on={(evento) => {
          if (evento.type === "mutation") aoMudar(evento.value ?? []);
        }}
      />
      <NodePlugin nodes={nos} />
      <ListIndexProvider>
        <BarraDeFerramentas />
        <div className="mx-auto max-w-[42rem] pt-10">
          {cabecalho}
          <PortableTextEditable
            aria-label="Texto"
            className="texto-rico editor-texto min-h-[60vh] pt-8 pb-24 focus:outline-none"
            renderPlaceholder={() => <span className="text-apagado">Comece a escrever…</span>}
          />
        </div>
      </ListIndexProvider>
    </EditorProvider>
  );
}

// ---------- Barra de ferramentas ----------

const ESTILOS = [
  { valor: "normal", rotulo: "Parágrafo" },
  { valor: "h2", rotulo: "Título" },
  { valor: "h3", rotulo: "Subtítulo" },
  { valor: "blockquote", rotulo: "Citação" },
] as const;

type Janela = null | "link" | "video" | "botao";

function BarraDeFerramentas() {
  const editor = useEditor();
  const estilo = useEditorSelector(editor, selectors.getActiveStyle) ?? "normal";
  const negrito = useEditorSelector(editor, selectors.isActiveDecorator("strong"));
  const italico = useEditorSelector(editor, selectors.isActiveDecorator("em"));
  const riscado = useEditorSelector(editor, selectors.isActiveDecorator("strike-through"));
  const link = useEditorSelector(editor, selectors.isActiveAnnotation("link"));
  const marcadores = useEditorSelector(editor, selectors.isActiveListItem("bullet"));
  const numerada = useEditorSelector(editor, selectors.isActiveListItem("number"));
  const semSelecao = useEditorSelector(editor, selectors.isSelectionCollapsed);
  const arquivo = useRef<HTMLInputElement>(null);
  const [janela, setJanela] = useState<Janela>(null);

  const focar = () => editor.send({ type: "focus" });
  const fecharJanela = () => {
    setJanela(null);
    focar();
  };
  const enviar = (evento: Parameters<typeof editor.send>[0]) => {
    editor.send(evento);
    focar();
  };
  const inserir = (block: { _type: string; [campo: string]: unknown }) => enviar({ type: "insert.block", block, placement: "auto" });

  // Foto nova: enquadrar na proporção padrão antes de enviar.
  const foto = useFotoEnquadrada(({ id, recorte }) => inserir({ _type: "image", asset: { _type: "reference", _ref: id }, crop: recorte }));

  return (
    <div className="sticky top-0 z-30 border-b border-linha bg-fundo/95 backdrop-blur">
      <div role="toolbar" aria-label="Formatação do texto" className="-mx-1 flex flex-wrap items-center gap-0.5 py-2 lg:flex-nowrap lg:justify-center">
        <BotaoIcone icone="desfazer" rotulo="Desfazer (Ctrl+Z)" aoClicar={() => enviar({ type: "history.undo" })} />
        <BotaoIcone icone="refazer" rotulo="Refazer (Ctrl+Y)" aoClicar={() => enviar({ type: "history.redo" })} />
        <Divisoria />
        <label className="relative flex shrink-0 items-center">
          <span className="sr-only">Estilo do parágrafo</span>
          <select
            value={estilo}
            onChange={(e) => enviar({ type: "style.toggle", style: e.target.value })}
            className="h-9 cursor-pointer appearance-none rounded-full bg-transparent pr-8 pl-3 text-[0.875rem] font-medium text-tinta hover:bg-placa focus:outline-none focus-visible:ring-2 focus-visible:ring-tinta"
          >
            {ESTILOS.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.rotulo}
              </option>
            ))}
          </select>
          <Icone nome="abaixo" className="pointer-events-none absolute right-2.5 size-3.5" />
        </label>
        <Divisoria />
        <BotaoIcone icone="negrito" rotulo="Negrito (Ctrl+B)" ativo={negrito} aoClicar={() => enviar({ type: "decorator.toggle", decorator: "strong" })} />
        <BotaoIcone icone="italico" rotulo="Itálico (Ctrl+I)" ativo={italico} aoClicar={() => enviar({ type: "decorator.toggle", decorator: "em" })} />
        <BotaoIcone icone="riscado" rotulo="Riscado" ativo={riscado} aoClicar={() => enviar({ type: "decorator.toggle", decorator: "strike-through" })} />
        <Divisoria />
        <BotaoIcone
          icone="link"
          rotulo={link ? "Tirar o link" : "Link"}
          ativo={link}
          aoClicar={() => (link ? enviar({ type: "annotation.remove", annotation: { name: "link" } }) : setJanela("link"))}
        />
        <BotaoIcone icone="foto" rotulo="Foto" aoClicar={() => arquivo.current?.click()} />
        <BotaoIcone icone="video" rotulo="Vídeo do YouTube" aoClicar={() => setJanela("video")} />
        <BotaoIcone icone="citacao" rotulo="Citação" ativo={estilo === "blockquote"} aoClicar={() => enviar({ type: "style.toggle", style: "blockquote" })} />
        <Divisoria />
        <BotaoIcone icone="marcadores" rotulo="Lista com marcadores" ativo={marcadores} aoClicar={() => enviar({ type: "list item.toggle", listItem: "bullet" })} />
        <BotaoIcone icone="numerada" rotulo="Lista numerada" ativo={numerada} aoClicar={() => enviar({ type: "list item.toggle", listItem: "number" })} />
        <Divisoria />
        <BotaoIcone icone="botao" rotulo="Botão" aoClicar={() => setJanela("botao")} />
        <BotaoIcone icone="separador" rotulo="Linha separadora" aoClicar={() => inserir({ _type: "separador" })} />
        <input
          ref={arquivo}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const escolhido = e.target.files?.[0];
            e.target.value = "";
            if (escolhido) foto.escolher(escolhido);
          }}
        />
      </div>
      {foto.erro && (
        <p role="alert" className="border-t border-linha py-2 text-sm">
          {foto.erro}
        </p>
      )}
      {foto.janela}

      {janela === "link" && (
        <Dialogo
          titulo="Link"
          botao="Pôr o link"
          campos={[
            ...(semSelecao ? [{ nome: "texto", rotulo: "Texto", placeholder: "O que aparece no texto" }] : []),
            { nome: "href", rotulo: "Endereço", placeholder: "https://", ajuda: "Um site (https://…) ou uma página daqui, como /capela.", url: true },
          ]}
          aoFechar={fecharJanela}
          aoConfirmar={({ texto, href }) => {
            if (semSelecao && !texto) return "Escreva o texto do link.";
            if (!linkValido(href)) return "Use um endereço que comece com https:// ou com /";
            setJanela(null);
            if (semSelecao) enviar({ type: "insert.span", text: texto, annotations: [{ name: "link", value: { href } }] });
            else enviar({ type: "annotation.add", annotation: { name: "link", value: { href } } });
            return null;
          }}
        />
      )}
      {janela === "video" && (
        <Dialogo
          titulo="Vídeo do YouTube"
          botao="Pôr o vídeo"
          campos={[
            {
              nome: "url",
              rotulo: "Endereço do vídeo",
              placeholder: "https://www.youtube.com/watch?v=…",
              ajuda: "No YouTube, clique em Compartilhar e copie o link.",
              url: true,
            },
          ]}
          aoFechar={fecharJanela}
          aoConfirmar={({ url }) => {
            const id = idYoutube(url);
            if (!id) return "Não reconheci esse endereço. Use o link de um vídeo do YouTube.";
            setJanela(null);
            inserir({ _type: "video", url: enderecoYoutube(id) });
            return null;
          }}
        />
      )}
      {janela === "botao" && (
        <Dialogo
          titulo="Botão"
          botao="Pôr o botão"
          campos={[
            { nome: "texto", rotulo: "Texto do botão", placeholder: "Ex.: Quero ajudar" },
            { nome: "link", rotulo: "Leva para", placeholder: "https:// ou /doacoes", ajuda: "Um site (https://…) ou uma página daqui, como /doacoes.", url: true },
          ]}
          aoFechar={fecharJanela}
          aoConfirmar={({ texto, link: destino }) => {
            if (!texto) return "Escreva o texto do botão.";
            if (texto.length > 60) return "Use no máximo 60 caracteres no botão.";
            if (!linkValido(destino)) return "Use um endereço que comece com https:// ou com /";
            setJanela(null);
            inserir({ _type: "botao", texto, link: destino });
            return null;
          }}
        />
      )}
    </div>
  );
}

function BotaoIcone({
  icone,
  rotulo,
  ativo,
  desativado,
  aoClicar,
}: {
  icone: NomeIcone;
  rotulo: string;
  ativo?: boolean;
  desativado?: boolean;
  aoClicar: () => void;
}) {
  return (
    <button
      type="button"
      title={rotulo}
      aria-label={rotulo}
      aria-pressed={ativo}
      disabled={desativado}
      // Não tira o foco do texto ao clicar: a seleção continua onde estava.
      onMouseDown={(e) => e.preventDefault()}
      onClick={aoClicar}
      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-150 disabled:opacity-50 ${
        ativo ? "bg-marca text-marca-texto" : "text-tinta hover:bg-placa"
      }`}
    >
      <Icone nome={icone} />
    </button>
  );
}

function Divisoria() {
  return <span aria-hidden="true" className="mx-1.5 h-5 w-px shrink-0 bg-linha" />;
}

// ---------- Blocos especiais dentro do texto ----------

/** Moldura comum: o conteúdo não é editável como texto; botões para subir, descer e remover. */
function Moldura({
  props,
  rotulo,
  extras,
  children,
}: {
  props: BlockObjectRenderProps;
  rotulo: string;
  /** Botões a mais, antes de subir/descer/remover (ex.: enquadrar a foto). */
  extras?: React.ReactNode;
  children: React.ReactNode;
}) {
  const editor = useEditor();
  const at = props.path as BlockPath;
  const parar = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div {...(props.attributes as Atributos)}>
      <div
        contentEditable={false}
        className={`group relative my-8 rounded-[10px] ring-offset-4 ring-offset-fundo ${props.selected ? "ring-2 ring-tinta" : ""}`}
        onKeyDown={parar}
        onBeforeInput={parar}
        onPaste={parar}
      >
        {children}
        <div className="absolute top-2 right-2 z-10 flex gap-0.5 rounded-full bg-superficie/90 p-0.5 shadow-sm ring-1 ring-linha backdrop-blur md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          {extras}
          <BotaoIcone icone="acima" rotulo={`Subir ${rotulo}`} aoClicar={() => editor.send({ type: "move.block up", at })} />
          <BotaoIcone icone="abaixo" rotulo={`Descer ${rotulo}`} aoClicar={() => editor.send({ type: "move.block down", at })} />
          <BotaoIcone icone="lixeira" rotulo={`Remover ${rotulo}`} aoClicar={() => editor.send({ type: "delete.block", at })} />
        </div>
      </div>
      {props.children}
    </div>
  );
}

const CAMPO_BLOCO =
  "h-10 w-full rounded-[8px] border border-borda-campo bg-fundo px-3 text-[0.9375rem] text-tinta placeholder:text-apagado focus:border-tinta focus:outline-none aria-[invalid=true]:border-tinta";

function useDefinir(props: BlockObjectRenderProps) {
  const editor = useEditor();
  return (campo: string, valor: string) => editor.send({ type: "block.set", at: props.path as BlockPath, props: { [campo]: valor.trim() } });
}

/** Campo de link dentro de um bloco: só grava se o endereço for aceito. */
function CampoLink({ inicial, rotulo, placeholder, obrigatorio, aoGravar }: { inicial?: string; rotulo: string; placeholder: string; obrigatorio?: boolean; aoGravar: (v: string) => void }) {
  const [erro, setErro] = useState("");
  return (
    <div>
      <input
        type="text"
        inputMode="url"
        defaultValue={inicial ?? ""}
        maxLength={500}
        placeholder={placeholder}
        aria-label={rotulo}
        aria-invalid={Boolean(erro)}
        onBlur={(e) => {
          const valor = e.target.value.trim();
          if ((valor || obrigatorio) && !linkValido(valor)) return setErro("Use https://… ou uma página daqui, como /capela.");
          setErro("");
          aoGravar(valor);
        }}
        className={CAMPO_BLOCO}
      />
      {erro && <p className="mt-1 text-xs">{erro}</p>}
    </div>
  );
}

/** Foto dentro do texto: imagem, legenda, descrição e um link opcional ao clicar. */
function FotoNoTexto(props: BlockObjectRenderProps) {
  const editor = useEditor();
  const definir = useDefinir(props);
  const no = props.node as { asset?: { _ref?: string }; alt?: string; legenda?: string; link?: string; crop?: Recorte };
  const ref = no.asset?._ref;
  const foto = useFotoEnquadrada(({ recorte }) => editor.send({ type: "block.set", at: props.path as BlockPath, props: { crop: recorte } }));
  // Prévia recortada pelo CDN do Sanity, como no site.
  const src = ref ? urlImagem({ asset: { _ref: ref }, crop: no.crop }).width(1200).height(800).fit("crop").url() : "";
  return (
    <Moldura
      props={props}
      rotulo="a foto"
      extras={ref && <BotaoIcone icone="recortar" rotulo="Enquadrar a foto" aoClicar={() => foto.ajustar(ref, no.crop)} />}
    >
      {src && <FotoDoPainel key={src} src={src} className="aspect-[3/2] w-full rounded-[10px] bg-placa object-cover" />}
      {/* A janela abre por cima de tudo, mas os cliques nela não devem chegar ao editor. */}
      <span onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
        {foto.janela}
      </span>
      <input
        type="text"
        defaultValue={no.legenda ?? ""}
        maxLength={200}
        placeholder="Escreva uma legenda (opcional)"
        aria-label="Legenda da foto"
        onBlur={(e) => definir("legenda", e.target.value)}
        className="mt-2 w-full bg-transparent text-center text-sm text-suave placeholder:text-apagado focus:text-tinta focus:outline-none"
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <input
            type="text"
            defaultValue={no.alt ?? ""}
            maxLength={160}
            placeholder="Descreva a foto (opcional)"
            aria-label="Descrição da foto"
            aria-describedby={`alt-ajuda-${props.node._key}`}
            onBlur={(e) => definir("alt", e.target.value)}
            className={`peer ${CAMPO_BLOCO}`}
          />
          <p id={`alt-ajuda-${props.node._key}`} className="mt-1 hidden text-xs text-suave peer-focus:block">
            Opcional. É lida em voz alta para pessoas cegas (pelo leitor de tela do celular ou computador) e aparece no lugar da foto se ela não carregar. Ex.: Fiéis na procissão de Corpus Christi.
          </p>
        </div>
        <CampoLink inicial={no.link} rotulo="Link ao clicar na foto" placeholder="Link ao clicar (opcional)" aoGravar={(v) => definir("link", v)} />
      </div>
    </Moldura>
  );
}

function VideoNoTexto(props: BlockObjectRenderProps) {
  const id = idYoutube(String((props.node as { url?: string }).url ?? ""));
  return (
    <Moldura props={props} rotulo="o vídeo">
      <div className="relative aspect-video overflow-hidden rounded-[10px] bg-placa">
        {id && (
          // eslint-disable-next-line @next/next/no-img-element -- miniatura do próprio YouTube
          <img src={miniaturaYoutube(id)} alt="" className="size-full object-cover" />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-black/70 text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 size-7 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
      <p className="mt-2 text-center text-sm text-suave">Vídeo do YouTube</p>
    </Moldura>
  );
}

function BotaoNoTexto(props: BlockObjectRenderProps) {
  const definir = useDefinir(props);
  const no = props.node as { texto?: string; link?: string };
  return (
    <Moldura props={props} rotulo="o botão">
      <div className="rounded-[10px] border border-dashed border-linha p-5">
        <span className="pill pill-primaria pointer-events-none">{no.texto || "Botão"}</span>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <input
            type="text"
            defaultValue={no.texto ?? ""}
            maxLength={60}
            placeholder="Texto do botão"
            aria-label="Texto do botão"
            onBlur={(e) => e.target.value.trim() && definir("texto", e.target.value)}
            className={CAMPO_BLOCO}
          />
          <CampoLink inicial={no.link} rotulo="Link do botão" placeholder="https:// ou /doacoes" obrigatorio aoGravar={(v) => definir("link", v)} />
        </div>
      </div>
    </Moldura>
  );
}

function SeparadorNoTexto(props: BlockObjectRenderProps) {
  return (
    <Moldura props={props} rotulo="a linha">
      <div className="py-6">
        <hr className="border-0 border-t border-linha" />
      </div>
    </Moldura>
  );
}
