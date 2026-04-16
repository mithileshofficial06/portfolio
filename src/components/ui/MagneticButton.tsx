"use client";

import { useRef, ReactNode } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
}

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  target,
  rel,
  type = "button",
}: MagneticButtonProps) {
  const magneticRef = useMagneticEffect(0.3);

  const baseClasses = cn(
    "relative inline-flex items-center gap-2 px-6 py-3",
    "font-body text-sm font-medium",
    "border border-border rounded-md",
    "text-text-primary bg-card",
    "hover:border-accent transition-colors duration-300",
    "animate-pulse-glow",
    className
  );

  if (href) {
    return (
      <a
        ref={magneticRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={baseClasses}
        data-hover
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={magneticRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      type={type}
      className={baseClasses}
      data-hover
    >
      {children}
    </button>
  );
}
