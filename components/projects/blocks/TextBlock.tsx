import type { TextBlock as TextBlockType } from "@/types/Project";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import Image from "next/image";

import BlockLabel from "@/components/projects/blocks/BlockLabel";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  return (
    <section className="p-6 py-16 md:p-16 lg:p-28 xl:p-48 flex gap-2 justify-between items-center flex-wrap">
      <div className="flex flex-col flex-1 gap-2">
        <BlockLabel>{block.label}</BlockLabel>
        <div className="flex-1 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-snug text-grey-light min-w-48 max-w-4xl prose-strong:font-bold">
          <RichText
            data={block.content as SerializedEditorState}
            converters={jsxConverters}
          />
        </div>
      </div>
      {block.image?.url && (
        <div className="shrink-0 relative mx-auto mt-4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
          <Image
            src={block.image.url}
            alt={block.image.alt}
            fill
            className="object-contain"
          />
        </div>
      )}
    </section>
  );
}
