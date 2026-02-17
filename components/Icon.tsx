import { twMerge } from "tailwind-merge";

export interface IconProps extends React.ComponentProps<"span"> {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  return (
    <span
      {...props}
      className={twMerge("material-symbols-outlined text-xl!", props.className)}
    >
      {name}
    </span>
  );
}
