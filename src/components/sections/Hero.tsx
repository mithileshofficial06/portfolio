"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Typed from "typed.js";
import Image from "next/image";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowUpRight, Download, Github } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);

  // Granular refs for cinematic sequence
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const nameLine1Ref = useRef<HTMLHeadingElement>(null);
  const nameLine2Ref = useRef<HTMLHeadingElement>(null);
  const role1Ref = useRef<HTMLDivElement>(null);
  const role2Ref = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);

  /* ─── Cinematic entrance timeline ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 0. Initial states — everything hidden
      gsap.set([greetingRef.current, nameLine1Ref.current, nameLine2Ref.current], {
        clipPath: "inset(0 100% 0 0)",
        opacity: 1,
      });
      gsap.set(photoRef.current, { y: "15%", opacity: 0, scale: 1.05 });
      gsap.set([role1Ref.current, role2Ref.current], { x: 80, opacity: 0 });
      gsap.set(terminalRef.current, { y: 20, opacity: 0, scale: 0.95 });
      gsap.set(statusRef.current, { y: 30, opacity: 0 });
      gsap.set(ctaRef.current, { y: 30, opacity: 0 });
      gsap.set(bgTextRef.current, { opacity: 0, x: -40 });
      gsap.set(gridRef.current, { opacity: 0 });

      // ── ACT 1: Background awakens (t=0)
      tl.to(gridRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
      }, 0);

      tl.to(bgTextRef.current, {
        opacity: 1,
        x: 0,
        duration: 2.5,
        ease: "power2.out",
      }, 0.1);

      // ── ACT 2: Name reveal — clip-path wipe (t=0.4)
      tl.to(greetingRef.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.8,
        ease: "power3.inOut",
      }, 0.4);

      tl.to(nameLine1Ref.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.9,
        ease: "power3.inOut",
      }, 0.6);

      tl.to(nameLine2Ref.current, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.8,
        ease: "power3.inOut",
      }, 0.85);

      // ── ACT 3: Photo rises from below (t=0.5)
      tl.to(photoRef.current, {
        y: "0%",
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
      }, 0.5);

      // ── ACT 4: Role titles slide in from right (t=1.0)
      tl.to(role1Ref.current, {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      }, 1.0);

      tl.to(role2Ref.current, {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
      }, 1.2);

      // ── ACT 5: Terminal pill pops in (t=1.5)
      tl.to(terminalRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2)",
      }, 1.5);

      // ── ACT 6: Bottom elements rise (t=1.7)
      tl.to(statusRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      }, 1.7);

      // ── ACT 7: CTA reveals last (t=2.0)
      tl.to(ctaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
      }, 2.0);

      // ── ACT 8: Crosshair pops (t=2.3)
      tl.fromTo(crosshairRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(3)" },
        2.3
      );

      // Crosshair perpetual pulse
      tl.to(crosshairRef.current, {
        scale: 1.2,
        opacity: 0.5,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }, "+=0");

      // Background watermark slow perpetual drift
      gsap.to(bgTextRef.current, {
        x: 30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.5,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ─── Typed.js — starts after terminal pill reveals ─── */
  useEffect(() => {
    if (!taglineRef.current) return;

    // Delay typed.js start to sync with terminal pill reveal
    const timer = setTimeout(() => {
      const typed = new Typed(taglineRef.current!, {
        strings: ["Full Stack Developer", "UI/UX Designer", "Cybersecurity Enthusiast"],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1500,
        loop: true,
        cursorChar: "|",
      });

      setTimeout(() => {
        const cursor = taglineRef.current?.nextSibling as HTMLElement;
        if (cursor?.classList?.contains("typed-cursor")) {
          cursor.style.color = "#CCFF00";
          cursor.style.opacity = "1";
          cursor.style.fontSize = "inherit";
        }
      }, 100);

      return () => typed.destroy();
    }, 1800); // Matches terminal pill reveal at t=1.5 + 0.3

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Dot-grid pattern ── */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          backgroundImage: "radial-gradient(rgba(204,255,0,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Geometric lines ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        {[25, 50, 75].map((pct) => (
          <div key={pct} className="absolute top-0 bottom-0" style={{ left: `${pct}%`, width: "1px", background: "linear-gradient(to bottom, transparent, rgba(204,255,0,0.3) 30%, rgba(204,255,0,0.3) 70%, transparent)" }} />
        ))}
        <div className="absolute left-0 right-0" style={{ top: "40%", height: "1px", background: "linear-gradient(to right, transparent, rgba(204,255,0,0.2) 20%, rgba(204,255,0,0.2) 80%, transparent)" }} />
      </div>

      {/* ── Background watermark ── */}
      <div ref={bgTextRef} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0 }}>
        <span className="font-heading font-black italic whitespace-nowrap" style={{ fontSize: "20vw", color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "-0.04em", fontFamily: "'Clash Display', var(--font-space-grotesk), sans-serif", textTransform: "none" }}>
          DEVELOPER
        </span>
      </div>

      {/* ══════ PHOTO — absolutely positioned center ══════ */}
      <div
        ref={photoRef}
        className="absolute bottom-0 left-1/2 z-20 pointer-events-none"
        style={{ opacity: 0, transform: "translateX(-55%)" }}
      >
        {/* Concentric circles */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 hidden lg:block">
          {[100, 160, 220].map((size, i) => (
            <div key={i} className="absolute rounded-full" style={{ width: `${size}px`, height: `${size}px`, left: `${-size / 2}px`, top: `${-size / 2}px`, border: `1px solid rgba(204,255,0,${0.06 - i * 0.015})` }} />
          ))}
        </div>

        {/* Crosshair */}
        <div ref={crosshairRef} className="absolute z-30 hidden lg:flex items-center justify-center" style={{ top: "8%", right: "15%", width: "24px", height: "24px", opacity: 0 }}>
          <div className="w-full h-full rounded-full border border-[#CCFF00]/40" />
          <div className="absolute w-[6px] h-[6px] rounded-full" style={{ backgroundColor: "#CCFF00" }} />
          <div className="absolute w-[1px] h-full" style={{ backgroundColor: "rgba(204,255,0,0.2)" }} />
          <div className="absolute w-full h-[1px]" style={{ backgroundColor: "rgba(204,255,0,0.2)" }} />
        </div>

        <Image
          src="/Mithilesh.png"
          alt="Mithilesh KS"
          width={880}
          height={1100}
          className="w-auto block"
          style={{ objectFit: "contain", height: "98vh", filter: "none" }}
          sizes="400px"
          priority
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }} />
      </div>

      {/* ══════ TWO-COLUMN TEXT LAYOUT ══════ */}
      <div className="relative z-30 h-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-stretch gap-0">

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="flex flex-col justify-between py-8 lg:py-14">
            {/* Top: greeting + name */}
            <div>
              <p
                ref={greetingRef}
                className="text-[10px] md:text-[11px] font-mono tracking-[0.3em] uppercase mb-6 lg:mb-10"
                style={{ color: "rgba(204,255,0,0.55)", clipPath: "inset(0 100% 0 0)" }}
              >
                👋 Hi, my name is
              </p>
              <h1
                ref={nameLine1Ref}
                className="font-heading font-black italic leading-[0.88] whitespace-nowrap"
                style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.04em", fontFamily: "'Clash Display', var(--font-space-grotesk), sans-serif", textTransform: "none", clipPath: "inset(0 100% 0 0)" }}
              >
                <span style={{ color: "#CCFF00" }}>M</span>
                <span className="text-white">ITHILESH</span>
              </h1>
              <h1
                ref={nameLine2Ref}
                className="font-heading font-black italic leading-[0.88] whitespace-nowrap"
                style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.04em", color: "#CCFF00", fontFamily: "'Clash Display', var(--font-space-grotesk), sans-serif", textTransform: "none", clipPath: "inset(0 100% 0 0)" }}
              >
                KS
              </h1>
            </div>
          </div>

          {/* ═══ BOTTOM-LEFT: Status (absolute) ═══ */}
          <div ref={statusRef} className="absolute flex items-center gap-4" style={{ bottom: "15px", left: "2rem", zIndex: 50, opacity: 0 }}>
            <div>
              <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-white/25 mb-3">
                Current Status
              </p>
              <div className="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-white/[0.04] border border-white/[0.12]">
                <div className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: "#CCFF00" }} />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: "#CCFF00" }} />
                </div>
                <p className="text-[13px] text-white/50">
                  Available for <span className="font-bold" style={{ color: "#CCFF00" }}>Projects</span>
                </p>
              </div>
            </div>
            <a
              href="/api/resume"
              className="group inline-flex items-center gap-2 py-2.5 px-5 rounded-full transition-all duration-300 mt-auto cursor-pointer"
              style={{ backgroundColor: "#CCFF00", color: "#0a0a0a" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#b8e600"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#CCFF00"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <Download size={14} style={{ color: "#0a0a0a" }} />
              <span className="text-[11px] font-mono uppercase tracking-[0.1em] font-bold">Resume</span>
            </a>
            <a
              href="https://github.com/mithileshofficial06"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 py-2.5 px-5 rounded-full transition-all duration-300 mt-auto border border-white/15 hover:border-[#CCFF00]/50"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#fff" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(204,255,0,0.08)"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <Github size={14} className="text-white/60 group-hover:text-[#CCFF00] transition-colors duration-300" />
              <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-white/60 group-hover:text-[#CCFF00] transition-colors duration-300">GitHub</span>
            </a>
          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="flex flex-col justify-between pt-16 pb-8 lg:pt-24 lg:pb-14 pl-[32%] lg:pl-[28%]">
            {/* Top: role titles */}
            <div>
              {/* 01 DEVELOPER */}
              <div ref={role1Ref} className="flex items-start gap-3 mb-3" style={{ opacity: 0 }}>
                <span className="text-[10px] font-mono pt-2 flex-shrink-0 leading-none" style={{ color: "#CCFF00" }}>01</span>
                <h2 className="font-heading font-black leading-[0.88] whitespace-nowrap" style={{ fontSize: "clamp(3.5rem, 6vw, 6.5rem)", letterSpacing: "-0.04em", fontFamily: "'Clash Display', var(--font-space-grotesk), sans-serif", textTransform: "none" }}>
                  <span className="text-white">DEVELOP</span>
                  <span style={{ color: "#CCFF00" }}>ER</span>
                </h2>
              </div>

              {/* 02 & DESIGNER */}
              <div ref={role2Ref} className="flex items-start gap-3 mb-8" style={{ opacity: 0 }}>
                <span className="text-[10px] font-mono pt-2 flex-shrink-0 leading-none" style={{ color: "#CCFF00" }}>02</span>
                <h2 className="font-heading font-black leading-[0.88] whitespace-nowrap" style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)", letterSpacing: "-0.04em", fontFamily: "'Clash Display', var(--font-space-grotesk), sans-serif", textTransform: "none" }}>
                  <span style={{ color: "transparent", WebkitTextStroke: "2px #CCFF00" }}>&amp;</span>{" "}
                  <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}>DESIGN</span>
                  <span style={{ color: "#CCFF00" }}>ER</span>
                </h2>
              </div>

              {/* Terminal pill */}
              <div ref={terminalRef} className="lg:pl-8" style={{ opacity: 0 }}>
                <div className="inline-flex items-center gap-2.5 py-2.5 px-5 rounded-full bg-white/[0.04] border border-white/[0.07]">
                  <span className="font-mono text-[10px] md:text-[11px] select-none flex-shrink-0" style={{ color: "#CCFF00" }}>~/role $</span>
                  <span ref={taglineRef} className="text-white/60 font-mono text-[11px] md:text-xs" />
                </div>
              </div>
            </div>

            {/* Bottom: CTA */}
            <div ref={ctaRef} className="mt-12 lg:mt-20 ml-6 lg:ml-12 mb-6 lg:mb-12" style={{ opacity: 0 }}>
              <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.25em] text-white/25 mb-2">Get in touch</p>
              <a href="#contact" className="group inline-flex items-center gap-2">
                <div className="relative inline-block font-heading font-black" style={{ fontSize: "clamp(1.8rem, 3vw, 3.2rem)", letterSpacing: "-0.03em", fontFamily: "'Clash Display', var(--font-space-grotesk), sans-serif", textTransform: "none" }}>
                  <span className="text-white">LET&apos;S TALK</span>
                  <span
                    className="absolute top-0 left-0 text-[#CCFF00] w-0 overflow-hidden whitespace-nowrap transition-[width] duration-500 ease-out group-hover:w-full"
                  >
                    LET&apos;S TALK
                  </span>
                </div>
                <ArrowUpRight size={24} className="text-white/50 group-hover:text-[#CCFF00] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
