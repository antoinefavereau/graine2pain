"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

interface StatSegment {
  isNumber: boolean;
  text: string;
  target?: number;
  decimals?: number;
  hasCommaDecimal?: boolean;
  hasSpaceThousand?: boolean;
}

function parseStatValue(raw: string): StatSegment[] {
  if (!raw) return [];

  const regex = /(\d+(?:[\s.,]\d+)*|\d+)/g;
  const segments: StatSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        isNumber: false,
        text: raw.slice(lastIndex, match.index),
      });
    }

    const numStr = match[0];
    let cleanStr = numStr;
    let hasCommaDecimal = false;
    let hasSpaceThousand = numStr.includes(" ");
    let decimals = 0;

    if (numStr.includes(",")) {
      const parts = numStr.split(",");
      if (parts.length === 2 && parts[1].length <= 2) {
        hasCommaDecimal = true;
        decimals = parts[1].length;
        cleanStr = parts[0].replace(/\s/g, "") + "." + parts[1];
      } else {
        cleanStr = numStr.replace(/,/g, "").replace(/\s/g, "");
      }
    } else if (numStr.includes(".")) {
      const parts = numStr.split(".");
      if (parts.length === 2 && parts[1].length <= 2) {
        decimals = parts[1].length;
        cleanStr = parts[0].replace(/\s/g, "") + "." + parts[1];
      } else {
        cleanStr = numStr.replace(/\./g, "").replace(/\s/g, "");
      }
    } else {
      cleanStr = numStr.replace(/\s/g, "");
    }

    const parsed = parseFloat(cleanStr);

    segments.push({
      isNumber: true,
      text: numStr,
      target: isNaN(parsed) ? 0 : parsed,
      decimals,
      hasCommaDecimal,
      hasSpaceThousand,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    segments.push({
      isNumber: false,
      text: raw.slice(lastIndex),
    });
  }

  return segments;
}

function AnimatedStatValue({ value }: { value?: string | null }) {
  const elementRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!elementRef.current || !value) return;

      const segments = parseStatValue(value);
      const targetNumbers = segments.filter((s) => s.isNumber);

      if (targetNumbers.length === 0) {
        elementRef.current.textContent = value;
        return;
      }

      const renderText = (progress: number) => {
        if (!elementRef.current) return;
        const text = segments
          .map((seg) => {
            if (!seg.isNumber || seg.target === undefined) {
              return seg.text;
            }
            const currentNum = seg.target * progress;
            let formatted = currentNum.toFixed(seg.decimals ?? 0);

            if (seg.hasSpaceThousand) {
              const parts = formatted.split(".");
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
              formatted = parts.join(".");
            }

            if (seg.hasCommaDecimal) {
              formatted = formatted.replace(".", ",");
            }
            return formatted;
          })
          .join("");

        elementRef.current.textContent = text;
      };

      renderText(0);

      const st = ScrollTrigger.create({
        trigger: elementRef.current,
        scroller: document.body,
        start: "top 85%",
        end: "bottom 70%",
        scrub: 0.5,
        fastScrollEnd: true,
        onUpdate: (self) => {
          renderText(self.progress);
        },
        onLeave: () => {
          renderText(1);
        },
        onLeaveBack: () => {
          renderText(0);
        },
        onRefresh: (self) => {
          if (self.progress >= 1) renderText(1);
          else if (self.progress <= 0) renderText(0);
          else renderText(self.progress);
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: elementRef, dependencies: [value] },
  );

  return <span ref={elementRef}>{value}</span>;
}

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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal">
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
            <div className="text-sm text-grey-lighter prose-strong:text-grey-lighter prose-strong:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1">
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
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
            {block.stats.map((stat, i) => (
              <Card
                key={stat.id ?? i}
                className="p-6 pe-8 sm:pe-14 flex flex-col justify-between gap-2 w-full sm:max-w-sm min-h-none sm:min-h-44"
              >
                <BlockLabel size="sm" color="primary-lighter">
                  {stat.label}
                </BlockLabel>
                <p className="text-4xl sm:text-6xl lg:text-7xl font-bold text-primary-dark">
                  <AnimatedStatValue value={stat.value} />
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
