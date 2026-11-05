import NextImage, { type ImageProps } from "next/image";
import { Image as ImagemSanity } from "next-sanity/image";

/**
 * Fotos do painel são redimensionadas pelo CDN do próprio Sanity (incluído no plano dele), e não
 * pelo otimizador de imagens da Vercel, que tem cota. As imagens do projeto (src/assets) seguem com o Next.
 */
export function Imagem(props: ImageProps) {
  const { src } = props;
  if (typeof src === "string" && src.startsWith("https://cdn.sanity.io/")) {
    return <ImagemSanity {...props} src={src} loader={undefined} />;
  }
  return <NextImage {...props} />;
}
