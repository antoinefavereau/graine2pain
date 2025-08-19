"use client";

import { useDirectionalTransitions } from "@/hooks/use-directional-transitions";

interface DirectionalTransitionsProviderProps {
  children: React.ReactNode;
}

export default function DirectionalTransitionsProvider({
  children,
}: DirectionalTransitionsProviderProps) {
  useDirectionalTransitions();

  return <>{children}</>;
}
