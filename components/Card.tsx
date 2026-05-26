"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import RefractiveDiv from "@/components/RefractiveDiv";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { children, className, ...props },
  ref,
) {
  return (
    <div ref={ref}>
      <RefractiveDiv
        {...props}
        className={twMerge(
          "rounded-[20px]",
          // "relative isolate bg-grey-darkest/30 backdrop-blur-sm",
          // "before:absolute before:inset-0 before:-z-10 before:rounded-[20px] before:p-px before:content-['']",
          // "before:bg-[linear-gradient(to_bottom_right,var(--color-grey-base),var(--color-grey-dark),var(--color-grey-base))]",
          // "before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]",
          // "before:mask-exclude!",
          className,
        )}
        refraction={{
          radius: 40,
          blur: 6,
          bezelWidth: 32,
        }}
      >
        {children}
      </RefractiveDiv>
    </div>
  );
});

export default Card;
