import Image from "next/image";
import Button from "@/components/Button";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import type { SplitStatsBlock as SplitStatsBlockType } from "@/types/Project";
import Card from "@/components/Card";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface SplitStatsBlockProps {
  block: SplitStatsBlockType;
}

export default function SplitStatsBlock({ block }: SplitStatsBlockProps) {
  return (
    <section className="p-40 flex flex-col gap-4">
      {block.label && (
        <ul className="list-disc ml-4 text-xl text-primary-base font-bold">
          <li>{block.label}</li>
        </ul>
      )}
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        {/* Left — Text content */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-6xl lg:text-5xl font-normal">
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
            <div className="self-start">
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
          <div className="flex gap-10">
            {block.stats.map((stat, i) => (
              <Card
                key={stat.id ?? i}
                className="p-6 pe-14 flex flex-col justify-between gap-2 max-w-sm min-h-56"
              >
                <ul className="list-disc ml-4 text-primary-lighter font-bold">
                  <li>{stat.label}</li>
                </ul>
                <p className="text-8xl font-bold text-primary-dark">
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
