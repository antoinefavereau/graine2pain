import { CollectionConfig } from "payload";

export const InfoCard: CollectionConfig = {
  slug: "info",
  admin: {
    useAsTitle: "titre",
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
      name: "titre",
      type: "text",
      localized: true,
    },
    {
      name: "icone",
      type: "text",
    },
    {
      name: "valeur",
      type: "text",
      localized: true,
    },
  ],
};
