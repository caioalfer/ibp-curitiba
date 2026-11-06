// Vídeos do YouTube dentro do texto. Sem dependências: usado no painel, no servidor e no site.

/** Identificador do vídeo (11 caracteres) a partir de qualquer endereço do YouTube; null se não for um. */
export function idYoutube(endereco: string): string | null {
  let url: URL;
  try {
    url = new URL(endereco.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^(www|m)\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "music.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else id = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?#]+)/)?.[2] ?? null;
  }
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

/** Endereço guardado no conteúdo: sempre o formato padrão. */
export const enderecoYoutube = (id: string) => `https://www.youtube.com/watch?v=${id}`;

/** Player sem cookies de rastreamento até a pessoa dar play. */
export const playerYoutube = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;

export const miniaturaYoutube = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
