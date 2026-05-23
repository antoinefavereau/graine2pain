"use client";

import { HTMLAttributes, ReactNode, useEffect, useState } from "react";

interface RefractiveDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  refraction?: {
    radius?: number;
    blur?: number;
    bezelWidth?: number;
  };
}

export default function RefractiveDiv({
  children,
  ...props
}: Readonly<RefractiveDivProps>) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    import("@hashintel/refractive").then((mod) => {
      setComponent(() => mod.refractive.div);
    });
  }, []);

  if (!Component) {
    return <div {...props}>{children}</div>;
  }

  return <Component {...props}>{children}</Component>;
}
