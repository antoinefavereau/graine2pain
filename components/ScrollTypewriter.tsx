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
          <span
            key={i}
            data-char
            className="char-space inline-block whitespace-pre opacity-0"
          >
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
          <span
            key={i}
            data-char
            className="char-space inline-block whitespace-pre opacity-0"
          >
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
  const progressRef = useRef<number | null>(null);

  useGSAP(
    () => {
      if (!container.current || !cursorRef.current) return;

      const charElements =
        container.current.querySelectorAll<HTMLElement>("[data-char]");
      const totalChars = charElements.length;
      const cursor = cursorRef.current;

      if (totalChars === 0) {
        cursor.style.opacity = "0";
        return;
      }

      // Initialize count based on previous progress if already scrolled, or 0 if first mount
      const currentProgress = progressRef.current ?? 0;
      const initialCount =
        currentProgress >= 1
          ? totalChars
          : currentProgress <= 0
            ? 0
            : Math.round(currentProgress * totalChars);

      const proxy = { count: initialCount };

      const updateTypingCount = (count: number) => {
        const currentCount = Math.min(
          totalChars,
          Math.max(0, Math.round(count)),
        );

        charElements.forEach((el, idx) => {
          el.style.opacity = idx < currentCount ? "1" : "0";
        });

        if (!container.current || !cursor) return;

        const containerRect = container.current.getBoundingClientRect();
        if (containerRect.width === 0 && containerRect.height === 0) {
          cursor.style.opacity = "0";
          return;
        }

        const targetEl =
          currentCount > 0
            ? charElements[Math.min(currentCount - 1, totalChars - 1)]
            : charElements[0];

        if (targetEl) {
          const targetRect = targetEl.getBoundingClientRect();
          const atEnd = currentCount > 0;
          const offsetMargin = atEnd ? 2 : 0;
          const x =
            (atEnd ? targetRect.right : targetRect.left) -
            containerRect.left -
            container.current.clientLeft +
            offsetMargin;
          const y =
            targetRect.top - containerRect.top - container.current.clientTop;
          const height = targetRect.height || targetEl.offsetHeight || 24;

          cursor.style.height = `${height}px`;
          cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          cursor.style.opacity = "1";
        }
      };

      // Set initial count
      updateTypingCount(initialCount);

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
          progressRef.current = self.progress;
          animateToTarget(self.progress * totalChars);
        },
        onLeave: () => {
          progressRef.current = 1;
          animateToTarget(totalChars);
        },
        onLeaveBack: () => {
          progressRef.current = 0;
          animateToTarget(0);
        },
        onRefresh: (self) => {
          progressRef.current = self.progress;
          const target =
            self.progress >= 1
              ? totalChars
              : self.progress <= 0
                ? 0
                : self.progress * totalChars;
          proxy.count = target;
          updateTypingCount(target);
        },
      });

      // Synchronize immediately if ScrollTrigger calculated progress
      if (progressRef.current === null) {
        progressRef.current = st.progress;
        const target =
          st.progress >= 1
            ? totalChars
            : st.progress <= 0
              ? 0
              : st.progress * totalChars;
        proxy.count = target;
        updateTypingCount(target);
      }

      const handleResize = () => {
        updateTypingCount(proxy.count);
      };
      window.addEventListener("resize", handleResize);

      ScrollTrigger.refresh();

      return () => {
        st.kill();
        gsap.killTweensOf(proxy);
        window.removeEventListener("resize", handleResize);
      };
    },
    {
      scope: container,
      dependencies: [
        children,
        content,
        start,
        end,
        charsPerSecond,
        eraseCharsPerSecond,
      ],
    },
  );

  return (
    <div ref={container} className={`relative ${className}`}>
      {content ? (
        <RichText data={content} converters={jsxConverters} />
      ) : (
        processChildren(children)
      )}
      <span
        ref={cursorRef}
        aria-hidden="true"
        className="absolute top-0 left-0 w-0.5 bg-current pointer-events-none animate-[blink_1.5s_steps(2)_infinite]"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
