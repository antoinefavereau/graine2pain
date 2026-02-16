import { CollectionConfig } from "payload";

export const InfoCard: CollectionConfig = {
  slug: "info",
  admin: {
    useAsTitle: "titre",
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
    },
    {
      name: "icone",
      type: "text",
    },
    {
      name: "valeur",
      type: "text",
    },
  ],
};
