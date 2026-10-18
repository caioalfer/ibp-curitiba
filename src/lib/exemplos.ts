// Conteúdo de EXEMPLO para demonstrar o site enquanto o Sanity não está configurado.
// Cada item sai marcado como "Exemplo" na tela. Some sozinho quando o painel estiver ligado.
// As datas são relativas a hoje para os avisos nunca vencerem durante a demonstração.
// Imagens: fotos enviadas pelo cliente e pinturas em domínio público (origem gravada em cada arquivo).

import type { PortableTextBlock } from "next-sanity";
import capa from "@/assets/capa-missa.png";
import peregrinacao from "@/assets/exemplos/peregrinacao-aparecida.jpg";
import beleza from "@/assets/exemplos/beleza-anunciacao-fra-angelico.jpg";
import silencio from "@/assets/exemplos/silencio-la-tour.jpg";
import tempo from "@/assets/exemplos/tempo-agostinho-champaigne.jpg";
import type { Aviso, Publicacao } from "@/sanity/lib/queries";
import { somarDias } from "./datas";

/** Parágrafos; "## " no início vira subtítulo, "> " vira citação. */
function corpo(...trechos: string[]): PortableTextBlock[] {
  return trechos.map((t, i) => {
    const estilo = t.startsWith("## ") ? "h2" : t.startsWith("> ") ? "blockquote" : "normal";
    const texto = estilo === "normal" ? t : t.slice(estilo === "h2" ? 3 : 2);
    return {
      _type: "block",
      _key: `b${i}`,
      style: estilo,
      markDefs: [],
      children: [{ _type: "span", _key: `s${i}`, text: texto, marks: [] }],
    };
  });
}

export function avisosExemplo(hoje: string): Aviso[] {
  return [
    {
      _id: "ex-aviso-1",
      texto:
        "Confissões aos domingos: o padre atende às 8h, às 9h30 e às 18h30. Chegue com antecedência, sobretudo antes da Missa cantada.",
      validoAte: somarDias(hoje, 30),
      link: "/horarios",
      exemplo: true,
    },
    {
      _id: "ex-aviso-2",
      texto: "Curso de latim litúrgico às quartas-feiras, depois da Missa. Inscrições com o padre.",
      validoAte: somarDias(hoje, 21),
      exemplo: true,
    },
    {
      _id: "ex-aviso-3",
      texto: "Mês dos fiéis defuntos: entregue na sacristia os nomes dos falecidos que deseja recomendar nas Missas de novembro.",
      validoAte: somarDias(hoje, 14),
      exemplo: true,
    },
  ];
}

