import type { TextBlock as TextBlockType } from "@/types/Project";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import Image from "next/image";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  return (
    <section className="p-48 flex gap-10 justify-between items-center">
      <div className="flex flex-col gap-2">
        {block.label && (
          <ul className="list-disc ml-4 text-xl text-primary-base font-bold">
            <li>{block.label}</li>
          </ul>
        )}
        <div className="flex-1 text-5xl font-normal leading-snug text-grey-light max-w-4xl prose-strong:font-bold">
          <RichText
            data={block.content as SerializedEditorState}
            converters={jsxConverters}
          />
        </div>
      </div>
      {block.image?.url && (
        <div className="shrink-0 relative w-96 h-96">
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
