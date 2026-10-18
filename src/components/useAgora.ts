"use client";

import { useEffect, useState } from "react";
import { agoraEmCuritiba } from "@/lib/datas";

/** Data e hora de Curitiba pelo relógio do navegador, atualizadas a cada minuto. */
export function useAgora(agoraServidor: { data: string; hora: string }) {
  const [agora, setAgora] = useState(agoraServidor);
  useEffect(() => {
    const atualizar = () => setAgora(agoraEmCuritiba());
    atualizar();
    const timer = setInterval(atualizar, 60_000);
    return () => clearInterval(timer);
  }, []);
  return agora;
}
