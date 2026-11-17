"use client";

import React, { useRef, useState } from "react";
import { Button, useDocumentInfo, toast } from "@payloadcms/ui";
import { useRouter } from "next/navigation";

export const TranslateButton: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isCancelledRef = useRef<boolean>(false);
  const toastIdRef = useRef<string | number | null>(null);

  // Ne pas afficher si le document n'a pas encore été sauvegardé (pas d'ID)
  if (!id) {
    return null;
  }

  const handleCancel = () => {
    isCancelledRef.current = true;
    if (toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
    toast.info("Traduction annulée.");
    setLoading(false);
  };

  const handleTranslate = async () => {
    if (loading) return;

    setLoading(true);
    isCancelledRef.current = false;

    const toastId = toast.loading("⏳ Traduction IA en cours via Gemini...", {
      action: {
        label: "Annuler",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          handleCancel();
        },
      },
      duration: Infinity,
    });
    toastIdRef.current = toastId;

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

      if (isCancelledRef.current) return;

      const data = await res.json();

      if (isCancelledRef.current) return;

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la traduction.");
      }

      if (isCancelledRef.current) return;

      // Fermer le toast de chargement avec le bouton Annuler
      toast.dismiss(toastId);
      // Afficher un toast de succès propre (sans bouton Annuler et avec auto-fermeture)
      toast.success(
        "✨ Version anglaise générée avec succès ! Basculez sur 'English' pour la vérifier.",
      );
      router.refresh();
    } catch (err: any) {
      if (isCancelledRef.current) return;

      toast.dismiss(toastId);
      toast.error(err.message || "Impossible de traduire le document.");
    } finally {
      if (!isCancelledRef.current) {
        setLoading(false);
      }
      toastIdRef.current = null;
    }
  };

  return (
    <Button
      buttonStyle="secondary"
      size="small"
      onClick={handleTranslate}
      disabled={loading}
    >
      {loading ? "Traduction en cours..." : "✨ Traduire en anglais"}
    </Button>
  );
};
