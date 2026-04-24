"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { Trophy, MapPin, Calendar, Zap } from "lucide-react";

/* ─── Hackathon data ─── */
const HACKATHONS = [
  {
    id: 1,
    name: "Ctrl+Alt+Hack",
    organizer: "LICET EICON",
    year: "2024",
    achievement: "10th Place",
    project: "VaxiTrack",
    accentColor: "#CCFF00",
    accentRgb: "204,255,0",
  },
  {
    id: 2,
    name: "BitWorks Hackathon",
    organizer: "LICET",
    year: "2024",
    achievement: "Top 5 of 20 Teams",
    project: null,
    accentColor: "#38bdf8",
    accentRgb: "56,189,248",
  },
  {
    id: 3,
    name: "Hackathon TN 2025",
    organizer: "NCSR @ IIT Madras",
    year: "2025",
    achievement: "Participated & Presented",
    project: "AI Security Scanner",
    accentColor: "#a78bfa",
    accentRgb: "167,139,250",
  },
  {
    id: 4,
    name: "Technathon 2025",
    organizer: "MAD Club, LICET",
    year: "2025",
    achievement: "Finalist",
    project: null,
    accentColor: "#f87171",
    accentRgb: "248,113,113",
  },
  {
    id: 5,
    name: "Freedom 250 TRUST Teams",
    organizer: "U.S. Consulate × Snap × TheNeural.ai",
    year: "2025",
    achievement: "Demo Day @ US Consulate",
    project: "NaviLens AR",
    accentColor: "#34d399",
    accentRgb: "52,211,153",
  },
];

const AUTO_INTERVAL = 3000;

