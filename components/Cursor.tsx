import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

export interface CursorProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function Cursor({ title, ...props }: CursorProps) {
  return (
    <div {...props} className={twMerge("relative", props.className)}>
      <div className="absolute top-0 left-0 w-3.5 h-3.5">
        <Image src="/Cursor.svg" alt="Cursor" width={14} height={14} />
      </div>
      <p className="absolute top-2.5 left-3 bg-primary-base text-grey-darkest text-xs text-nowrap p-1">
        {title}
      </p>
    </div>
  );
}
