import { defineField, defineType } from "sanity";

export const pessoa = defineType({
  name: "pessoa",
  title: "Padre",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      description: "Como deve aparecer no site. Ex.: Pe. Thiago Bonifácio",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cargo",
      title: "Cargo",
      type: "string",
      description: "Ex.: Superior Geral do Instituto Bom Pastor",
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "bio", title: "Biografia", type: "textoRico" }),
  ],
  preview: { select: { title: "nome", subtitle: "cargo", media: "foto" } },
});
