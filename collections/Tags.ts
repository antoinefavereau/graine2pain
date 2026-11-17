import { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
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
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
  ],
};
