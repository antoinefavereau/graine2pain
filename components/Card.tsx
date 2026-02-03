import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "relative isolate rounded-3xl",
        "before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:p-px before:content-['']",
        "before:bg-[linear-gradient(to_bottom_right,var(--color-grey-base),var(--color-grey-dark),var(--color-grey-base))]",
        "before:[mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]",
        "before:mask-exclude!",
        props.className,
      )}
    >
      {children}
    </div>
  );
}
