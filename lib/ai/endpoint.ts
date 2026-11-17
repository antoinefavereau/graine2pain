import type { PayloadHandler, PayloadRequest } from "payload";
import { translateContentWithAI } from "@/lib/ai/translate";

function cleanProjectBlocks(
  translatedBlocks: any[],
  originalBlocks: any[],
): any[] {
  if (!Array.isArray(translatedBlocks)) return [];

  return translatedBlocks.map((block, index) => {
    const original = Array.isArray(originalBlocks)
      ? originalBlocks[index] || {}
      : {};
    // Supprimer l'ID pour que Payload génère un nouvel ID propre pour la locale 'en'
    const { id, _id, ...cleanBlock } = block || {};

    // Préserver les médias / relations du bloc original si Gemini ne les a pas renvoyés
    if (original.image && !cleanBlock.image) {
      cleanBlock.image = original.image;
    }
    if (original.ctaIcon && !cleanBlock.ctaIcon) {
      cleanBlock.ctaIcon = original.ctaIcon;
    }
    if (original.ctaUrl && !cleanBlock.ctaUrl) {
      cleanBlock.ctaUrl = original.ctaUrl;
    }

    // Nettoyer les sous-tableaux (stats, medias) de leurs anciens IDs
    if (Array.isArray(cleanBlock.stats)) {
      cleanBlock.stats = cleanBlock.stats.map((stat: any) => {
        const { id: sId, _id: s_id, ...cleanStat } = stat || {};
        return cleanStat;
      });
    }

    if (Array.isArray(cleanBlock.medias)) {
      cleanBlock.medias = cleanBlock.medias.map((media: any, mIdx: number) => {
        const origMedia = Array.isArray(original.medias)
          ? original.medias[mIdx] || {}
          : {};
        const { id: mId, _id: m_id, ...cleanMedia } = media || {};
        if (origMedia.image && !cleanMedia.image) {
          cleanMedia.image = origMedia.image;
        }
        return cleanMedia;
      });
    }

    return cleanBlock;
  });
}

export const translateEndpointHandler: PayloadHandler = async (
  req: PayloadRequest,
): Promise<Response> => {
  if (!req.user) {
    return Response.json(
      { error: "Non autorisé. Veuillez vous connecter." },
      { status: 401 },
    );
  }

  try {
    const body = ((await req.json?.().catch(() => ({}))) || {}) as {
      collection?: string;
      id?: string | number;
    };

    const { collection, id } = body;
    if (!collection || !id) {
      return Response.json(
        { error: "Paramètres 'collection' et 'id' manquants." },
        { status: 400 },
      );
    }

    // 1. Récupérer le document en français (depth: 0 conserve les IDs purs des médias)
    const doc = (await req.payload.findByID({
      collection: collection as any,
      id,
      locale: "fr",
      depth: 0,
      user: req.user,
    })) as Record<string, unknown>;

    if (!doc) {
      return Response.json(
        { error: "Document introuvable en français." },
        { status: 404 },
      );
    }

    // 2. Extraire uniquement les champs traduisibles selon la collection
    let toTranslate: Record<string, unknown> = {};

    if (collection === "projects") {
      // Retirer les IDs avant d'envoyer à Gemini pour alléger le prompt
      const cleanBlocks = Array.isArray(doc.blocks)
        ? doc.blocks.map((b: any) => {
            const { id: bId, _id: b_id, ...rest } = b || {};
            return rest;
          })
        : [];

      toTranslate = {
        title: doc.title,
        titleHighlight: doc.titleHighlight,
        subTitle: doc.subTitle,
        blocks: cleanBlocks,
      };
    } else if (collection === "info") {
      toTranslate = {
        titre: doc.titre,
        valeur: doc.valeur,
      };
    } else if (collection === "tags") {
      toTranslate = {
        name: doc.name,
      };
    } else if (collection === "recommandations") {
      toTranslate = {
        fonction: doc.fonction,
        message: doc.message,
        contenu: doc.contenu,
      };
    } else {
      return Response.json(
        {
          error: `Collection non prise en charge pour la traduction: ${collection}`,
        },
        { status: 400 },
      );
    }

    // 3. Traduction par IA
    const translatedData = await translateContentWithAI(toTranslate);

    // Supprimer les IDs racine que l'IA pourrait renvoyer par erreur
    delete (translatedData as any).id;
    delete (translatedData as any)._id;

    if (collection === "projects" && Array.isArray(translatedData.blocks)) {
      translatedData.blocks = cleanProjectBlocks(
        translatedData.blocks,
        doc.blocks as any[],
      );
    }

    // 4. Mise à jour de la version anglaise du document
    const updated = await req.payload.update({
      collection: collection as any,
      id,
      locale: "en",
      data: translatedData,
      depth: 0,
      user: req.user,
    });

    return Response.json({
      success: true,
      message: "Version anglaise générée avec succès.",
      doc: updated,
    });
  } catch (error: any) {
    console.error("[translate-endpoint] Erreur:", error);
    return Response.json(
      { error: error.message || "Erreur lors de la traduction IA." },
      { status: 500 },
    );
  }
};
