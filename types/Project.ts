import { Media } from "@/payload-types";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

// ─────────────────────────────────────────
// Block types
// ─────────────────────────────────────────

export interface MediaItem {
  image: Media;
  caption?: string;
  id?: string;
}

export interface StatItem {
  label: string;
  value: string;
  id?: string;
}

export interface TextBlock {
  blockType: "textBlock";
  id?: string;
  label?: string;
  content: SerializedEditorState; // Lexical rich text
  image?: Media;
}

export interface SplitStatsBlock {
  blockType: "splitStatsBlock";
  id?: string;
  label?: string;
  title: string;
  titleHighlight?: string;
  description?: SerializedEditorState; // Lexical rich text
  ctaLabel?: string;
  ctaUrl?: string;
  ctaIcon?: Media;
  stats?: StatItem[];
}

export interface SplitMediaBlock {
  blockType: "splitMediaBlock";
  id?: string;
  label?: string;
  title: string;
  titleHighlight?: string;
  description?: SerializedEditorState; // Lexical rich text
  ctaLabel?: string;
  ctaUrl?: string;
  ctaIcon?: Media;
  medias?: MediaItem[];
}

export type ProjectBlock = TextBlock | SplitStatsBlock | SplitMediaBlock;

// ─────────────────────────────────────────
// Project type
// ─────────────────────────────────────────

export interface Project {
  id: string;
  order: number;
  title: string;
  titleHighlight?: string;
  subTitle: string;
  images: { image: Media; id?: string }[];
  blocks?: ProjectBlock[];
}
