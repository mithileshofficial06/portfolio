"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MapPin, GraduationCap, ShieldCheck } from "lucide-react";

/* ─── Reusable Pin component ─── */
function Pin() {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-10"
      style={{ top: "-10px" }}
    >
      <div
        className="relative rounded-full"
        style={{
          width: "16px",
          height: "16px",
          background: "radial-gradient(circle at 40% 35%, #e63322, #CC2200 50%, #8B0000)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.25)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: "5px",
            height: "5px",
            background: "#8B0000",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Highlighted text helper ─── */
function HL({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        color: "#5C3317",
        textDecoration: "underline",
        textDecorationColor: "#5C3317",
        textUnderlineOffset: "4px",
        textDecorationThickness: "2px",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

/* ─── Paper background styles ─── */
const paperStyle: React.CSSProperties = {
  backgroundColor: "#F5F0E8",
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
  boxShadow: "4px 6px 20px rgba(0,0,0,0.35), 1px 1px 0 rgba(0,0,0,0.04)",
  position: "relative" as const,
};

/* ─── Chit data ─── */
const CHITS = [
  { icon: MapPin, text: "Chennai, India" },
  { icon: GraduationCap, text: "LICET, CSE '28" },
  { icon: ShieldCheck, text: "Google Cybersecurity Certificate" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const chitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" },
        }
      );

      // Large paper — fade in + slide up
      gsap.fromTo(
        paperRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none none" },
        }
      );

      // Chits — stagger from right
      if (chitsRef.current) {
        gsap.fromTo(
          chitsRef.current.children,
          { x: 40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out",
            scrollTrigger: { trigger: chitsRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden" style={{ padding: "100px 0" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background watermark is now integrated into the layout below */}

      <div className="max-w-[1100px] mx-auto px-6 relative" style={{ zIndex: 1 }}>
        {/* ═══ Header ═══ */}
        <div ref={headerRef} className="text-center mb-14" style={{ opacity: 0 }}>
          <h2
            className="font-heading font-bold text-5xl lg:text-6xl"
            style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            About Me
          </h2>
        </div>

        {/* ═══ Papers Layout ═══ */}
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">

          {/* ── Large Paper (left) ── */}
          <div
            ref={paperRef}
            className="w-full lg:w-[58%] rounded-sm"
            style={{ ...paperStyle, padding: "52px 44px", minHeight: "500px", opacity: 0 }}
          >
            <Pin />

            {/* Giant ? watermark behind text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }}>
              <span style={{
                fontSize: "clamp(300px, 50vw, 500px)",
                color: "rgba(0,0,0,0.04)",
                fontFamily: "var(--font-bebas-neue), sans-serif",
                lineHeight: 1,
              }}>?</span>
            </div>

            {/* Faint ruled lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 43px, rgba(180,170,155,0.18) 43px, rgba(180,170,155,0.18) 44px)",
                backgroundPositionY: "52px",
              }}
            />

            <div className="relative" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "22px", lineHeight: 2.0, color: "#1a1a1a" }}>
              <p className="mb-5">
                Aspiring <HL>Full Stack Developer</HL> with a solid grasp of developing practical applications using Python, FastAPI, Flask, Next.js, React.js, and PostgreSQL.
              </p>
              <p className="mb-5">
                Built <HL>Vaxi-Track</HL> — an AI-powered immunization tracking system (Top 10, Ctrl+Alt+Hack Hackathon), <HL>Kalyana Konnection</HL> — a real-time food redistribution system, <HL>NaviLens AR</HL> — an AR city discovery experience built for the U.S. Consulate × Snap challenge, and <HL>AISA</HL> — an AI-powered automated security scanner.
              </p>
              <p className="mb-5">
                Basic understanding of cybersecurity concepts from Google&apos;s Cybersecurity Professional Certificate.
              </p>
              <p>
                Seeking to learn and grow in a professional environment.
              </p>
            </div>
          </div>

          {/* ── Chits (right) ── */}
          <div
            ref={chitsRef}
            className="flex flex-row lg:flex-col gap-6 w-full lg:w-[38%] lg:pt-6 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
          >
            {CHITS.map((chit, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-sm"
                style={{
                  ...paperStyle,
                  width: "240px",
                  padding: "36px 24px 28px",
                  transform: `rotate(${i === 0 ? -1.5 : i === 1 ? 1 : -0.8}deg)`,
                  opacity: 0,
                }}
              >
                <Pin />

                <div className="flex flex-col items-center text-center gap-3" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  <chit.icon size={28} style={{ color: "#555", strokeWidth: 1.5 }} />
                  <span style={{ fontSize: "18px", color: "#1a1a1a", lineHeight: 1.4 }}>
                    {chit.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Vertical WHO AM I text ── */}
          <div className="hidden lg:block absolute pointer-events-none select-none" style={{ writingMode: "vertical-rl", textOrientation: "mixed", right: "0px", top: "50%", transform: "translateY(-50%)" }}>
            <span style={{
              fontFamily: "var(--font-bebas-neue), sans-serif",
              fontSize: "clamp(60px, 8vw, 100px)",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.04)",
              lineHeight: 1,
              textTransform: "uppercase",
            }}>WHO AM I</span>
          </div>

        </div>
      </div>
    </section>
  );
}
