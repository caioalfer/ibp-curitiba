// Pix "copia e cola" (BR Code estático, padrão EMV do Banco Central), a partir da chave,
// do nome do favorecido e da cidade. O mesmo texto vira o QR code da página da capela.

function campo(id: string, valor: string) {
  return `${id}${valor.length.toString().padStart(2, "0")}${valor}`;
}

/** Sem acentos e só caracteres aceitos pelos bancos, cortado no tamanho máximo do campo. */
function limpar(texto: string, max: number) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 .\-]/g, "")
    .slice(0, max)
    .trim();
}

/** CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no fim do BR Code. */
function crc16(texto: string) {
  let crc = 0xffff;
  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Chave de CPF/CNPJ/telefone vai só com números (telefone com +55); e-mail em minúsculas; chave aleatória, como veio.
 */
function normalizarChave(chave: string) {
  const c = chave.trim();
  if (c.includes("@")) return c.toLowerCase();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(c)) return c;
  if (c.startsWith("+")) return `+${c.replace(/\D/g, "")}`;
  return c.replace(/\D/g, "") || c;
}

export function pixCopiaECola({ chave, nome, cidade }: { chave: string; nome: string; cidade: string }) {
  const contaPix = campo("00", "br.gov.bcb.pix") + campo("01", normalizarChave(chave));
  const semCrc =
    campo("00", "01") +
    campo("26", contaPix) +
    campo("52", "0000") +
    campo("53", "986") +
    campo("58", "BR") +
    campo("59", limpar(nome, 25) || "IBP") +
    campo("60", limpar(cidade, 15) || "CURITIBA") +
    campo("62", campo("05", "***")) +
    "6304";
  return semCrc + crc16(semCrc);
}
