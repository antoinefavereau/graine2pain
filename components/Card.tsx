import { twMerge } from "tailwind-merge";
import RefractiveDiv from "@/components/RefractiveDiv";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, ...props }: CardProps) {
  return (
    <RefractiveDiv
      {...props}
      className={twMerge(
        "rounded-[20px]",
        // "relative isolate bg-grey-darkest/30 backdrop-blur-sm",
        // "before:absolute before:inset-0 before:-z-10 before:rounded-[20px] before:p-px before:content-['']",
        // "before:bg-[linear-gradient(to_bottom_right,var(--color-grey-base),var(--color-grey-dark),var(--color-grey-base))]",
        // "before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]",
        // "before:mask-exclude!",
        props.className,
      )}
      refraction={{
        radius: 20,
        blur: 2,
        bezelWidth: 16,
      }}
    >
      {children}
    </RefractiveDiv>
  );
}
