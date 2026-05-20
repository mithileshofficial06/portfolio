"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-[9999]"
      style={{
        width: `${progress}%`,
        backgroundColor: "var(--color-accent)",
        transition: "width 0.1s linear",
      }}
    />
  );
}
