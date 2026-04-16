"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = initLenis();

    return () => {
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
