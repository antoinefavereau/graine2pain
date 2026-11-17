"use client";

import React, { useState } from "react";
import { Button, useDocumentInfo, toast } from "@payloadcms/ui";
import { useRouter } from "next/navigation";

export const TranslateButton: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Ne pas afficher si le document n'a pas encore été sauvegardé (pas d'ID)
  if (!id) {
    return null;
  }

  const handleTranslate = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      "Générer la traduction anglaise via l'IA ?\n\nCela traduira les textes du document en français et mettra à jour la version anglaise.",
    );
    if (!confirmed) return;

    setLoading(true);
    toast.info("⏳ Traduction IA en cours via Gemini, veuillez patienter...");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: collectionSlug,
          id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la traduction.");
      }

      toast.success(
        "✨ Version anglaise générée avec succès ! Basculez sur 'English' pour la vérifier.",
      );
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Impossible de traduire le document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginRight: "8px", display: "inline-flex" }}>
      <Button
        buttonStyle="secondary"
        size="small"
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "Traduction en cours..." : "✨ Traduire en anglais"}
      </Button>
    </div>
  );
};
