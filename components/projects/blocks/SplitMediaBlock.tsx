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

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface SplitMediaBlockProps {
  block: SplitMediaBlockType;
}

export default function SplitMediaBlock({ block }: SplitMediaBlockProps) {
  return (
    <section className="p-40">
      <Card
        className={twMerge(
          "relative gap-20 px-20 py-10 overflow-hidden",
          block.medias && block.medias.length === 2 && "flex items-center",
          block.medias && block.medias.length > 2 && "grid grid-cols-2",
        )}
      >
        <div className="absolute inset-0 bg-linear-to-tr from-secondary-base/10 to-transparent"></div>
        {block.medias && block.medias.length == 2 && (
          <div className="grid grid-cols-2 gap-6">
            {block.medias.map((item, i) => (
              <div
                key={item.id ?? i}
                className="flex flex-col gap-4 items-center"
              >
                {item.image?.url && (
                  <PhoneFrame
                    src={item.image.url}
                    alt={item.image.alt}
                    className="w-auto h-[60vh]"
                  />
                )}
                {item.caption && (
                  <p className="text-secondary-light text-center">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {block.medias && block.medias.length > 2 && (
          <div className="grid grid-cols-2 gap-6">
            {block.medias.map((item, i) => (
              <div
                key={item.id ?? i}
                className={twMerge(
                  "relative rounded-4xl overflow-hidden",
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

        <div className="flex-1 flex flex-col gap-2">
          {block.label && (
            <ul className="list-disc ml-4 text-xl text-secondary-base font-bold">
              <li>{block.label}</li>
            </ul>
          )}
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
