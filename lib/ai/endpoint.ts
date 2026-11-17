import type { PayloadHandler, PayloadRequest } from "payload";
import { translateContentWithAI } from "@/lib/ai/translate";

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
      toTranslate = {
        title: doc.title,
        titleHighlight: doc.titleHighlight,
        subTitle: doc.subTitle,
        blocks: doc.blocks,
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
