"use client";

import { useRef, useEffect, useCallback } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getLenis } from "@/lib/lenis";
import { gsap } from "@/lib/gsap";
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

const BASE = 40;
const MAX = 64;
const RANGE = 140;

export default function NavDock() {
  const activeSection = useActiveSection();
  const dockRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLButtonElement[]>([]);
  const tooltipsRef = useRef<HTMLSpanElement[]>([]);
  const iconsRef = useRef<SVGSVGElement[]>([]);
  const rafRef = useRef<number>(0);
  const mouseXRef = useRef(0);
  const isHoveringRef = useRef(false);

  // Entrance
  useEffect(() => {
    if (dockRef.current) {
      gsap.fromTo(dockRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.9 });
    }
  }, []);

  // The core animation loop — runs on rAF, zero React re-renders
  const animate = useCallback(() => {
    const items = itemsRef.current;
    const mx = mouseXRef.current;
    const hovering = isHoveringRef.current;

    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      const tooltip = tooltipsRef.current[i];
      if (!el) continue;

      let size = BASE;
      if (hovering) {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(mx - center);
        if (dist < RANGE) {
          const progress = 1 - dist / RANGE;
          size = BASE + (MAX - BASE) * Math.cos((1 - progress) * Math.PI * 0.5);
        }
      }

      el.style.width = size + "px";
      el.style.height = size + "px";

      // Icon size
      const icon = iconsRef.current[i];
      if (icon) {
        const iSize = Math.round(size * 0.45);
        icon.style.width = iSize + "px";
        icon.style.height = iSize + "px";
      }

      // Tooltip
      if (tooltip) {
        const show = size > BASE + 10;
        tooltip.style.opacity = show ? "1" : "0";
        tooltip.style.transform = show ? "translateY(0) scale(1)" : "translateY(4px) scale(0.9)";
        tooltip.style.bottom = (size + 8) + "px";
      }
    }

    if (isHoveringRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseXRef.current = e.clientX;
    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false;
    cancelAnimationFrame(rafRef.current);
    // Animate back to base
    for (let i = 0; i < itemsRef.current.length; i++) {
      const el = itemsRef.current[i];
      const tooltip = tooltipsRef.current[i];
      const icon = iconsRef.current[i];
      if (el) { el.style.width = BASE + "px"; el.style.height = BASE + "px"; }
      if (icon) { const s = Math.round(BASE * 0.45); icon.style.width = s + "px"; icon.style.height = s + "px"; }
      if (tooltip) { tooltip.style.opacity = "0"; tooltip.style.transform = "translateY(4px) scale(0.9)"; }
    }
  }, []);

  const scrollTo = (id: string) => {
    const lenis = getLenis();
    const target = document.getElementById(id);
    if (lenis && target) lenis.scrollTo(target, { offset: 0 });
    else if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      ref={dockRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998] flex items-end px-2 py-1.5 rounded-2xl"
      style={{
        backgroundColor: "rgba(20, 20, 20, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        opacity: 0,
        gap: "2px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {NAV_ITEMS.map((item, index) => {
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            ref={(el) => { if (el) itemsRef.current[index] = el; }}
            onClick={() => scrollTo(item.id)}
            className="relative flex flex-col items-center justify-center"
            style={{
              width: BASE + "px",
              height: BASE + "px",
              transition: "width 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
              transformOrigin: "bottom center",
              borderRadius: "12px",
            }}
            aria-label={item.label}
          >
            {/* Tooltip */}
            <span
              ref={(el) => { if (el) tooltipsRef.current[index] = el; }}
              className="absolute font-mono font-medium pointer-events-none whitespace-nowrap rounded-md px-2 py-1"
              style={{
                bottom: BASE + 8 + "px",
                fontSize: "10px",
                color: "#fff",
                backgroundColor: "rgba(30,30,30,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                opacity: 0,
                transform: "translateY(4px) scale(0.9)",
                transition: "opacity 0.12s ease-out, transform 0.12s ease-out",
                letterSpacing: "0.05em",
              }}
            >
              {item.label}
            </span>

            <item.Icon
              ref={(el: SVGSVGElement | null) => { if (el) iconsRef.current[index] = el; }}
              style={{
                width: Math.round(BASE * 0.45) + "px",
                height: Math.round(BASE * 0.45) + "px",
                color: isActive ? "#CCFF00" : "rgba(255,255,255,0.5)",
                transition: "color 0.2s ease-out, width 0.2s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s cubic-bezier(0.25, 1, 0.5, 1)",
                flexShrink: 0,
              }}
            />

            {/* Active dot */}
            {isActive && (
              <div
                className="absolute rounded-full"
                style={{
                  bottom: "2px",
                  width: "4px",
                  height: "4px",
                  backgroundColor: "#CCFF00",
                  boxShadow: "0 0 6px #CCFF00, 0 0 12px rgba(204,255,0,0.3)",
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
