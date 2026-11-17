import { CollectionConfig } from "payload";

export const Recommandations: CollectionConfig = {
  slug: "recommandations",
  admin: {
    useAsTitle: "nom",
    components: {
      edit: {
        beforeDocumentControls: [
          "/components/admin/TranslateButton#TranslateButton",
        ],
      },
    },
  },
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
      localized: true,
    },
    {
      name: "message",
      type: "text",
      localized: true,
    },
    {
      name: "contenu",
      type: "richText",
      localized: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
  ],
};
