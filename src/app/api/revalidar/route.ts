import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Webhook do Sanity: ao publicar um documento, invalida o cache das consultas que leem aquele tipo.
 * Configurar em sanity.io/manage → API → Webhooks (ver README).
 */
export async function POST(req: NextRequest) {
  const segredo = process.env.SANITY_REVALIDATE_SECRET;
  if (!segredo) return new NextResponse("Segredo não configurado", { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, segredo, true);
    if (!isValidSignature) return new NextResponse("Assinatura inválida", { status: 401 });
    if (!body?._type) return new NextResponse("Sem _type", { status: 400 });

    revalidateTag(body._type, "max");
    return NextResponse.json({ revalidado: body._type });
  } catch (erro) {
    console.error(erro);
    return new NextResponse("Erro ao revalidar", { status: 500 });
  }
}