export default function Hackathons() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const isPausedRef = useRef(false);
  const touchStartRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const total = HACKATHONS.length;

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % total) + total) % total),
    [total]
  );
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  /* ─── Progress bar ─── */
  const startProgress = useCallback(() => {
    if (progressTweenRef.current) progressTweenRef.current.kill();
    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0 });
      progressTweenRef.current = gsap.to(progressRef.current, {
        scaleX: 1,
        duration: AUTO_INTERVAL / 1000,
        ease: "none",
        transformOrigin: "left center",
      });
    }
  }, []);

  /* ─── Auto-advance ─── */
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startProgress();
    timerRef.current = setInterval(() => {
      if (!isPausedRef.current) setActiveIndex((p) => (p + 1) % total);
    }, AUTO_INTERVAL);
  }, [total, startProgress]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTweenRef.current) progressTweenRef.current.kill();
    };
  }, [activeIndex, resetTimer]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    if (progressTweenRef.current) progressTweenRef.current.pause();
  };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
    if (progressTweenRef.current) progressTweenRef.current.resume();
  };

  /* ─── Touch swipe ─── */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  /* ─── GSAP entrance ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" },
      });
      gsap.fromTo(deckRef.current, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none none" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ─── Card position (Vertical Cover Flow) ─── */
  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = index - activeIndex;
    const adj = diff > total / 2 ? diff - total : diff < -total / 2 ? diff + total : diff;

    if (adj === 0)
      return { transform: "translateY(0) scale(1)", opacity: 1, zIndex: 30, pointerEvents: "auto", filter: "brightness(1)" };
    if (adj === -1)
      return { transform: "translateY(-65%) scale(0.85)", opacity: 0.5, zIndex: 20, pointerEvents: "auto", filter: "brightness(0.5)", cursor: "pointer" };
    if (adj === 1)
      return { transform: "translateY(65%) scale(0.85)", opacity: 0.5, zIndex: 20, pointerEvents: "auto", filter: "brightness(0.5)", cursor: "pointer" };
    if (adj === -2)
      return { transform: "translateY(-110%) scale(0.7)", opacity: 0, zIndex: 10, pointerEvents: "none" };
    if (adj === 2)
      return { transform: "translateY(110%) scale(0.7)", opacity: 0, zIndex: 10, pointerEvents: "none" };
    return { transform: "translateY(0) scale(0.5)", opacity: 0, zIndex: 0, pointerEvents: "none" };
  };

  const activeHack = HACKATHONS[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="hackathons"
      className="relative overflow-hidden"
      style={{ background: "#0a0a0a", padding: "100px 0 80px" }}
    >
      {/* Divider */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(204,255,0,0.15) 30%, rgba(204,255,0,0.15) 70%, transparent)" }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.4, backgroundImage: "radial-gradient(rgba(204,255,0,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        {/* ═══ Left: Header ═══ */}
        <div ref={headerRef} className="md:w-1/3 text-center md:text-left" style={{ opacity: 0 }}>
          <p className="font-mono text-sm tracking-[0.3em] uppercase mb-3" style={{ color: "#CCFF00" }}>
            Competitions
          </p>
          <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4" style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Hackathon<br />Journey
          </h2>
          <p className="font-body" style={{ color: "rgba(255,255,255,0.55)" }}>
            From campus hackathons to international demos — my competitive coding journey.
          </p>

          {/* Progress bar */}
          <div className="mt-8 mb-4 w-full md:max-w-[200px]">
            <div className="h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                ref={progressRef}
                className="h-full rounded-full"
                style={{ background: activeHack.accentColor, transformOrigin: "left center", transform: "scaleX(0)" }}
              />
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            {HACKATHONS.map((hack, i) => (
              <button
                key={hack.id}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                className="p-1"
                aria-label={`Go to ${hack.name}`}
              >
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "24px" : "8px",
                    height: "8px",
                    background: i === activeIndex ? hack.accentColor : "rgba(255,255,255,0.15)",
                    boxShadow: i === activeIndex ? `0 0 10px rgba(${hack.accentRgb}, 0.5)` : "none",
                    borderRadius: "999px",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ═══ Right: Vertical Carousel ═══ */}
        <div
          ref={deckRef}
          className="md:w-2/3 relative w-full"
          style={{ opacity: 0 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card container */}
          <div
            className="relative mx-auto cursor-pointer flex items-center justify-center"
            style={{ height: "600px", maxWidth: "600px" }}
            onClick={goNext}
          >
            {HACKATHONS.map((hack, index) => {
              const style = getCardStyle(index);
              const isActive = index === activeIndex;

              return (
                <div
                  key={hack.id}
                  className="absolute w-full max-w-[500px] transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                  style={{
                    ...style,
                  }}
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: "#111111",
                      border: isActive
                        ? `1px solid rgba(${hack.accentRgb}, 0.3)`
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(${hack.accentRgb}, 0.06)`
                        : "0 8px 24px rgba(0,0,0,0.4)",
                    }}
                  >
                    {/* Top accent bar */}
                    <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${hack.accentColor}, transparent)` }} />

                    {/* BG gradient */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 70% 20%, rgba(${hack.accentRgb}, 0.06) 0%, transparent 60%)` }} />

                    <div className="relative p-7 md:p-8">
                      {/* Year badge */}
                      <div
                        className="absolute top-5 right-5 font-mono text-xs tracking-wider px-3 py-1.5 rounded-full"
                        style={{ background: `rgba(${hack.accentRgb}, 0.12)`, border: `1px solid rgba(${hack.accentRgb}, 0.25)`, color: hack.accentColor }}
                      >
                        <Calendar size={11} className="inline mr-1.5 -mt-0.5" />
                        {hack.year}
                      </div>

                      {/* Hackathon name */}
                      <h3 className="font-heading font-bold text-2xl md:text-[28px] mb-2 pr-24" style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                        {hack.name}
                      </h3>

                      {/* Organizer */}
                      <p className="flex items-center gap-2 font-body text-sm mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                        <MapPin size={13} className="flex-shrink-0" />
                        {hack.organizer}
                      </p>

                      {/* Achievement */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-3" style={{ background: `rgba(${hack.accentRgb}, 0.1)`, border: `1px solid rgba(${hack.accentRgb}, 0.25)` }}>
                        <Trophy size={15} style={{ color: hack.accentColor }} />
                        <span className="font-mono text-sm font-medium" style={{ color: hack.accentColor }}>{hack.achievement}</span>
                      </div>

                      {/* Project */}
                      {hack.project && (
                        <p className="flex items-center gap-2 font-body text-sm mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                          <Zap size={13} style={{ color: hack.accentColor }} className="flex-shrink-0" />
                          Project: <span className="font-medium text-white/70">{hack.project}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
