import { twMerge } from "tailwind-merge";

type IconProps = {
  name: string;
  className?: string;
};

export default function Icon({ name, className }: IconProps) {
  return (
    <span className={twMerge("material-symbols-outlined", className)}>
      {name}
    </span>
  );
}
