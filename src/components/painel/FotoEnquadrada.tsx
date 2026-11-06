"use client";

import { useState } from "react";
import { enviarImagem } from "@/app/painel/(area)/publicacoes/acoes";
import { reduzirImagem } from "@/lib/painel/reduzirImagem";
import type { Recorte } from "@/lib/proporcaoFoto";
import { urlImagem } from "@/sanity/lib/image";
import { RecortarFoto } from "./RecortarFoto";

type Pedido = { tipo: "nova"; arquivo: File; src: string } | { tipo: "ajuste"; id: string; src: string; recorte?: Recorte };

/**
 * Escolher uma foto nova (reduz no navegador → enquadra → envia) ou reenquadrar uma já enviada.
 * Nada é enviado se a pessoa cancelar. Usado na capa e nas fotos dentro do texto.
 */
export function useFotoEnquadrada(aoConcluir: (foto: { id: string; recorte: Recorte }) => void) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [erro, setErro] = useState("");

  async function escolher(arquivo: File) {
    setErro("");
    try {
      const reduzida = await reduzirImagem(arquivo);
      setPedido({ tipo: "nova", arquivo: reduzida, src: URL.createObjectURL(reduzida) });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível abrir a foto.");
    }
  }

  function ajustar(id: string, recorte?: Recorte) {
    // A foto inteira, sem o recorte atual, para reenquadrar à vontade.
    setPedido({ tipo: "ajuste", id, src: urlImagem({ asset: { _ref: id } }).width(1600).url(), recorte });
  }

  function fechar() {
    if (pedido?.tipo === "nova") URL.revokeObjectURL(pedido.src);
    setPedido(null);
  }

  const janela = pedido && (
    <RecortarFoto
      src={pedido.src}
      inicial={pedido.tipo === "ajuste" ? pedido.recorte : undefined}
      botao={pedido.tipo === "nova" ? "Usar esta foto" : "Salvar enquadramento"}
      aoCancelar={fechar}
      aoConfirmar={async (recorte) => {
        let id = pedido.tipo === "ajuste" ? pedido.id : "";
        if (pedido.tipo === "nova") {
          try {
            const dados = new FormData();
            dados.append("arquivo", pedido.arquivo);
            const resultado = await enviarImagem(dados);
            if (!resultado.ok) return resultado.erro;
            id = resultado.id;
          } catch {
            // A chamada nem chegou ao servidor do painel.
            return navigator.onLine
              ? "Não foi possível falar com o painel agora. Confira a internet e tente de novo."
              : "Você está sem internet. Quando voltar, clique de novo.";
          }
        }
        aoConcluir({ id, recorte });
        fechar();
        return null;
      }}
    />
  );

  return { escolher, ajustar, janela, erro };
}
