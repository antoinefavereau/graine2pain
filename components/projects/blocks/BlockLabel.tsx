import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BlockLabelProps {
  children?: ReactNode;
  size?: "sm" | "md";
  color?: "primary" | "primary-lighter" | "secondary";
  className?: string;
}

const sizeStyles = {
  sm: "text-sm sm:text-base",
  md: "text-lg md:text-xl",
};

const colorStyles = {
  primary: "text-primary-base",
  "primary-lighter": "text-primary-lighter",
  secondary: "text-secondary-base",
};

export default function BlockLabel({
  children,
  size = "md",
  color = "primary",
  className,
}: BlockLabelProps) {
  if (!children) return null;

  return (
    <ul
      className={twMerge(
        "list-disc ml-4 font-bold",
        sizeStyles[size],
        colorStyles[color],
        className,
      )}
    >
      <li>{children}</li>
    </ul>
  );
}
