import { twMerge } from "tailwind-merge";
import Link from "next/link";

export type ButtonProps = (
  | React.ButtonHTMLAttributes<HTMLButtonElement>
  | React.AnchorHTMLAttributes<HTMLAnchorElement>
) & {
  variant?: "solid" | "outline" | "text";
  color?: "primary" | "secondary" | "grey" | "info" | "warning" | "error";
  active?: boolean;
  children: React.ReactNode;
};

export default function Button({
  variant = "solid",
  color = "primary",
  active = false,
  children,
  ...props
}: ButtonProps) {
  const styles = {
    solid: {
      primary: {
        base: "bg-primary-base hover:bg-primary-dark text-grey-darkest",
        active: "bg-primary-light",
      },
      secondary: {
        base: "bg-secondary-base hover:bg-secondary-dark text-grey-darkest",
        active: "bg-secondary-light",
      },
      grey: {
        base: "bg-grey-base hover:bg-grey-dark text-grey-lighter",
        active: "bg-grey-light",
      },
      info: {
        base: "bg-info-base hover:bg-info-dark text-grey-darkest",
        active: "bg-info-light",
      },
      warning: {
        base: "bg-warning-base hover:bg-warning-dark text-grey-darkest",
        active: "bg-warning-light",
      },
      error: {
        base: "bg-error-base hover:bg-error-dark text-grey-darkest",
        active: "bg-error-light",
      },
    },
    outline: {
      primary: {
        base: "border border-primary-base hover:border-primary-light text-primary-base hover:text-primary-light",
        active: "bg-primary-lighter text-primary-lighter",
      },
      secondary: {
        base: "border border-secondary-base hover:border-secondary-light text-secondary-base hover:text-secondary-light",
        active: "bg-secondary-lighter text-secondary-lighter",
      },
      grey: {
        base: "border border-grey-base hover:border-grey-light text-grey-base hover:text-grey-light",
        active: "bg-grey-lighter text-grey-lighter",
      },
      info: {
        base: "border border-info-base hover:border-info-light text-info-base hover:text-info-light",
        active: "bg-info-lighter text-info-lighter",
      },
      warning: {
        base: "border border-warning-base hover:border-warning-light text-warning-base hover:text-warning-light",
        active: "bg-warning-lighter text-warning-lighter",
      },
      error: {
        base: "border border-error-base hover:border-error-light text-error-base hover:text-error-light",
        active: "bg-error-lighter text-error-lighter",
      },
    },
    text: {
      primary: {
        base: "bg-transparent border border-transparent hover:border-primary-black text-grey-lighter hover:text-primary-base",
        active: "bg-primary-black text-primary-base",
      },
      secondary: {
        base: "bg-transparent border border-transparent hover:border-secondary-darker text-grey-lighter hover:text-secondary-base",
        active: "bg-secondary-black text-secondary-base",
      },
      grey: {
        base: "bg-transparent border border-transparent hover:border-grey-dark text-grey-lighter hover:text-grey-base",
        active: "bg-grey-black text-grey-base",
      },
      info: {
        base: "bg-transparent border border-transparent hover:border-info-darker text-grey-lighter hover:text-info-base",
        active: "bg-info-black text-info-base",
      },
      warning: {
        base: "bg-transparent border border-transparent hover:border-warning-darker text-grey-lighter hover:text-warning-base",
        active: "bg-warning-black text-warning-base",
      },
      error: {
        base: "bg-transparent border border-transparent hover:border-error-darker text-grey-lighter hover:text-error-base",
        active: "bg-error-black text-error-base",
      },
    },
  };

  const selectedStyle = styles[variant][color];
  const Component = "href" in props ? Link : "button";

  return (
    <Component
      {...(props as any)}
      className={twMerge(
        "flex items-center gap-2 px-4 py-2 rounded-3xl font-bold transition-colors duration-200",
        selectedStyle.base,
        active && selectedStyle.active,
        props.className,
      )}
    >
      {children}
    </Component>
  );
}
