"use client";

import { ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import {
  JSXConvertersFunction,
  RichText,
} from "@payloadcms/richtext-lexical/react";

gsap.registerPlugin(ScrollTrigger);

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  text: ({ node }) => {
    if (!node.text) return null;

    const parts = node.text.split(/(\s+)/);

    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) {
        return part;
      }
      if (!part) return null;

      const wordNode = { ...node, text: part };
      const defaultTextConverter = defaultConverters?.text;
      const renderedWord =
        typeof defaultTextConverter === "function"
          ? (defaultTextConverter as any)({ node: wordNode })
          : part;

      return (
        <span key={i} className="word inline-block opacity-10">
          {renderedWord}
        </span>
      );
    });
  },
});

export interface ScrollTextRevealProps {
  /** Payload Lexical RichText state */
  content?: SerializedEditorState | null;
  /** Plain text string or React node */
  children?: ReactNode;
  /** Additional wrapper CSS classes */
  className?: string;
  /** Start scroll trigger position (default "top 75%") */
  start?: string;
  /** End scroll trigger position (default "bottom 75%") */
  end?: string;
}

function splitStringToWords(text: string) {
  const parts = text.split(/(\s+)/);
  return parts.map((part, i) => {
    if (/^\s+$/.test(part)) return part;
    if (!part) return null;
    return (
      <span key={i} className="word inline-block opacity-10">
        {part}
      </span>
    );
  });
}

function processChildren(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    return splitStringToWords(children);
  }
  return children;
}

export default function ScrollTextReveal({
  content,
  children,
  className = "",
  start = "top 75%",
  end = "bottom 75%",
}: ScrollTextRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const words = container.current?.querySelectorAll(".word");
      if (!words || words.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          scroller: document.body,
          start,
          end,
          scrub: 1,
        },
      });

      tl.fromTo(
        words,
        { opacity: 0.05 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "circ.out",
          stagger: 0.2,
        },
      );

      ScrollTrigger.refresh();
    },
    { scope: container },
  );

  return (
    <div ref={container} className={className}>
      {content ? (
        <RichText data={content} converters={jsxConverters} />
      ) : (
        processChildren(children)
      )}
    </div>
  );
}
