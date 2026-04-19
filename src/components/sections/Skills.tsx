"use client";

import { useState, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ropeSkills, skillCategories } from "@/data/skills";

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */
const STAGE_H        = 260;
const GROUND_BOTTOM  = 48;   // ground line from stage bottom
const CHAR_W         = 50;
const CHAR_H         = 100;
const ROPE_W         = 1100; // enough to fit all badges
const RUNNER_W       = CHAR_W + ROPE_W + 40; // total runner div width
const RUN_DURATION   = 18;

/* ═══════════════════════════════════════════════════════════════════════════
   RUNNING CHARACTER — two pose SVGs that alternate
   ═══════════════════════════════════════════════════════════════════════════ */
const charStroke = { stroke: "#FFFFE3", strokeWidth: 2, strokeLinecap: "round" as const, fill: "none" };

function PoseA() {
  return (
    <svg width={CHAR_W} height={CHAR_H} viewBox="0 0 50 100" fill="none" className="char-pose-a">
      {/* Head */}
      <circle cx="25" cy="10" r="8" {...charStroke} />
      {/* Hood */}
      <path d="M 15 8 Q 25 2 35 8 L 38 20 Q 25 18 12 20 Z" stroke="#FFFFE3" strokeWidth="2" fill="rgba(255,255,227,0.08)" />
      {/* Torso */}
      <line x1="25" y1="18" x2="25" y2="52" {...charStroke} />
      {/* Left arm forward */}
      <line x1="25" y1="25" x2="10" y2="40" {...charStroke} />
      {/* Right arm back */}
      <line x1="25" y1="25" x2="38" y2="35" {...charStroke} />
      {/* Left leg forward */}
      <line x1="25" y1="52" x2="12" y2="75" {...charStroke} />
      <line x1="12" y1="75" x2="8"  y2="100" {...charStroke} />
      {/* Right leg back */}
      <line x1="25" y1="52" x2="38" y2="70" {...charStroke} />
      <line x1="38" y1="70" x2="42" y2="85" {...charStroke} />
      {/* Rope attach */}
      <circle cx="25" cy="48" r="2" fill="#6D8196" />
    </svg>
  );
}

