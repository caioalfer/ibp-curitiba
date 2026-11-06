// Roda no navegador: reduz a foto antes de enviar (fotos de celular têm 5–10 MB).
// Lado maior de até 2400 px, JPEG com qualidade 0,86 — sobra qualidade para o site e o envio fica leve.

export async function reduzirImagem(arquivo: File, ladoMaximo = 2400): Promise<File> {
  if (!arquivo.type.startsWith("image/")) throw new Error("Escolha um arquivo de imagem.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(arquivo);
  } catch {
    // Ex.: fotos de iPhone em HEIC, que o navegador não abre.
    throw new Error("Não consegui abrir esta foto. Use JPG, PNG ou WebP (no iPhone, exporte a foto como JPG).");
  }
  const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
  const largura = Math.round(bitmap.width * escala);
  const altura = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível preparar a foto.");
  ctx.fillStyle = "#ffffff"; // fundo branco para PNG com transparência
  ctx.fillRect(0, 0, largura, altura);
  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const blob = await new Promise<Blob>((ok, erro) =>
    canvas.toBlob((b) => (b ? ok(b) : erro(new Error("Não foi possível preparar a foto."))), "image/jpeg", 0.86),
  );
  const nome = arquivo.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${nome}.jpg`, { type: "image/jpeg" });
}
