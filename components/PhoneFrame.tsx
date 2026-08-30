import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export interface PhoneFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  priority?: boolean;
  children?: React.ReactNode;
  showButtons?: boolean;
  showGlare?: boolean;
}

export default function PhoneFrame({
  src,
  alt = "",
  priority = false,
  children,
  showButtons = true,
  showGlare = true,
  className,
  style,
  ...props
}: PhoneFrameProps) {
  return (
    <div
      {...props}
      className={twMerge("relative shrink-0 select-none", className)}
      style={{
        aspectRatio: "9/19.5",
        containerType: "inline-size",
        ...style,
      }}
    >
      {/* ── Side Hardware Buttons (Scales with CQW) ── */}
      {showButtons && (
        <>
          {/* Action / Mute Button (Left) */}
          <div
            className="absolute left-[-0.8cqw] top-[14%] w-[0.8cqw] h-[5%] bg-linear-to-r from-[#424750] to-[#25282f] rounded-l-[0.3cqw]"
            aria-hidden="true"
          />
          {/* Volume Up Button (Left) */}
          <div
            className="absolute left-[-0.8cqw] top-[21%] w-[0.8cqw] h-[9%] bg-linear-to-r from-[#424750] to-[#25282f] rounded-l-[0.3cqw]"
            aria-hidden="true"
          />
          {/* Volume Down Button (Left) */}
          <div
            className="absolute left-[-0.8cqw] top-[32%] w-[0.8cqw] h-[9%] bg-linear-to-r from-[#424750] to-[#25282f] rounded-l-[0.3cqw]"
            aria-hidden="true"
          />
          {/* Power / Lock Button (Right) */}
          <div
            className="absolute right-[-0.8cqw] top-[24%] w-[0.8cqw] h-[14%] bg-linear-to-l from-[#424750] to-[#25282f] rounded-r-[0.3cqw]"
            aria-hidden="true"
          />
        </>
      )}

      {/* ── Outer Metallic Chassis / Bezel Frame ── */}
      <div className="relative w-full h-full p-[2.8cqw] rounded-[13cqw] bg-linear-to-b from-[#3a3f47] via-[#1d2026] to-[#121417] shadow-[0_2.5cqw_7cqw_-1cqw_rgba(0,0,0,0.85),inset_0_0.3cqw_0.5cqw_rgba(255,255,255,0.25)] border-[0.3cqw] border-white/10 flex flex-col">
        {/* Speaker Slit on the top bezel */}
        <div
          className="absolute top-[1cqw] left-1/2 -translate-x-1/2 w-[16cqw] h-[0.7cqw] bg-[#1a1c22] rounded-[0.4cqw] z-40 opacity-80"
          aria-hidden="true"
        />

        {/* Inner Chassis Bevel Border & Screen Container */}
        <div className="relative w-full h-full rounded-[10.4cqw] overflow-hidden bg-black border-[0.25cqw] border-white/10 flex flex-col justify-between">
          {/* ── Screen Content (Image or Children - 100% visible) ── */}
          <div className="relative w-full h-full overflow-hidden bg-grey-black">
            {src && (
              <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                className="object-cover"
              />
            )}
            {children}
          </div>

          {/* ── Glass Reflection Sheen ── */}
          {showGlare && (
            <div
              className="absolute inset-0 bg-linear-to-tr from-transparent via-white/3 to-white/8 pointer-events-none z-30"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
}
