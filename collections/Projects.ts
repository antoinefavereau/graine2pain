import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
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
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "titleHighlight",
      type: "text",
      label: "Partie colorée du titre (à la fin)",
    },
    {
      name: "subTitle",
      type: "text",
      required: true,
    },
    {
      name: "images",
      type: "array",
      label: "Images du projet — 1 image ou 3 mockups téléphone",
      minRows: 1,
      maxRows: 3,
      validate: (value: unknown[] | null | undefined) => {
        if (!value) return true;
        if (value.length === 1 || value.length === 3) return true;
        return "Le nombre d'images doit être exactement 1 (image libre) ou 3 (mockups téléphone)";
      },
      required: true,
      admin: {
        description:
          "1 image : affichage plein écran. 3 images : affichées dans des mockups téléphone.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "blocks",
      type: "blocks",
      blocks: [
        // ─────────────────────────────────────────
        // TEXT BLOCK — Texte riche seul ou avec image optionnelle
        // Layout : label + paragraphe (bold, underline, italic...) + image optionnelle
        // ─────────────────────────────────────────
        {
          slug: "textBlock",
          labels: { singular: "Texte", plural: "Textes" },
          fields: [
            {
              name: "label",
              type: "text",
              label: "Label (ex: Le Défi)",
            },
            {
              name: "content",
              type: "richText",
              label: "Contenu",
              required: true,
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Image (optionnelle)",
            },
          ],
        },

        // ─────────────────────────────────────────
        // SPLIT STATS BLOCK — Texte gauche + cartes stats droite
        // Layout : label + titre 2 lignes + description + CTA | stat cards
        // ─────────────────────────────────────────
        {
          slug: "splitStatsBlock",
          labels: { singular: "Split Stats", plural: "Split Stats" },
          fields: [
            {
              name: "label",
              type: "text",
              label: "Label (ex: Discovery)",
            },
            {
              name: "title",
              type: "text",
              label: "Titre principal",
              required: true,
            },
            {
              name: "titleHighlight",
              type: "text",
              label: "Partie colorée du titre (à la fin)",
            },
            {
              name: "description",
              type: "richText",
              label: "Description",
            },
            {
              name: "ctaLabel",
              type: "text",
              label: "Texte du lien CTA",
            },
            {
              name: "ctaUrl",
              type: "text",
              label: "URL du lien CTA",
            },
            {
              name: "ctaIcon",
              type: "upload",
              relationTo: "media",
              label: "Icône du lien CTA",
            },
            {
              name: "stats",
              type: "array",
              label: "Cartes de statistiques",
              fields: [
                {
                  name: "label",
                  type: "text",
                  label: "Label (ex: Sondage utilisation Mobile)",
                  required: true,
                },
                {
                  name: "value",
                  type: "text",
                  label: "Valeur (ex: 100%)",
                  required: true,
                },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────
        // SPLIT MEDIA BLOCK — Médias gauche + texte droite
        // Layout : images/mockups | label + titre + description + CTA
        // ─────────────────────────────────────────
        {
          slug: "splitMediaBlock",
          labels: { singular: "Split Médias", plural: "Split Médias" },
          fields: [
            {
              name: "label",
              type: "text",
              label: "Label (ex: Delivery)",
            },
            {
              name: "title",
              type: "text",
              label: "Titre principal",
              required: true,
            },
            {
              name: "titleHighlight",
              type: "text",
              label: "Partie colorée du titre (à la fin)",
            },
            {
              name: "description",
              type: "richText",
              label: "Description (avec bullets si besoin)",
            },
            {
              name: "ctaLabel",
              type: "text",
              label: "Texte du lien CTA",
            },
            {
              name: "ctaUrl",
              type: "text",
              label: "URL du lien CTA",
            },
            {
              name: "ctaIcon",
              type: "upload",
              relationTo: "media",
              label: "Icône du lien CTA",
            },
            {
              name: "medias",
              type: "array",
              label: "Images / Mockups",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
                {
                  name: "caption",
                  type: "text",
                  label: "Légende",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
