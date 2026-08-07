"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  wrapperStyle?: React.CSSProperties;
  wrapperClassName?: string;
  variant?: "default" | "dark";
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    className,
    wrapperStyle,
    wrapperClassName,
    variant = "default",
    ...props
  },
  ref,
) {
  const variantStyles = {
    default: [
      "bg-grey-darkest/30",
      "before:absolute before:inset-0 before:-z-10 before:rounded-[18px] before:p-px before:content-['']",
      "before:bg-[linear-gradient(to_bottom_right,var(--color-grey-base),var(--color-grey-dark),var(--color-grey-base))]",
      "before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]",
      "before:mask-exclude!",
    ],
    dark: "bg-grey-dark",
  };

  return (
    <div ref={ref} style={wrapperStyle} className={twMerge(wrapperClassName)}>
      <div
        {...props}
        className={twMerge(
          "relative isolate backdrop-blur-sm rounded-[18px]",
          variantStyles[variant],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});

export default Card;
