"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PROPORCAO_FOTO, type Recorte } from "@/lib/proporcaoFoto";

// Janela para enquadrar a foto na proporção padrão: arrastar para posicionar, controle para aproximar.
// A foto original é guardada inteira; só o recorte (frações de cada lado) vai junto. Assim dá para
// reenquadrar depois sem enviar de novo.

type Ponto = { x: number; y: number };

const ZOOM_MAXIMO = 4;
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Escala base em que a foto cobre o quadro (quadro com largura 1 e altura 1/PROPORCAO_FOTO). */
function escalaBase(w: number, h: number) {
  return Math.max(1 / w, 1 / PROPORCAO_FOTO / h);
}

/** Parte visível da foto, em frações da largura e da altura, para um zoom. */
function visivel(w: number, h: number, zoom: number) {
  const s = escalaBase(w, h) * zoom;
  return { vw: 1 / (w * s), vh: 1 / PROPORCAO_FOTO / (h * s) };
}

function centroValido(c: Ponto, w: number, h: number, zoom: number): Ponto {
  const { vw, vh } = visivel(w, h, zoom);
  return { x: limitar(c.x, vw / 2, 1 - vw / 2), y: limitar(c.y, vh / 2, 1 - vh / 2) };
}

function paraRecorte(c: Ponto, w: number, h: number, zoom: number): Recorte {
  const { vw, vh } = visivel(w, h, zoom);
  const r = (v: number) => Math.max(0, Math.round(v * 10000) / 10000);
  return { left: r(c.x - vw / 2), right: r(1 - c.x - vw / 2), top: r(c.y - vh / 2), bottom: r(1 - c.y - vh / 2) };
}

function deRecorte(rec: Recorte, w: number, h: number): { centro: Ponto; zoom: number } {
  const vw = 1 - rec.left - rec.right;
  const zoom = limitar(1 / (vw * w) / escalaBase(w, h), 1, ZOOM_MAXIMO);
  const centro = { x: rec.left + vw / 2, y: rec.top + (1 - rec.top - rec.bottom) / 2 };
  return { centro: centroValido(centro, w, h, zoom), zoom };
}

