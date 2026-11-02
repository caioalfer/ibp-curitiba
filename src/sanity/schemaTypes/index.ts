import type { SchemaTypeDefinition } from "sanity";
import { aviso } from "./aviso";
import { horarioPadrao } from "./horarioPadrao";
import { local } from "./local";
import { pessoa } from "./pessoa";
import { artigo, noticia } from "./publicacao";
import { semana } from "./semana";
import { capela, configuracoes, sobre } from "./singletons";
import { textoRico } from "./textoRico";

export const SINGLETONS = ["sobre", "capela", "configuracoes"];

export const schemaTypes: SchemaTypeDefinition[] = [
  semana,
  horarioPadrao,
  local,
  aviso,
  noticia,
  artigo,
  pessoa,
  sobre,
  capela,
  configuracoes,
  textoRico,
];
