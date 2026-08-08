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
    const defaultTextConverter = defaultConverters?.text;

    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) {
        return (
          <span key={i} data-char className="char-space opacity-0">
            {part}
          </span>
        );
      }
      if (!part) return null;

      const chars = part.split("");
      return (
        <span key={i} className="word inline-block">
          {chars.map((char, j) => {
            const charNode = { ...node, text: char };
            const renderedChar =
              typeof defaultTextConverter === "function"
                ? (defaultTextConverter as any)({ node: charNode })
                : char;
            return (
              <span key={j} data-char className="char inline-block opacity-0">
                {renderedChar}
              </span>
            );
          })}
        </span>
      );
    });
  },
});

function processChildren(children: ReactNode): ReactNode {
  if (typeof children === "string") {
    const parts = children.split(/(\s+)/);
    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) {
        return (
          <span key={i} data-char className="char-space opacity-0">
            {part}
          </span>
        );
      }
      if (!part) return null;

      const chars = part.split("");
      return (
        <span key={i} className="word inline-block">
          {chars.map((char, j) => (
            <span key={j} data-char className="char inline-block opacity-0">
              {char}
            </span>
          ))}
        </span>
      );
    });
  }
  return children;
}

export interface ScrollTypewriterProps {
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
  /** Maximum typing speed in characters per second (default 100) */
  charsPerSecond?: number;
  /** Maximum erasing speed in characters per second (default 200) */
  eraseCharsPerSecond?: number;
}

export default function ScrollTypewriter({
  content,
  children,
  className = "",
  start = "top 75%",
  end = "bottom 75%",
  charsPerSecond = 100,
  eraseCharsPerSecond = 200,
}: ScrollTypewriterProps) {
  const container = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!container.current || !cursorRef.current) return;

      const charElements =
        container.current.querySelectorAll<HTMLElement>("[data-char]");
      const totalChars = charElements.length;
      if (totalChars === 0) return;

      const cursor = cursorRef.current;
      const proxy = { count: 0 };

      const updateTypingCount = (count: number) => {
        const currentCount = Math.min(
          totalChars,
          Math.max(0, Math.round(count)),
        );

        charElements.forEach((el, idx) => {
          el.style.opacity = idx < currentCount ? "1" : "0";
        });

        if (currentCount > 0 && charElements[currentCount - 1]) {
          charElements[currentCount - 1].after(cursor);
        } else if (charElements[0]) {
          charElements[0].before(cursor);
        }
      };

      // Set initial state
      updateTypingCount(0);

      const animateToTarget = (target: number) => {
        const targetCount = Math.min(
          totalChars,
          Math.max(0, Math.round(target)),
        );
        const distance = Math.abs(targetCount - proxy.count);
        if (distance === 0) return;

        const isErasing = targetCount < proxy.count;
        const speed = isErasing ? eraseCharsPerSecond : charsPerSecond;
        const duration = Math.max(0.02, distance / speed);

        gsap.to(proxy, {
          count: targetCount,
          duration,
          ease: "none",
          overwrite: "auto",
          onUpdate: () => {
            updateTypingCount(proxy.count);
          },
        });
      };

      const st = ScrollTrigger.create({
        trigger: container.current,
        scroller: document.body,
        start,
        end,
        onUpdate: (self) => {
          animateToTarget(self.progress * totalChars);
        },
        onLeave: () => {
          animateToTarget(totalChars);
        },
        onLeaveBack: () => {
          animateToTarget(0);
        },
        onRefresh: (self) => {
          if (self.progress >= 1) {
            animateToTarget(totalChars);
          } else if (self.progress <= 0) {
            animateToTarget(0);
          } else {
            animateToTarget(self.progress * totalChars);
          }
        },
      });

      ScrollTrigger.refresh();

      return () => {
        st.kill();
        gsap.killTweensOf(proxy);
      };
    },
    {
      scope: container,
      dependencies: [start, end, charsPerSecond, eraseCharsPerSecond],
    },
  );

  return (
    <div ref={container} className={className}>
      {content ? (
        <RichText data={content} converters={jsxConverters} />
      ) : (
        processChildren(children)
      )}
      <span
        ref={cursorRef}
        aria-hidden="true"
        className="w-0.5 h-[1em] bg-current inline-block ms-0.5 align-middle pointer-events-none animate-[blink_1.5s_steps(2)_infinite]"
      />
    </div>
  );
}
