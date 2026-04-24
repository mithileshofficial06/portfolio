"use client";

import { motion } from "framer-motion";

/* ─── Category Data ─── */
const CATEGORIES = [
  {
    name: "Programming & Core",
    suit: "♠",
    color: "#FFFFFF",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "SQL"],
  },
  {
    name: "Frontend",
    suit: "♥",
    color: "#EF4444",
    skills: ["HTML", "CSS", "React", "Next.js", "Tailwind CSS", "GSAP"],
  },
  {
    name: "Backend & DBs",
    suit: "♣",
    color: "#FFFFFF",
    skills: ["Node.js", "Flask", "MongoDB"],
  },
  {
    name: "Cybersecurity",
    suit: "♦",
    color: "#EF4444",
    skills: ["Burp Suite", "Nmap", "Wireshark", "OWASP ZAP"],
  },
  {
    name: "Dev Tools",
    suit: "⚙",
    color: "#888888",
    skills: ["Git", "GitHub", "npm", "Vercel", "Linux"],
  },
];

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/* ─── Single Playing Card ─── */
function PlayingCard({
  skill,
  suit,
  suitColor,
  rank,
  index,
  total,
}: {
  skill: string;
  suit: string;
  suitColor: string;
  rank: string;
  index: number;
  total: number;
}) {
  const mid = (total - 1) / 2;
  const offset = index - mid;
  const rotation = offset * 5;
  const translateX = offset * 32;

  const displayColor = suitColor === "#FFFFFF" ? "#1a1a1a" : suitColor;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, rotate: rotation + 10 }}
      whileInView={{ y: 0, opacity: 1, rotate: rotation, x: translateX }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 16,
        delay: index * 0.06,
      }}
      className="absolute cursor-pointer"
      style={{
        width: "85px",
        height: "120px",
        transformOrigin: "bottom center",
        zIndex: index,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.zIndex = "50";
        el.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.5))";
        // Apply a relative translateY lift on top of Framer Motion's transform
        const current = getComputedStyle(el).transform;
        el.dataset.originalTransform = current;
        el.style.transform = current + " translateY(-28px) scale(1.06)";
        el.style.transition = "transform 0.15s ease-out, filter 0.15s ease-out";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.zIndex = String(index);
        el.style.filter = "none";
        el.style.transform = el.dataset.originalTransform || "";
        el.style.transition = "transform 0.15s ease-out, filter 0.15s ease-out";
      }}
    >
      <div
        className="w-full h-full rounded-sm flex flex-col justify-between relative overflow-hidden"
        style={{
          backgroundColor: "#FAFAF8",
          border: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "2px 4px 12px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.15)",
          padding: "6px 7px",
        }}
      >
        {/* Top-left */}
        <div className="flex flex-col items-center leading-none" style={{ width: "fit-content" }}>
          <span className="font-bold" style={{ fontSize: "11px", lineHeight: 1, color: displayColor }}>{rank}</span>
          <span style={{ fontSize: "10px", lineHeight: 1, color: displayColor }}>{suit}</span>
        </div>

        {/* Center: skill name */}
        <div className="absolute inset-0 flex items-center justify-center px-1">
          <span
            className="text-center font-semibold leading-tight"
            style={{ fontSize: skill.length > 10 ? "8px" : "9.5px", color: "#1a1a1a", fontFamily: "var(--font-inter), sans-serif" }}
          >
            {skill}
          </span>
        </div>

        {/* Center suit watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span style={{ fontSize: "36px", color: suitColor === "#FFFFFF" ? "rgba(0,0,0,0.04)" : `${suitColor}15`, lineHeight: 1 }}>{suit}</span>
        </div>

        {/* Bottom-right */}
        <div className="flex flex-col items-center leading-none self-end" style={{ transform: "rotate(180deg)", width: "fit-content" }}>
          <span className="font-bold" style={{ fontSize: "11px", lineHeight: 1, color: displayColor }}>{rank}</span>
          <span style={{ fontSize: "10px", lineHeight: 1, color: displayColor }}>{suit}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Single Category Hand ─── */
function CategoryHand({ cat }: { cat: typeof CATEGORIES[number] }) {
  const displayColor = cat.color === "#FFFFFF" ? "#aaa" : cat.color;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Category label */}
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color: displayColor, fontSize: "18px" }}>{cat.suit}</span>
        <span
          className="font-mono uppercase text-xs"
          style={{ color: "#888", letterSpacing: "0.1em" }}
        >
          {cat.name}
        </span>
      </div>

      {/* Fanned hand */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "170px", width: `${Math.max(cat.skills.length * 36 + 85, 220)}px` }}
      >
        {cat.skills.map((skill, i) => (
          <PlayingCard
            key={skill}
            skill={skill}
            suit={cat.suit}
            suitColor={cat.color}
            rank={RANKS[i % RANKS.length]}
            index={i}
            total={cat.skills.length}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden" style={{ padding: "100px 0", background: "#0a0a0a" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span
          style={{
            fontFamily: "var(--font-bebas-neue), sans-serif",
            fontSize: "clamp(120px, 18vw, 260px)",
            color: "rgba(255,255,255,0.03)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          SKILLS
        </span>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative" style={{ zIndex: 1 }}>
        {/* ═══ Header ═══ */}
        <div className="text-center mb-16">
          <p
            className="font-mono uppercase mb-3"
            style={{ color: "#CCFF00", fontSize: "11px", letterSpacing: "0.15em" }}
          >
            Skills
          </p>
          <h2
            className="font-heading font-bold text-5xl lg:text-6xl"
            style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Skills & Technologies
          </h2>
          <p className="mt-3 font-mono text-sm" style={{ color: "#666" }}>
            Hover to pick a card from any hand.
          </p>
        </div>

        {/* ═══ All Hands Grid ═══ */}
        <div className="flex flex-wrap justify-center gap-y-14 gap-x-12">
          {CATEGORIES.map((cat) => (
            <CategoryHand key={cat.name} cat={cat} />
          ))}
        </div>

        {/* ═══ Card count ═══ */}
        <div className="text-center mt-14">
          <span className="font-mono text-xs" style={{ color: "#555" }}>
            {CATEGORIES.reduce((sum, c) => sum + c.skills.length, 0)} skills across {CATEGORIES.length} suits
          </span>
        </div>
      </div>
    </section>
  );
}
