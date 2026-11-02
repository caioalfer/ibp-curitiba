import QRCode from "qrcode";
import type { DadosDoacao } from "@/lib/doacao";
import { pixCopiaECola } from "@/lib/pix";
import { CopiarTexto } from "./CopiarTexto";

/** Como doar: QR code do Pix (gerado da chave), Pix copia e cola, chave e dados para transferência. */
export async function ComoDoar({ dados }: { dados: DadosDoacao }) {
  const copiaECola = dados.favorecido
    ? pixCopiaECola({ chave: dados.chavePix, nome: dados.favorecido, cidade: dados.cidade || "Curitiba" })
    : undefined;
  const qrSvg = copiaECola
    ? await QRCode.toString(copiaECola, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#ffffff" },
      })
    : undefined;

  const transferencia = [
    ["Banco", dados.banco],
    ["Agência", dados.agencia],
    ["Conta", dados.conta],
    ["Favorecido", dados.favorecido],
    ["CNPJ", dados.cnpj],
  ].filter((l): l is [string, string] => Boolean(l[1]));

  return (
    <div className="flex flex-col gap-8">
      {qrSvg && (
        <div>
          <p className="rotulo text-suave">Pix pelo QR code</p>
          {/* Fundo branco nos dois temas: leitores de QR precisam de contraste escuro sobre claro. */}
          <div className="mt-3 w-full max-w-[15rem] rounded-[10px] bg-white p-4">
            <div
              role="img"
              aria-label={`QR code do Pix para doação: ${dados.finalidade}`}
              className="[&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
          <p className="mt-3 text-sm text-suave">Abra o app do banco, escolha Pix e aponte a câmera.</p>
        </div>
      )}

      <div className={qrSvg ? "border-t border-linha pt-6" : ""}>
        <p className="rotulo text-suave">Chave Pix</p>
        <p className="mt-2 text-xl font-medium break-all">{dados.chavePix}</p>
        {!dados.conta && dados.banco && <p className="mt-1 text-suave">{dados.banco}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <CopiarTexto texto={dados.chavePix} rotulo="Copiar chave" />
          {copiaECola && <CopiarTexto texto={copiaECola} rotulo="Copiar Pix copia e cola" />}
        </div>
      </div>

      {dados.conta && (
        <div className="border-t border-linha pt-6">
          <p className="rotulo text-suave">Transferência bancária</p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {transferencia.map(([rotulo, valor]) => (
              <div key={rotulo} className="contents">
                <dt className="text-suave">{rotulo}</dt>
                <dd className="font-medium break-words">{valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
