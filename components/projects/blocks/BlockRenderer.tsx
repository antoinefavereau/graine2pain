import type { ProjectBlock } from "@/types/Project";

import TextBlock from "@/components/projects/blocks/TextBlock";
import SplitStatsBlock from "@/components/projects/blocks/SplitStatsBlock";
import SplitMediaBlock from "@/components/projects/blocks/SplitMediaBlock";

interface BlockRendererProps {
  block: ProjectBlock;
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.blockType) {
    case "textBlock":
      return <TextBlock block={block} />;
    case "splitStatsBlock":
      return <SplitStatsBlock block={block} />;
    case "splitMediaBlock":
      return <SplitMediaBlock block={block} />;
    default:
      return null;
  }
}
