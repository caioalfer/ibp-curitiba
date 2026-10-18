export const CHAVE_TEMA = "tema";
export const MIDIA_ESCURO = "(prefers-color-scheme: dark)";

/**
 * Roda no <head> antes da pintura: aplica a escolha salva (localStorage) ou o tema do sistema,
 * para a página não piscar no tema errado. O seletor do cabeçalho (SeletorTema) mantém isso depois.
 */
export const SCRIPT_TEMA = `(function(){try{var p=localStorage.getItem("${CHAVE_TEMA}");var e=p==="escuro"||(p!=="claro"&&matchMedia("${MIDIA_ESCURO}").matches);document.documentElement.dataset.tema=e?"escuro":"claro"}catch(_){}})()`;
