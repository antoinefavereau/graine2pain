import Image from "next/image";
import { twMerge } from "tailwind-merge";

export interface PhoneFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  priority?: boolean;
}

export default function PhoneFrame({
  src,
  alt = "",
  priority = false,
  className,
  style,
  ...props
}: PhoneFrameProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "relative shrink-0 rounded-xl overflow-hidden border-2 border-grey-darkest",
        className,
      )}
      style={{
        aspectRatio: "9/19.5",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
