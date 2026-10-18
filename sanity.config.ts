"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { SINGLETONS, schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  title: "IBP Curitiba",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // "Sobre" e "Configurações" são documentos únicos: não aparecem em "Criar novo".
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (acoes, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? acoes.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : acoes,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
