"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { twMerge } from "tailwind-merge";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !contentRef.current) return;

      gsap.fromTo(
        contentRef.current,
        {
          y: 80,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: document.body,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <footer
      ref={containerRef}
      className={twMerge("mt-auto overflow-hidden", className)}
    >
      <div
        ref={contentRef}
        className="bg-grey-dark flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 px-6 sm:px-16 md:px-28 py-6 md:py-12 rounded-t-2xl mx-4 will-change-transform"
      >
        {/* Left Column: Contact Information */}
        <div className="flex flex-col gap-.5 text-xs sm:text-sm text-grey-lighter">
          <div>
            <span className="font-bold">E-mail : </span>
            <a
              href="mailto:cheveche.d.athena05@gmail.com"
              className="hover:text-primary-base transition-colors"
            >
              cheveche.d.athena05@gmail.com
            </a>
          </div>
          <div>
            <span className="font-bold">LinkedIn : </span>
            <a
              href="https://www.linkedin.com/in/ath%C3%A9na-moreau-80a397239"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-base transition-colors"
            >
              linkedin.com/in/athéna-moreau-80a397239
            </a>
          </div>
          <div>
            <span className="font-bold">Localisation : </span>
            <span>Paris, France (Ouverte à la mobilité)</span>
          </div>
        </div>

        {/* Right Column: Title & Name */}
        <div className="flex flex-col items-start md:items-end gap-1 md:gap-4">
          <p className="text-xl sm:text-2xl md:text-3xl font-extralight text-grey-light">
            Product Designer{" "}
            <span className="font-normal bg-linear-to-r from-secondary-base to-primary-base bg-clip-text text-transparent">
              UX/UI
            </span>
          </p>
          <p className="font-medium text-grey-base uppercase">MOREAU ATHÉNA</p>
        </div>
      </div>
    </footer>
  );
}
