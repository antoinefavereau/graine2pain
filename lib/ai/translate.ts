/**
 * Service de traduction IA adapté au portfolio de Product Designer.
 * Utilise l'API Google Gemini (Flash).
 */

// Cache en mémoire pour réutiliser directement le modèle qui fonctionne
// sans réinterroger l'API ListModels de Google à chaque clic.
let cachedWorkingModel: string | null = null;

const SYSTEM_PROMPT = `You are an expert translator specializing in UX/UI design and Product Design portfolios.
Your task is to translate content from French into natural, professional English.

Translation Rules:
1. Translate all French text to fluent, professional English suited for top-tier design agency / tech company portfolios.
2. Maintain standard Product Design & UX terminology (e.g. "User research", "User flow", "Discovery", "Wireframing", "Usability testing", "Design system", "Case study").
3. Preserve the EXACT JSON structure, including all keys, block types ("blockType"), IDs ("id"), URLs, and media IDs.
4. For Lexical RichText JSON structures: only translate the "text" values inside nodes of type "text". Do NOT modify node types, formats, or structure.
5. Return ONLY a valid JSON object matching the input structure, with no markdown code blocks, backticks, or preamble.`;

export async function translateContentWithAI(
  content: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error(
      "Clé GEMINI_API_KEY manquante. Veuillez ajouter GEMINI_API_KEY (gratuit sur Google AI Studio : https://aistudio.google.com/app/apikey) dans votre fichier .env.",
    );
  }

  const prompt = `${SYSTEM_PROMPT}\n\nInput JSON to translate from French to English:\n${JSON.stringify(content, null, 2)}`;

  return translateWithGemini(prompt, geminiApiKey);
}

async function getCandidateGeminiModels(apiKey: string): Promise<string[]> {
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(listUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur vérification clé Gemini (${response.status}): ${errorText}`,
    );
  }

  const data = await response.json();
  const models = (data.models || []) as Array<{
    name: string;
    supportedGenerationMethods?: string[];
  }>;

  const validModels = models.filter((m) =>
    m.supportedGenerationMethods?.includes("generateContent"),
  );

  if (validModels.length === 0) {
    throw new Error(
      "Aucun modèle Gemini supportant 'generateContent' n'a été trouvé pour cette clé.",
    );
  }

  // Priorité : gemini-3.8-flash, puis 3.x, puis 2.0-flash
  const prioritized = [
    ...validModels.filter((m) => m.name.includes("3.8-flash")),
    ...validModels.filter(
      (m) => m.name.includes("3.0-flash") || m.name.includes("3-flash"),
    ),
    ...validModels.filter(
      (m) => m.name.includes("3.") && m.name.includes("flash"),
    ),
    ...validModels.filter(
      (m) =>
        m.name.includes("flash") &&
        !m.name.includes("2.5") &&
        !m.name.includes("1.5"),
    ),
    ...validModels.filter((m) => m.name.includes("flash")),
    ...validModels,
  ];

  return Array.from(new Set(prioritized.map((m) => m.name)));
}

async function executeGeminiRequest(
  modelName: string,
  prompt: string,
  apiKey: string,
  disableThinking: boolean,
): Promise<{ ok: boolean; status: number; text: string; data?: any }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

  const generationConfig: Record<string, unknown> = {
    responseMimeType: "application/json",
    temperature: 0.2,
  };

  // Désactiver la réflexion ("thinking") pour accélérer la génération directe du texte
  if (disableThinking) {
    generationConfig.thinkingConfig = {
      thinkingBudget: 0,
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    return { ok: false, status: response.status, text: responseText };
  }

  try {
    const data = JSON.parse(responseText);
    return { ok: true, status: response.status, text: responseText, data };
  } catch {
    return {
      ok: false,
      status: 500,
      text: "Erreur parsing JSON de l'API Gemini",
    };
  }
}

async function translateWithGemini(
  prompt: string,
  apiKey: string,
): Promise<Record<string, unknown>> {
  // 1. Liste des modèles à tenter : modèle en cache d'abord, puis 3.8-flash par défaut, puis découverte
  const modelsToTry: string[] = [];
  if (cachedWorkingModel) {
    modelsToTry.push(cachedWorkingModel);
  } else {
    modelsToTry.push("models/gemini-3.8-flash");
  }

  let lastError = "";

  // Essayer d'abord les modèles connus / en cache
  for (const modelName of modelsToTry) {
    // Tentative 1 : avec thinkingBudget: 0 pour une vitesse maximale
    let result = await executeGeminiRequest(modelName, prompt, apiKey, true);

    // Si le modèle rejette thinkingConfig (ex: erreur 400), retenter sans thinkingConfig
    if (
      !result.ok &&
      result.status === 400 &&
      result.text.includes("thinkingConfig")
    ) {
      result = await executeGeminiRequest(modelName, prompt, apiKey, false);
    }

    if (result.ok && result.data) {
      const rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        cachedWorkingModel = modelName;
        return parseGeminiJsonResponse(rawText);
      }
    } else {
      lastError = result.text;
    }
  }

  // 2. Si le modèle par défaut ou en cache a échoué, on interroge la liste des modèles disponibles
  const candidateModels = await getCandidateGeminiModels(apiKey);

  for (const modelName of candidateModels) {
    if (modelsToTry.includes(modelName)) continue;

    let result = await executeGeminiRequest(modelName, prompt, apiKey, true);
    if (
      !result.ok &&
      result.status === 400 &&
      result.text.includes("thinkingConfig")
    ) {
      result = await executeGeminiRequest(modelName, prompt, apiKey, false);
    }

    if (result.ok && result.data) {
      const rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        cachedWorkingModel = modelName;
        return parseGeminiJsonResponse(rawText);
      }
    } else {
      lastError = result.text;
    }
  }

  throw new Error(`Erreur Gemini API: ${lastError}`);
}

function parseGeminiJsonResponse(rawText: string): Record<string, unknown> {
  try {
    return JSON.parse(rawText);
  } catch {
    const cleanText = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleanText);
  }
}
