import "server-only";
import { lerPainelComRascunhos, sanityPainel } from "./sanity";

// Faxina de fotos. Apagar um artigo apaga o documento, mas a foto é guardada à parte no Sanity e
// continuaria lá ocupando espaço. Aqui apagamos as fotos que nenhum conteúdo usa mais.
// Duas travas: (1) só sai foto sem nenhuma referência, contando rascunhos e o conteúdo do Studio
// (padres, Sobre, capela); (2) o próprio Sanity recusa apagar uma foto que ainda esteja em uso.

/** Fotos enviadas há menos tempo que isto ficam: podem estar num texto que ainda não foi salvo. */
const CARENCIA_DIAS = 7;
/** Por rodada, para a faxina nunca pesar. */
const POR_RODADA = 50;

const SEM_USO = `_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0`;

async function apagar(ids: string[]) {
  let apagadas = 0;
  for (const id of ids) {
    try {
      await sanityPainel().delete(id);
      apagadas++;
    } catch (erro) {
      // Em uso em algum lugar, ou falha de conexão: fica para a próxima faxina.
      console.error("faxina de fotos:", id, erro instanceof Error ? erro.message : erro);
    }
  }
  return apagadas;
}

/** Fotos que estavam num texto apagado: saem na hora, se nenhum outro conteúdo as usa. */
export async function apagarFotosDoTexto(ids: string[]) {
  const unicos = [...new Set(ids)].filter((id) => id.startsWith("image-"));
  if (unicos.length === 0) return 0;
  const semUso = await lerPainelComRascunhos<string[]>(`*[_id in $ids && ${SEM_USO}]._id`, { ids: unicos });
  return apagar(semUso);
}

/** Faxina geral: fotos trocadas, tiradas do texto ou enviadas e nunca salvas, com mais de 7 dias. */
export async function apagarFotosSemUso() {
  const limite = new Date(Date.now() - CARENCIA_DIAS * 24 * 60 * 60 * 1000).toISOString();
  const semUso = await lerPainelComRascunhos<string[]>(`*[${SEM_USO} && _createdAt < $limite][0...${POR_RODADA}]._id`, { limite });
  return apagar(semUso);
}

/** Todas as fotos usadas por um artigo ou notícia (capa e fotos no texto), publicado e rascunho. */
export async function fotosDoTexto(tipo: string, id: string) {
  const listas = await lerPainelComRascunhos<(string | null)[][]>(
    `*[_type == $tipo && _id in [$id, "drafts." + $id]]{"fotos": [imagem.asset._ref] + coalesce(corpo[_type == "image"].asset._ref, [])}.fotos`,
    { tipo, id },
  );
  return listas.flat().filter((f): f is string => typeof f === "string");
}
