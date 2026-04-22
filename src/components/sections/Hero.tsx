"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Typed from "typed.js";
import SpatialMesh from "@/components/ui/SpatialMesh";
import MagneticButton from "@/components/ui/MagneticButton";
import { personalInfo } from "@/data/meta";
import { Github, Linkedin, Download, Mail } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // ─── GSAP entrance animations ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      // Status badge drops in
      tl.fromTo(
        badgeRef.current,
        { y: -20, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5 }
      );

      // Name — massive reveal
      const nameEl = nameRef.current;
      if (nameEl) {
        const words = Array.from(nameEl.children);
        words.forEach((word) => {
          const text = word.textContent || "";
          word.innerHTML = "";
          text.split("").forEach((char) => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.display = "inline-block";
            span.style.opacity = "0";
            span.style.transform = "translateY(80px) rotateX(-90deg)";
            word.appendChild(span);
          });
        });

        tl.to(nameEl, { opacity: 1, duration: 0.1 }, "-=0.2");
        
        const chars = nameEl.querySelectorAll("span");
        tl.to(
          chars,
          { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.03, ease: "expo.out" },
          "-=0.1"
        );
      }

      // Terminal line
      tl.fromTo(
        terminalRef.current,
        { width: 0, opacity: 0 },
        { width: "auto", opacity: 1, duration: 0.6 },
        "-=0.6"
      );

      // CTAs stagger in
      if (ctaRef.current) {
        const buttons = ctaRef.current.children;
        tl.fromTo(
          buttons,
          { y: 40, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
      }

      // Social icons pop in
      if (iconsRef.current) {
        const icons = iconsRef.current.children;
        tl.fromTo(
          icons,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.08,
            ease: "back.out(2)",
          },
          "-=0.3"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Typed.js tagline ───
  useEffect(() => {
    if (!taglineRef.current) return;

    const typed = new Typed(taglineRef.current, {
      strings: [
        "Full Stack Developer",
        "Cybersecurity Enthusiast",
        "AI Builder",
        "Hackathon Competitor",
        "Freelance Developer",
      ],
      typeSpeed: 45,
      backSpeed: 25,
      backDelay: 2000,
      loop: true,
      cursorChar: "▊",
    });

    setTimeout(() => {
      const cursor = taglineRef.current?.nextSibling as HTMLElement;
      if (cursor && cursor.classList?.contains("typed-cursor")) {
        cursor.style.color = "#6D8196";
        cursor.style.opacity = "1";
        cursor.style.fontSize = "inherit";
      }
    }, 100);

    return () => typed.destroy();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* ── Spatial 3D Mesh Background ── */}
      <SpatialMesh />

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Status badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-8"
          style={{ opacity: 0 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-mono text-text-secondary tracking-wider">
            Available for opportunities
          </span>
        </div>

        {/* Massive Name */}
        <h1
          ref={nameRef}
          className="text-6xl md:text-8xl lg:text-[10rem] font-heading font-black text-white leading-[0.9] tracking-tighter mix-blend-difference z-10 pointer-events-none"
          style={{ 
            opacity: 0,
            perspective: "1000px",
            textShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          {personalInfo.name.split(" ").map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h1>

        {/* Terminal-style typed tagline */}
        <div
          ref={terminalRef}
          className="flex justify-center items-center gap-3 py-3 px-6 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md mt-10"
          style={{ opacity: 0 }}
        >
          <span className="text-accent font-mono text-sm select-none flex-shrink-0">
            ~/portfolio $
          </span>
          <span
            ref={taglineRef}
            className="text-white font-mono text-sm md:text-base"
          />
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap justify-center gap-4 mt-12">
          <MagneticButton
            href="#contact"
            className="!bg-white !text-black hover:!bg-white/90 !animate-none font-heading text-lg px-8 py-3"
          >
            <Mail size={18} />
            Get In Touch
          </MagneticButton>
          <MagneticButton
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="!animate-none text-lg px-8 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            <Download size={18} />
            Resume
          </MagneticButton>
        </div>

        {/* Social Icons */}
        <div ref={iconsRef} className="flex justify-center gap-4 mt-8">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-full border border-white/10 bg-black/40 hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <Github
              size={20}
              className="text-white/70 group-hover:text-white transition-colors duration-300"
            />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-full border border-white/10 bg-black/40 hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <Linkedin
              size={20}
              className="text-white/70 group-hover:text-white transition-colors duration-300"
            />
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="group p-3 rounded-full border border-white/10 bg-black/40 hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            <Mail
              size={20}
              className="text-white/70 group-hover:text-white transition-colors duration-300"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
