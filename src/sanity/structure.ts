import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Instituto Bom Pastor – Curitiba")
    .items([
      S.documentTypeListItem("semana").title("Programação semanal"),
      S.documentTypeListItem("aviso").title("Avisos"),
      S.divider(),
      S.documentTypeListItem("noticia").title("Notícias"),
      S.documentTypeListItem("artigo").title("Artigos"),
      S.divider(),
      S.documentTypeListItem("horarioPadrao").title("Horários padrão"),
      S.documentTypeListItem("local").title("Locais"),
      S.documentTypeListItem("pessoa").title("Padres"),
      S.listItem().title("Sobre").id("sobre").child(S.document().schemaType("sobre").documentId("sobre")),
      S.divider(),
      S.listItem()
        .title("Configurações")
        .id("configuracoes")
        .child(S.document().schemaType("configuracoes").documentId("configuracoes")),
    ]);
