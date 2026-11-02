// Dados reais para doação. Ficam no código, e não no painel, de propósito: invadir o painel
// não permite trocar a chave Pix, e cada alteração fica registrada no histórico do Git.
// Ver docs/painel-e-seguranca.md (seção 3). Ao alterar, testar com um Pix de valor baixo.

export type DadosDoacao = {
  /** Para que serve; aparece na descrição do QR code. */
  finalidade: string;
  chavePix: string;
  /** Titular da conta. Sem ele, o site mostra só a chave, sem QR code. */
  favorecido?: string;
  /** Cidade do Pix copia e cola. */
  cidade?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  cnpj?: string;
};

export const DOACAO_CAPELA: DadosDoacao = {
  finalidade: "Projeto Capela da Imaculada Conceição",
  chavePix: "24449288000144",
  favorecido: "ASSOCIACAO CIVIL SAO PIO V",
  cidade: "Curitiba",
  banco: "Banco Bradesco (237)",
  agencia: "2936",
  conta: "29637-6",
  cnpj: "24.449.288/0001-44",
};

export const DOACAO_CASA: DadosDoacao = {
  finalidade: "Manutenção básica da casa",
  chavePix: "curitibaibp@gmail.com",
  banco: "Banco Inter",
};
