import { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface AboutHardSkillsProps extends HTMLAttributes<HTMLElement> {}

const AboutHardSkills = forwardRef<HTMLDivElement, AboutHardSkillsProps>(
  function AboutHardSkills({ className, ...props }, ref) {
    return (
      <section
        ref={ref}
        className={twMerge(
          "relative min-h-dvh w-full flex flex-col justify-center items-center z-20 pointer-events-none",
          className,
        )}
        {...props}
      >
        {/* Contenu Hard Skills */}
      </section>
    );
  },
);

export default AboutHardSkills;
