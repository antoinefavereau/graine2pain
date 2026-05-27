import { twMerge } from "tailwind-merge";

export interface FigmaEditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showBorder?: boolean;
  showCorners?: boolean;
}

export default function FigmaEditCard({
  children,
  showBorder = true,
  showCorners = true,
  ...props
}: FigmaEditCardProps) {
  return (
    <div
      {...props}
      className={twMerge(
        "relative border-2 py-2",
        showBorder ? "border-secondary-base" : "border-transparent",
        props.className,
      )}
    >
      {showCorners && (
        <>
          <div className="absolute top-[-5px] left-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
          <div className="absolute top-[-5px] right-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
          <div className="absolute bottom-[-5px] left-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
          <div className="absolute bottom-[-5px] right-[-5px] w-[9px] h-[9px] bg-grey-lighter border-2 border-secondary-base"></div>
        </>
      )}
      {children}
    </div>
  );
}
