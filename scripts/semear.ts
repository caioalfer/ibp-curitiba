/**
 * Carga inicial do painel: locais, horários padrão, padres, "Sobre" e configurações.
 * Rodar uma vez, depois de configurar o .env.local:
 *
 *   npx sanity exec scripts/semear.ts --with-user-token
 *
 * Usa createIfNotExists: não sobrescreve nada que já tenha sido editado no painel.
 */
import { getCliClient } from "sanity/cli";
import { CONFIGURACOES, HORARIOS_PADRAO, LOCAIS, PADRES, SOBRE } from "../src/lib/fallback";

const client = getCliClient({ apiVersion: "2026-10-01" });

const ref = (id: string) => ({ _type: "reference", _ref: id, _key: id });

async function semear() {
  const tx = client.transaction();

  for (const { _id, ...local } of LOCAIS) tx.createIfNotExists({ _id, _type: "local", ...local });

  HORARIOS_PADRAO.forEach((h, i) =>
    tx.createIfNotExists({
      _id: `horario-padrao-${i + 1}`,
      _type: "horarioPadrao",
      dias: h.dias,
      hora: h.hora,
      tipo: h.tipo,
      ...(h.titulo ? { titulo: h.titulo } : {}),
      ...(h.local ? { local: ref(h.local._id) } : {}),
    }),
  );

  for (const { _id, ...padre } of PADRES) tx.createIfNotExists({ _id, _type: "pessoa", ...padre });

  tx.createIfNotExists({
    _id: "sobre",
    _type: "sobre",
    historia: SOBRE.historia,
    superiorGeral: ref("padre-barrero"),
    paroco: ref("padre-thiago"),
  });

  tx.createIfNotExists({
    _id: "configuracoes",
    _type: "configuracoes",
    ...CONFIGURACOES,
    opcoesAtendimento: CONFIGURACOES.opcoesAtendimento?.map((o, i) => ({ _key: `opcao${i}`, ...o })),
  });

  const resultado = await tx.commit();
  console.log(`Pronto: ${resultado.results.length} documento(s) processado(s).`);
}

semear().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