export function RecortarFoto({
  src,
  inicial,
  botao,
  aoConfirmar,
  aoCancelar,
}: {
  /** Endereço da foto inteira (local, antes de enviar, ou do Sanity, para reenquadrar). */
  src: string;
  inicial?: Recorte;
  botao: string;
  /** Pode demorar (envio da foto). Devolve uma mensagem de erro, ou null quando deu certo. */
  aoConfirmar: (recorte: Recorte) => Promise<string | null>;
  aoCancelar: () => void;
}) {
  const quadro = useRef<HTMLDivElement>(null);
  const [tamanho, setTamanho] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [centro, setCentro] = useState<Ponto>({ x: 0.5, y: 0.5 });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [naoCarregou, setNaoCarregou] = useState(false);
  const arraste = useRef<{ id: number; x: number; y: number } | null>(null);
  const cancelar = useRef(aoCancelar);
  useEffect(() => {
    cancelar.current = aoCancelar;
  });

  useEffect(() => {
    quadro.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cancelar.current();
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, []);

  function aoCarregar(e: React.SyntheticEvent<HTMLImageElement>) {
    const w = e.currentTarget.naturalWidth;
    const h = e.currentTarget.naturalHeight;
    setTamanho({ w, h });
    if (inicial) {
      const r = deRecorte(inicial, w, h);
      setZoom(r.zoom);
      setCentro(r.centro);
    }
  }

  function mover(dxPx: number, dyPx: number) {
    if (!tamanho || !quadro.current) return;
    const larguraPx = quadro.current.getBoundingClientRect().width;
    const s = escalaBase(tamanho.w, tamanho.h) * zoom * larguraPx; // px por pixel da foto
    setCentro((c) => centroValido({ x: c.x - dxPx / (tamanho.w * s), y: c.y - dyPx / (tamanho.h * s) }, tamanho.w, tamanho.h, zoom));
  }

  function mudarZoom(novo: number) {
    if (!tamanho) return;
    const z = limitar(novo, 1, ZOOM_MAXIMO);
    setZoom(z);
    setCentro((c) => centroValido(c, tamanho.w, tamanho.h, z));
  }

  async function confirmar() {
    if (!tamanho || enviando) return;
    setErro("");
    setEnviando(true);
    const problema = await aoConfirmar(paraRecorte(centro, tamanho.w, tamanho.h, zoom));
    if (problema) {
      setErro(problema);
      setEnviando(false);
    }
  }

  // Posição da foto dentro do quadro, em % (não depende do tamanho da tela).
  let estilo: React.CSSProperties = { visibility: "hidden" };
  if (tamanho) {
    const s = escalaBase(tamanho.w, tamanho.h) * zoom;
    const larguraFoto = tamanho.w * s; // em larguras do quadro
    const alturaFoto = tamanho.h * s * PROPORCAO_FOTO; // em alturas do quadro
    estilo = {
      width: `${larguraFoto * 100}%`,
      left: `${(0.5 - centro.x * larguraFoto) * 100}%`,
      top: `${(0.5 - centro.y * alturaFoto) * 100}%`,
    };
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-[8vh]">
      <div role="dialog" aria-modal="true" aria-labelledby="recorte-titulo" className="w-full max-w-2xl rounded-[14px] bg-superficie p-5 shadow-2xl ring-1 ring-linha md:p-6">
        <h2 id="recorte-titulo" className="text-xl font-medium">
          Enquadrar a foto
        </h2>
        <p className="mt-1 text-[0.9375rem] text-suave">Arraste a foto para posicionar e use o controle para aproximar. Todas as fotos ficam neste formato.</p>

        <div
          ref={quadro}
          tabIndex={0}
          role="application"
          aria-label="Área de enquadramento. Use as setas para mover a foto e as teclas + e − para aproximar ou afastar."
          className="relative mt-5 aspect-[3/2] cursor-grab touch-none overflow-hidden rounded-[10px] bg-placa select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-tinta active:cursor-grabbing"
          onPointerDown={(e) => {
            arraste.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const a = arraste.current;
            if (!a || a.id !== e.pointerId) return;
            mover(e.clientX - a.x, e.clientY - a.y);
            arraste.current = { id: a.id, x: e.clientX, y: e.clientY };
          }}
          onPointerUp={() => (arraste.current = null)}
          onPointerCancel={() => (arraste.current = null)}
          onKeyDown={(e) => {
            const passo = 12;
            const acoes: Record<string, () => void> = {
              ArrowLeft: () => mover(passo, 0),
              ArrowRight: () => mover(-passo, 0),
              ArrowUp: () => mover(0, passo),
              ArrowDown: () => mover(0, -passo),
              "+": () => mudarZoom(zoom + 0.1),
              "=": () => mudarZoom(zoom + 0.1),
              "-": () => mudarZoom(zoom - 0.1),
            };
            if (acoes[e.key]) {
              e.preventDefault();
              acoes[e.key]();
            }
            if (e.key === "Enter") {
              e.preventDefault();
              confirmar();
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- foto local ou do CDN, posicionada à mão */}
          <img src={src} alt="" draggable={false} onLoad={aoCarregar} onError={() => setNaoCarregou(true)} className="pointer-events-none absolute h-auto max-w-none" style={estilo} />
          {/* Linhas dos terços, para ajudar a compor. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="border-[0.5px] border-white/25" />
            ))}
          </span>
          {!tamanho && (
            <span className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-suave">
              {naoCarregou ? "A foto não carregou. Confira a internet, feche esta janela e tente de novo." : "Carregando a foto…"}
            </span>
          )}
        </div>

        <label className="mt-5 flex items-center gap-4">
          <span className="shrink-0 text-[0.9375rem] font-medium">Aproximar</span>
          <input
            type="range"
            min={1}
            max={ZOOM_MAXIMO}
            step={0.01}
            value={zoom}
            onChange={(e) => mudarZoom(Number(e.target.value))}
            className="w-full accent-[var(--tinta)]"
          />
        </label>

        {erro && (
          <p role="alert" className="mt-4 text-sm">
            {erro}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={aoCancelar} disabled={enviando} className="pill pill-contorno min-h-10 text-[0.9375rem] disabled:opacity-60">
            Cancelar
          </button>
          <button type="button" onClick={confirmar} disabled={!tamanho || enviando} className="pill pill-primaria min-h-10 text-[0.9375rem] disabled:opacity-60">
            {enviando ? "Enviando…" : botao}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
