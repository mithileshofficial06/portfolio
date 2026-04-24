"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/* ─── Row Data ─── */
const ROWS = [
  {
    num: "01",
    title: "Dual Perspective: Developer & Security Thinker",
    desc: "While most developers focus solely on building, I approach every project with both a builder's mindset and a security lens — identifying vulnerabilities before they become problems.",
  },
  {
    num: "02",
    title: "Validated Under Real Conditions",
    desc: "My work has been tested beyond the classroom — from competitive hackathons at IIT Madras to a live demo at the U.S. Consulate, Chennai. I deliver when the stakes are real.",
  },
  {
    num: "03",
    title: "End-to-End Ownership",
    desc: "From crafting responsive frontends to architecting backend APIs and managing databases — React, Next.js, FastAPI, PostgreSQL — I own the full stack without needing handoffs.",
  },
  {
    num: "04",
    title: "Fast Learner, Faster Shipper",
    desc: "I picked up Snap Lens Studio, Neural.ai, and AR development from scratch — and shipped NaviLens AR to a live demo stage. New tools don't slow me down, they fuel me.",
  },
  {
    num: "05",
    title: "Collaborative by Nature",
    desc: "Hackathons taught me to build fast with people I just met. I communicate clearly, adapt quickly, and never block a team.",
  },
  {
    num: "06",
    title: "Design-Conscious Developer",
    desc: "I care about how things look as much as how they work. Pixel-perfect interfaces aren't a bonus — they're part of the build.",
  },
];

/* ─── Single Flip Row ─── */
function FlipRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      {/* ── Mobile: static layout (no flip) ── */}
      <div className="block lg:hidden" style={{ backgroundColor: "#111111", position: "relative", padding: "32px 24px 32px 100px" }}>
        {/* Number watermark */}
        <span
          className="absolute pointer-events-none select-none"
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "100px",
            color: "rgba(255,255,255,0.04)",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            lineHeight: 1,
          }}
        >
          {num}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "36px",
            color: "#FFFFFF",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            marginBottom: "12px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#cccccc" }}>{desc}</p>
      </div>

      {/* ── Desktop: 3D flip card ── */}
      <div
        className="hidden lg:block relative"
        style={{
          height: "140px",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ─ FRONT FACE ─ */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            backgroundColor: "#111111",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Number watermark */}
          <span
            className="absolute pointer-events-none select-none"
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "160px",
              color: "rgba(255,255,255,0.04)",
              left: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              lineHeight: 1,
            }}
          >
            {num}
          </span>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "52px",
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              paddingLeft: "180px",
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            {title}
          </h3>

          {/* Decorative vertical line */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "25%",
              height: "50%",
              width: "2px",
              backgroundColor: "#CCFF00",
              opacity: 0.3,
            }}
          />
        </div>

        {/* ─ BACK FACE ─ */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            backgroundColor: "#1a1a1a",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Number watermark */}
          <span
            className="absolute pointer-events-none select-none"
            style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "160px",
              color: "rgba(255,255,255,0.04)",
              left: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              lineHeight: 1,
            }}
          >
            {num}
          </span>

          {/* Title reminder (left) */}
          <div style={{ width: "40%", paddingLeft: "180px", flexShrink: 0 }}>
            <h3
              style={{
                fontFamily: "var(--font-bebas-neue), sans-serif",
                fontSize: "36px",
                color: "#CCFF00",
                opacity: 0.5,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              {title}
            </h3>
          </div>

          {/* Description (right) */}
          <div style={{ width: "60%", paddingRight: "60px" }}>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#cccccc" }}>{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function WhyMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        rowsRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: rowsRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-me" className="relative" style={{ padding: "100px 0" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-[1100px] mx-auto px-6">
        {/* ═══ Header ═══ */}
        <div ref={headerRef} className="text-center mb-14" style={{ opacity: 0 }}>
          <p
            className="font-mono uppercase mb-3"
            style={{ color: "#CCFF00", fontSize: "11px", letterSpacing: "0.15em" }}
          >
            Why Me
          </p>
          <h2
            className="font-heading font-bold text-5xl lg:text-6xl"
            style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Why Choose Me
          </h2>
        </div>

        {/* ═══ Flip Rows ═══ */}
        <div ref={rowsRef} className="flex flex-col gap-3" style={{ opacity: 0 }}>
          {ROWS.map((row, i) => (
            <div key={i}>
              <FlipRow num={row.num} title={row.title} desc={row.desc} />
              {i < ROWS.length - 1 && (
                <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
