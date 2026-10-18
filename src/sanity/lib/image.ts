import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId: projectId || "nao-configurado", dataset });

export function urlImagem(fonte: SanityImageSource) {
  return builder.image(fonte).auto("format").fit("max");
}