function PoseB() {
  return (
    <svg width={CHAR_W} height={CHAR_H} viewBox="0 0 50 100" fill="none" className="char-pose-b">
      {/* Head */}
      <circle cx="25" cy="10" r="8" {...charStroke} />
      {/* Hood */}
      <path d="M 15 8 Q 25 2 35 8 L 38 20 Q 25 18 12 20 Z" stroke="#FFFFE3" strokeWidth="2" fill="rgba(255,255,227,0.08)" />
      {/* Torso */}
      <line x1="25" y1="18" x2="25" y2="52" {...charStroke} />
      {/* Left arm back */}
      <line x1="25" y1="25" x2="12" y2="35" {...charStroke} />
      {/* Right arm forward */}
      <line x1="25" y1="25" x2="40" y2="40" {...charStroke} />
      {/* Left leg back */}
      <line x1="25" y1="52" x2="10" y2="70" {...charStroke} />
      <line x1="10" y1="70" x2="14" y2="85" {...charStroke} />
      {/* Right leg forward */}
      <line x1="25" y1="52" x2="40" y2="75" {...charStroke} />
      <line x1="40" y1="75" x2="44" y2="100" {...charStroke} />
      {/* Rope attach */}
      <circle cx="25" cy="48" r="2" fill="#6D8196" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // GSAP scroll entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{ background: "#0f0f0f", padding: "80px 0" }}
    >
      {/* ── Title block ── */}
      <div ref={headerRef} style={{ textAlign: "center", opacity: 0, marginBottom: 40 }}>
        <p style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 11,
          color: "#6D8196",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}>
          Expertise
        </p>
        <h2 style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 700,
          color: "#FFFFE3",
          margin: "0 0 12px",
        }}>
          Skills &amp; Technologies
        </h2>
        <p style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 16,
          color: "#CBCBCB",
          margin: 0,
        }}>
          Carrying my stack everywhere I go.
        </p>
      </div>

      {/* ── Category tabs ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        marginBottom: 48,
        padding: "0 24px",
      }}>
        {skillCategories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                padding: "8px 20px",
                borderRadius: 999,
                border: `1px solid ${isActive ? "#6D8196" : "rgba(109,129,150,0.25)"}`,
                background: isActive ? "rgba(109,129,150,0.15)" : "transparent",
                color: isActive ? "#FFFFE3" : "#CBCBCB",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ═══════ ANIMATION STAGE ═══════ */}
      <div
        className="skill-stage"
        style={{
          position: "relative",
          width: "100%",
          height: STAGE_H,
          background: "#141414",
          borderTop: "1px solid #1f1f1f",
          borderBottom: "1px solid #1f1f1f",
          overflow: "hidden",
        }}
      >
        {/* Ground line */}
        <div style={{
          position: "absolute",
          bottom: GROUND_BOTTOM,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(109,129,150,0.2) 10%, rgba(109,129,150,0.2) 90%, transparent)",
        }} />

        {/* ── Runner container (character + rope + badges) ── */}
        <div
          className="skill-runner"
          style={{
            position: "absolute",
            bottom: GROUND_BOTTOM,
            left: 0,
            width: RUNNER_W,
            display: "flex",
            alignItems: "flex-end",
            willChange: "transform",
          }}
        >
          {/* Character wrapper */}
          <div style={{ position: "relative", width: CHAR_W, height: CHAR_H, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <PoseA />
            </div>
            <div style={{ position: "absolute", inset: 0 }}>
              <PoseB />
            </div>

            {/* Dust puffs */}
            <div className="dust-a" style={{
              position: "absolute", bottom: 0, left: 4,
              width: 8, height: 4, borderRadius: "50%",
              background: "rgba(255,255,227,0.08)",
            }} />
            <div className="dust-b" style={{
              position: "absolute", bottom: 2, left: 12,
              width: 8, height: 4, borderRadius: "50%",
              background: "rgba(255,255,227,0.08)",
            }} />
          </div>

          {/* Rope + badge wrapper */}
          <div style={{ position: "relative", width: ROPE_W, height: CHAR_H, flexShrink: 0 }}>
            {/* Rope SVG */}
            <svg
              width={ROPE_W}
              height={CHAR_H}
              viewBox={`0 0 ${ROPE_W} ${CHAR_H}`}
              style={{ position: "absolute", bottom: 0, left: 0 }}
              fill="none"
            >
              <path
                className="rope-path"
                d={`M 0 48 C 150 35, 300 55, 450 40 S 600 50, 750 45 S 900 42, ${ROPE_W} 46`}
                stroke="#6D8196"
                strokeWidth="1.5"
                opacity="0.5"
              />
            </svg>

            {/* Skill badges */}
            {ropeSkills.map((skill) => {
              const isHighlighted =
                activeCategory === "All" || skill.category === activeCategory;
              const floatDuration = 1.8 + (skill.ropeX % 7) * 0.2;
              const floatDelay = (skill.ropeX / 1000) * 2;

              return (
                <div key={skill.name} style={{ position: "absolute", left: skill.ropeX, bottom: 60 }}>
                  {/* Tether */}
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    width: 1,
                    height: 18,
                    background: "rgba(109,129,150,0.3)",
                  }} />

                  {/* Badge */}
                  <div
                    className="skill-badge"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 12px",
                      borderRadius: 20,
                      border: `1px solid ${isHighlighted ? "rgba(109,129,150,0.5)" : "rgba(109,129,150,0.15)"}`,
                      background: isHighlighted ? "rgba(109,129,150,0.12)" : "rgba(20,20,20,0.95)",
                      color: isHighlighted ? "#FFFFE3" : "#666",
                      opacity: isHighlighted ? 1 : 0.2,
                      boxShadow: isHighlighted ? "0 0 14px rgba(109,129,150,0.2)" : "none",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "opacity 0.3s, border-color 0.3s, color 0.3s, background 0.3s, box-shadow 0.3s",
                      animation: `floatBob ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
                    }}
                  >
                    <span style={{ fontSize: 13, lineHeight: 1 }}>{skill.emoji}</span>
                    <span>{skill.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════ CSS ANIMATIONS ═══════ */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Runner translation across stage ── */
        .skill-runner {
          animation: runAcross ${RUN_DURATION}s linear infinite;
        }
        @keyframes runAcross {
          0%   { transform: translateX(calc(100vw + 50px)); }
          100% { transform: translateX(-${RUNNER_W + 50}px); }
        }

        /* ── Character pose toggle ── */
        .char-pose-a {
          animation: poseToggle 0.45s steps(1) infinite;
        }
        .char-pose-b {
          animation: poseToggle 0.45s steps(1) infinite reverse;
        }
        @keyframes poseToggle {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        /* ── Dust puffs ── */
        .dust-a {
          animation: dustPuff 0.4s ease-out infinite;
        }
        .dust-b {
          animation: dustPuff 0.4s ease-out 0.2s infinite;
        }
        @keyframes dustPuff {
          0%   { transform: scale(0.5); opacity: 0.3; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* ── Rope wave (path morph via d attribute) ── */
        .rope-path {
          animation: ropeWave 3s ease-in-out infinite;
        }
        @keyframes ropeWave {
          0%, 100% {
            d: path("M 0 48 C 150 35, 300 55, 450 40 S 600 50, 750 45 S 900 42, ${ROPE_W} 46");
          }
          50% {
            d: path("M 0 48 C 150 55, 300 35, 450 55 S 600 40, 750 48 S 900 50, ${ROPE_W} 44");
          }
        }

        /* ── Badge float bob ── */
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50%      { transform: translateY(-8px) rotate(1.5deg); }
        }

        /* ── Badge hover ── */
        .skill-badge:hover {
          border-color: #6D8196 !important;
          color: #FFFFE3 !important;
          opacity: 1 !important;
          box-shadow: 0 0 12px rgba(109,129,150,0.25) !important;
          transform: scale(1.1) translateY(-4px) !important;
          animation-play-state: paused !important;
          z-index: 10;
        }

        /* ── Mobile responsive ── */
        @media (max-width: 768px) {
          .skill-stage {
            height: 200px !important;
          }
          .skill-runner {
            transform-origin: bottom left;
            animation: runAcrossMobile 14s linear infinite;
          }
          @keyframes runAcrossMobile {
            0%   { transform: translateX(calc(100vw + 50px)) scale(0.7); }
            100% { transform: translateX(-${RUNNER_W + 50}px) scale(0.7); }
          }
          .skill-badge {
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
        }
      `}} />
    </section>
  );
}
