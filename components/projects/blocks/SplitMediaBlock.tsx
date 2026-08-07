import type { SplitMediaBlock as SplitMediaBlockType } from "@/types/Project";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Button from "@/components/Button";
import PhoneFrame from "@/components/PhoneFrame";
import Card from "@/components/Card";
import BlockLabel from "@/components/projects/blocks/BlockLabel";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface SplitMediaBlockProps {
  block: SplitMediaBlockType;
}

export default function SplitMediaBlock({ block }: SplitMediaBlockProps) {
  return (
    <section className="p-4 py-12 md:p-12 lg:p-24 xl:p-40">
      <Card
        className={twMerge(
          "relative gap-8 lg:gap-12 px-4 md:px-12 py-6 md:py-8 lg:py-10 overflow-hidden",
          block.medias &&
            block.medias.length === 2 &&
            "flex flex-col-reverse lg:flex-row items-center",
          block.medias &&
            block.medias.length > 2 &&
            "grid grid-cols-1 md:grid-cols-2",
        )}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-secondary-base/10 to-transparent"></div>
        {block.medias && block.medias.length === 2 && (
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {block.medias.map((item, i) => (
              <div
                key={item.id ?? i}
                className="flex flex-col gap-2 sm:gap-4 items-center"
              >
                {item.image?.url && (
                  <PhoneFrame
                    src={item.image.url}
                    alt={item.image.alt}
                    className="w-auto h-[40vh]"
                  />
                )}
                {item.caption && (
                  <p className="text-sm sm:text-base text-secondary-light text-center">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {block.medias && block.medias.length > 2 && (
          <div className="grid grid-cols-2 gap-4 lg:gap-6 max-md:aspect-square max-md:order-2">
            {block.medias.map((item, i) => (
              <div
                key={item.id ?? i}
                className={twMerge(
                  "relative rounded-2xl sm:rounded-4xl overflow-hidden",
                  block.medias?.length === 3 && i === 0 && "col-span-2",
                )}
              >
                {item.image?.url && (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 flex flex-col gap-2 w-full">
          <BlockLabel color="secondary">{block.label}</BlockLabel>
          <div className="flex-1 flex flex-col gap-4 lg:gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-grey-light">
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
              <div className="text-xs sm:text-sm text-grey-lighter prose-strong:text-grey-lighter prose-strong:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1">
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
                        alt={block.ctaIcon.alt}
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
        </div>
      </Card>
    </section>
  );
}
