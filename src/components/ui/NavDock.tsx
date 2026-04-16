"use client";

import { useRef, useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getLenis } from "@/lib/lenis";
import {
  Home,
  User,
  FolderOpen,
  Wrench,
  Trophy,
  Heart,
  Mail,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "hero", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "projects", label: "Projects", Icon: FolderOpen },
  { id: "skills", label: "Skills", Icon: Wrench },
  { id: "hackathons", label: "Hackathons", Icon: Trophy },
  { id: "why-me", label: "Why Me", Icon: Heart },
  { id: "contact", label: "Contact", Icon: Mail },
];

export default function NavDock() {
  const activeSection = useActiveSection();
  const dockRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getScale = (index: number): number => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.15;
    if (distance === 2) return 1.05;
    return 1;
  };

  const scrollTo = (id: string) => {
    const lenis = getLenis();
    const target = document.getElementById(id);
    if (lenis && target) {
      lenis.scrollTo(target, { offset: 0 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={dockRef}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex items-end gap-1 px-4 py-2 rounded-2xl"
      style={{
        backgroundColor: "rgba(44, 44, 44, 0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--color-border)",
      }}
    >
      {NAV_ITEMS.map((item, index) => {
        const isActive = activeSection === item.id;
        const scale = getScale(index);

        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative flex flex-col items-center gap-1 px-2 py-1 transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "bottom center",
            }}
            aria-label={item.label}
            data-hover
          >
            <item.Icon
              size={20}
              className="transition-colors duration-200"
              style={{
                color: isActive
                  ? "var(--color-accent)"
                  : "var(--color-text-secondary)",
              }}
            />
            <span
              className="text-[10px] font-body hidden md:block transition-colors duration-200"
              style={{
                color: isActive
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
              }}
            >
              {item.label}
            </span>
            {/* Active indicator dot */}
            {isActive && (
              <div
                className="absolute -bottom-1 w-1 h-1 rounded-full"
                style={{
                  backgroundColor: "var(--color-accent)",
                  boxShadow: "0 0 6px var(--color-accent)",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
