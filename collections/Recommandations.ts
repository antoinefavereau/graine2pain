import { CollectionConfig } from "payload";

export const Recommandations: CollectionConfig = {
  slug: "recommandations",
  fields: [
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "nom",
      type: "text",
    },
    {
      name: "fonction",
      type: "text",
    },
    {
      name: "message",
      type: "text",
    },
    {
      name: "contenu",
      type: "richText",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
  ],
};
