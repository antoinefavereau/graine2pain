import { twMerge } from "tailwind-merge";

export interface FigmaEditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function FigmaEditCard({
  children,
  ...props
}: FigmaEditCardProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "relative border-2 border-secondary-base",
        props.className,
      )}
    >
      <div className="absolute top-[-5px] left-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
      <div className="absolute top-[-5px] right-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
      <div className="absolute bottom-[-5px] left-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
      <div className="absolute bottom-[-5px] right-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
      {children}
    </div>
  );
}
