import { defineArrayMember, defineField, defineType } from "sanity";

export const sobre = defineType({
  name: "sobre",
  title: "Sobre",
  type: "document",
  fields: [
    defineField({ name: "historia", title: "História do IBP", type: "textoRico" }),
    defineField({
      name: "superiorGeral",
      title: "Superior Geral do IBP",
      type: "reference",
      to: [{ type: "pessoa" }],
    }),
    defineField({
      name: "prior",
      title: "Prior de Curitiba",
      type: "reference",
      to: [{ type: "pessoa" }],
    }),
  ],
  preview: { prepare: () => ({ title: "Sobre" }) },
});

export const configuracoes = defineType({
  name: "configuracoes",
  title: "Configurações",
  type: "document",
  fields: [
    defineField({
      name: "whatsapp",
      title: "WhatsApp para atendimento",
      type: "string",
      description: "Só números, com DDI e DDD. Ex.: 5541999999999",
      validation: (r) =>
        r.custom((v) => (!v || /^\d{12,13}$/.test(v) ? true : "Use só números, ex.: 5541999999999")),
    }),
    defineField({
      name: "textoBotao",
      title: "Texto do botão de atendimento",
      type: "string",
      initialValue: "Falar com o padre",
    }),
    defineField({
      name: "opcoesAtendimento",
      title: "Opções do atendimento",
      type: "array",
      description: "Cada opção abre o WhatsApp com a mensagem já escrita.",
      of: [
        defineArrayMember({
          name: "opcaoAtendimento",
          type: "object",
          fields: [
            defineField({ name: "rotulo", title: "Opção", type: "string", validation: (r) => r.required() }),
            defineField({ name: "mensagem", title: "Mensagem", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "whatsapp",
              title: "Outro número (opcional)",
              type: "string",
              description: "Se vazio, usa o número principal.",
            }),
          ],
          preview: { select: { title: "rotulo", subtitle: "mensagem" } },
        }),
      ],
    }),
    defineField({
      name: "fotoCapa",
      title: "Foto da página inicial",
      type: "image",
      description: "Foto horizontal da capela ou da Missa, atrás da próxima Missa. Fica escurecida embaixo para o texto ler bem.",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Descrição da imagem", type: "string" })],
    }),
    defineField({ name: "instagram", title: "Instagram", type: "url" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
  ],
  preview: { prepare: () => ({ title: "Configurações" }) },
});
