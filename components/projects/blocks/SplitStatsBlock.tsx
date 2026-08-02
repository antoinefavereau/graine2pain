import type { SplitStatsBlock as SplitStatsBlockType } from "@/types/Project";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import Image from "next/image";

import Button from "@/components/Button";
import Card from "@/components/Card";
import BlockLabel from "@/components/projects/blocks/BlockLabel";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface SplitStatsBlockProps {
  block: SplitStatsBlockType;
}

export default function SplitStatsBlock({ block }: SplitStatsBlockProps) {
  return (
    <section className="p-4 py-12 md:p-12 lg:p-24 xl:p-40 flex flex-col gap-4">
      <BlockLabel>{block.label}</BlockLabel>
      <div className="flex flex-wrap gap-10 sm:gap-16 items-start">
        {/* Left — Text content */}
        <div className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-full sm:min-w-sm">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal">
            {block.title}
            {block.titleHighlight && (
              <>
                <br />
                <span className="font-bold bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent">
                  {block.titleHighlight}
                </span>
              </>
            )}
          </h2>

          {block.description && (
            <div className="text-grey-lighter prose-strong:text-grey-lighter prose-strong:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1">
              <RichText
                data={block.description as SerializedEditorState}
                converters={jsxConverters}
              />
            </div>
          )}

          {block.ctaLabel && (
            <div className="self-start mt-2">
              <Button
                href={block.ctaUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                color="grey"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {block.ctaIcon?.url && (
                    <Image
                      src={block.ctaIcon.url}
                      alt=""
                      width={16}
                      height={16}
                      className="object-contain rounded-xs"
                    />
                  )}
                </span>
                {block.ctaLabel}
                <span className="material-symbols-outlined text-xl font-semibold">
                  north_east
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Right — Stat cards */}
        {block.stats && block.stats.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-10">
            {block.stats.map((stat, i) => (
              <Card
                key={stat.id ?? i}
                className="p-6 pe-8 sm:pe-14 flex flex-col justify-between gap-2 w-full sm:max-w-sm min-h-none sm:min-h-56"
              >
                <BlockLabel size="sm" color="primary-lighter">
                  {stat.label}
                </BlockLabel>
                <p className="text-5xl sm:text-7xl lg:text-8xl font-bold text-primary-dark">
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