export function artigosExemplo(hoje: string): Publicacao[] {
  return [
    {
      _id: "ex-artigo-1",
      titulo: "Sobre o silêncio",
      slug: "sobre-o-silencio",
      data: somarDias(hoje, -3),
      tema: "vida-espiritual",
      resumo:
        "Uma época que preenche cada instante com ruído teme, no fundo, o que o silêncio poderia lhe dizer. A liturgia guarda esse silêncio no seu centro.",
      imagemLocal: silencio,
      imagemAlt: "Mulher sentada no escuro, o rosto apoiado na mão, diante de uma lamparina acesa",
      imagemCredito: "Georges de La Tour, A Madalena da lamparina (c. 1642–1644). Museu do Louvre.",
      exemplo: true,
      corpo: corpo(
        "Pascal escreveu que toda a infelicidade dos homens vem de uma só coisa: não saber ficar em repouso num quarto. Três séculos depois, a observação soa quase como profecia. Nunca tivemos tantos meios de não ficar a sós conosco.",
        "O ruído moderno não é apenas sonoro. É a sucessão ininterrupta de estímulos que dispensa o homem de perguntar o que está fazendo e para onde vai. Quem nunca cala não precisa ouvir, e quem não ouve não corre o risco de ser interpelado.",
        "## O silêncio não é vazio",
        "Costuma-se pensar o silêncio como ausência: falta de som, falta de palavra, falta de coisa. Mas o silêncio verdadeiro é uma presença. É o espaço em que algo pode, enfim, ser recebido. O ouvido só escuta quando a boca descansa.",
        "Por isso a tradição contemplativa sempre o tratou como uma disciplina, e não como um acidente. O monge não se cala porque nada tem a dizer, mas porque sabe que a Palavra que importa não é a sua.",
        "## O Cânon em voz baixa",
        "Quem assiste pela primeira vez à Missa tradicional costuma se surpreender com o momento em que o sacerdote, voltado para o altar, passa a rezar em voz baixa. Justamente no ponto mais alto da ação sagrada, a palavra se recolhe.",
        "> O silêncio do Cânon não exclui o fiel: ensina-o a estar diante do mistério sem a pretensão de dominá-lo.",
        "Há nisso uma pedagogia que o mundo esqueceu. Diante do que é maior do que nós, a primeira resposta digna não é o comentário, mas a adoração. A lamparina que arde diante do sacrário não diz nada, e é precisamente por isso que diz tudo.",
      ),
    },
    {
      _id: "ex-artigo-2",
      titulo: "O tempo e a eternidade",
      slug: "o-tempo-e-a-eternidade",
      data: somarDias(hoje, -10),
      tema: "doutrina",
      resumo:
        "Santo Agostinho confessava não saber explicar o que é o tempo. O ano litúrgico oferece outra resposta: não uma definição, mas uma forma de habitá-lo.",
      imagemLocal: tempo,
      imagemAlt: "Santo Agostinho escrevendo, com o olhar erguido para um coração em chamas",
      imagemCredito: "Philippe de Champaigne, Santo Agostinho (c. 1645–1650). Los Angeles County Museum of Art.",
      exemplo: true,
      corpo: corpo(
        "No livro XI das Confissões, Santo Agostinho faz a pergunta que nenhum relógio responde: que é, pois, o tempo? Se ninguém lhe pergunta, ele sabe; se quer explicá-lo a quem pergunta, já não sabe.",
        "O passado já não é, o futuro ainda não é, e o presente, se fosse sempre presente, não seria tempo, mas eternidade. Vivemos, então, numa espécie de passagem contínua, sempre escapando de nós mesmos.",
        "## Duas maneiras de contar os dias",
        "O homem moderno conta o tempo como quantidade: horas produtivas, prazos, metas. Nessa contagem, todos os dias são iguais e nenhum é sagrado. O resultado paradoxal é que, quanto mais o administramos, menos o possuímos.",
        "A Igreja conta de outro modo. O ano litúrgico não é um calendário de compromissos, mas uma sucessão de mistérios: a espera do Advento, a alegria do Natal, a penitência da Quaresma, a vitória da Páscoa. Cada estação tem um sentido, e o tempo deixa de ser apenas o que passa para se tornar o lugar onde algo acontece.",
        "## Uma janela para o que não passa",
        "Boécio definiu a eternidade como a posse total, simultânea e perfeita de uma vida sem fim. Nós não a possuímos; apenas a vislumbramos. Mas a liturgia é justamente esse vislumbre: no altar, o sacrifício único do Calvário se torna presente, e o tempo, por um instante, se abre para aquilo que não passa.",
        "Talvez seja essa a resposta possível à pergunta de Agostinho. Não sabemos dizer o que é o tempo, mas podemos aprender a vivê-lo de modo que ele nos conduza para além de si.",
      ),
    },
    {
      _id: "ex-artigo-3",
      titulo: "A beleza que salva",
      slug: "a-beleza-que-salva",
      data: somarDias(hoje, -18),
      tema: "liturgia",
      resumo:
        "\"A beleza salvará o mundo\", diz um personagem de Dostoiévski. Mas que beleza? Uma reflexão sobre a forma como caminho para a verdade.",
      imagemLocal: beleza,
      imagemAlt: "O anjo Gabriel ajoelhado diante da Virgem Maria, sob um pórtico de arcos azuis",
      imagemCredito: "Fra Angelico, A Anunciação (c. 1426). Museu do Prado.",
      exemplo: true,
      corpo: corpo(
        "Em O Idiota, alguém atribui ao príncipe Míchkin a frase que se tornaria célebre: a beleza salvará o mundo. A frase é citada com frequência, quase sempre como um consolo vago. Raramente se pergunta de que beleza se trata.",
        "## O que agrada ao ser visto",
        "Santo Tomás de Aquino chamou belo àquilo que agrada ao ser visto. A definição parece modesta, mas não é. O belo agrada não porque satisfaz um desejo nosso, e sim porque nos tira de nós: diante dele, esquecemos por um momento a utilidade e o interesse, e simplesmente contemplamos.",
        "Por isso a beleza é uma espécie de prova. Ela mostra que o real não é apenas matéria disponível ao nosso uso, mas algo que tem forma, ordem e sentido, e que merece ser recebido antes de ser transformado.",
        "## Forma e verdade",
        "Os antigos falavam do verdadeiro, do bom e do belo como faces de uma mesma realidade. Uma época que separa essas três coisas acaba por perder as três: a verdade vira opinião, o bem vira preferência, e a beleza, gosto pessoal.",
        "A liturgia tradicional nunca aceitou essa separação. A dignidade dos paramentos, a precisão dos gestos, o canto que não se apressa: nada disso é ornamento. É a forma visível de uma verdade invisível, oferecida a Deus antes de ser oferecida a nós.",
        "> Tarde te amei, ó beleza tão antiga e tão nova, tarde te amei.",
        "Agostinho não falava de uma obra de arte, mas de Deus. Talvez seja essa a chave da frase de Dostoiévski: a beleza que salva não é a que decoramos, mas a que nos atrai para além de nós mesmos.",
      ),
    },
  ];
}

export function noticiasExemplo(hoje: string): Publicacao[] {
  return [
    {
      _id: "ex-noticia-1",
      titulo: "Missa cantada reúne fiéis no último domingo",
      slug: "missa-cantada-reune-fieis",
      data: somarDias(hoje, -6),
      resumo: "A capela ficou cheia para a Missa das 10h, seguida de bênção.",
      imagemLocal: capa,
      imagemAlt: "Padre em oração diante do altar, com paramentos brancos bordados a ouro",
      exemplo: true,
      corpo: corpo(
        "A Missa cantada das 10h reuniu famílias de toda a cidade. Depois da Missa, houve bênção e um momento de convivência no salão.",
        "Agradecemos a todos que ajudaram na preparação do altar e no canto.",
      ),
    },
    {
      _id: "ex-noticia-2",
      titulo: "Peregrinação a Aparecida",
      slug: "peregrinacao-a-aparecida",
      data: somarDias(hoje, -13),
      resumo: "Famílias do apostolado foram em peregrinação ao Santuário Nacional de Nossa Senhora Aparecida.",
      imagemLocal: peregrinacao,
      imagemAlt: "Grande grupo de peregrinos, com famílias, crianças e estandartes, reunido nas escadarias do Santuário de Aparecida",
      exemplo: true,
      corpo: corpo(
        "Famílias do apostolado de Curitiba se uniram à peregrinação ao Santuário Nacional de Nossa Senhora Aparecida, com estandartes, cânticos e o terço rezado pelo caminho.",
        "Aos pés da Padroeira do Brasil, os peregrinos confiaram a ela as intenções do apostolado e de suas famílias.",
      ),
    },
  ];
}
