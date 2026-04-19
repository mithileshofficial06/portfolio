"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Typed from "typed.js";
import PhotoParticles from "@/components/ui/PhotoParticles";
import MagneticButton from "@/components/ui/MagneticButton";
import { personalInfo } from "@/data/meta";
import { Github, Linkedin, Download, Mail, ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);

  // ─── Dot grid background with mouse glow + edge vignette ───
  useEffect(() => {
    const canvas = gridRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let currentMouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      currentMouse = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 30;
      const dotRadius = 1;
      const glowRadius = 200;
      const cw = canvas.width;
      const ch = canvas.height;

      for (let x = 0; x < cw; x += spacing) {
        for (let y = 0; y < ch; y += spacing) {
          const dist = Math.sqrt(
            (x - currentMouse.x) ** 2 + (y - currentMouse.y) ** 2
          );
          const proximity = Math.max(0, 1 - dist / glowRadius);

          // ── Edge vignette: fade dots near edges ──
          const edgeFadeX = Math.min(x, cw - x) / (cw * 0.2);
          const edgeFadeY = Math.min(y, ch - y) / (ch * 0.2);
          const edgeFade = Math.min(1, edgeFadeX, edgeFadeY);

          const alpha = (0.08 + proximity * 0.5) * edgeFade;
          const size = dotRadius + proximity * 2;

          if (alpha < 0.005) continue; // skip invisible dots

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(109, 129, 150, ${alpha})`;
          ctx.fill();
        }
      }

      // Radial glow around cursor
      const gradient = ctx.createRadialGradient(
        currentMouse.x,
        currentMouse.y,
        0,
        currentMouse.x,
        currentMouse.y,
        glowRadius
      );
      gradient.addColorStop(0, "rgba(109, 129, 150, 0.06)");
      gradient.addColorStop(1, "rgba(109, 129, 150, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cw, ch);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

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

      // Subtitle fades in
      tl.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      );

      // Name — split text letter-by-letter reveal
      const nameEl = nameRef.current;
      if (nameEl) {
        const text = nameEl.textContent || "";
        nameEl.innerHTML = "";
        const chars = text.split("").map((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          span.style.transform = "translateY(80px) rotateX(90deg)";
          nameEl.appendChild(span);
          return span;
        });

        tl.to(
          chars,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.04,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
      }

      // Terminal line
      tl.fromTo(
        terminalRef.current,
        { width: 0, opacity: 0 },
        { width: "auto", opacity: 1, duration: 0.4 },
        "-=0.2"
      );

      // Bio line
      tl.fromTo(
        bioRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );

      // Photo scale + rotate in
      tl.fromTo(
        photoRef.current,
        { scale: 0.6, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" },
        "-=0.5"
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

      // Scroll indicator fade in
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      );

      // Continuous scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2.5,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Mouse-reactive parallax tilt on photo ───
  useEffect(() => {
    const section = sectionRef.current;
    const photo = photoRef.current;
    if (!section || !photo) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      // -0.5 to 0.5 range
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(photo, {
        rotateY: nx * 10,  // ±5°
        rotateX: -ny * 10, // ±5°
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      gsap.to(photo, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
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

    // Style the cursor
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Animated dot grid canvas ── */}
      <canvas
        ref={gridRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* ── Floating accent orbs ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
          style={{
            background: "radial-gradient(circle, #6D8196, transparent)",
            top: "10%",
            left: "-5%",
            animation: "float-orb-1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[80px]"
          style={{
            background: "radial-gradient(circle, #FFFFE3, transparent)",
            bottom: "10%",
            right: "-5%",
            animation: "float-orb-2 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.035] blur-[90px]"
          style={{
            background: "radial-gradient(circle, #6D8196, transparent)",
            top: "50%",
            right: "30%",
            animation: "float-orb-3 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Status badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5"
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

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-text-secondary font-mono text-sm tracking-[0.3em] uppercase"
              style={{ opacity: 0 }}
            >
              Hello, I&apos;m
            </p>

            {/* Name — split text animation target */}
            <h1
              ref={nameRef}
              className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-text-primary leading-[1.05] tracking-tight"
              style={{ perspective: "800px" }}
            >
              {personalInfo.name}
            </h1>

            {/* Terminal-style typed tagline */}
            <div
              ref={terminalRef}
              className="flex items-center gap-3 py-3 px-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm max-w-md overflow-hidden"
              style={{ opacity: 0 }}
            >
              <span className="text-accent font-mono text-xs select-none flex-shrink-0">
                ~/portfolio $
              </span>
              <span
                ref={taglineRef}
                className="text-text-primary font-mono text-sm"
              />
            </div>

            {/* Bio one-liner */}
            <p
              ref={bioRef}
              className="text-text-secondary/80 text-sm md:text-base max-w-md leading-relaxed"
              style={{ opacity: 0 }}
            >
              Building secure, intelligent web experiences — from AI-powered
              agents to pixel-perfect interfaces.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 pt-2">
              <MagneticButton
                href="#contact"
                className="!bg-accent !text-bg !border-accent hover:!bg-accent/90 !animate-none font-heading"
              >
                <Mail size={16} />
                Get In Touch
              </MagneticButton>
              <MagneticButton
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="!animate-none"
              >
                <Download size={16} />
                Resume
              </MagneticButton>
            </div>

            {/* Social Icons */}
            <div ref={iconsRef} className="flex gap-3 pt-2">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2.5 rounded-lg border border-border bg-card/50 hover:border-accent hover:bg-accent/10 transition-all duration-300"
              >
                <Github
                  size={18}
                  className="text-text-secondary group-hover:text-accent transition-colors duration-300"
                />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-2.5 rounded-lg border border-border bg-card/50 hover:border-accent hover:bg-accent/10 transition-all duration-300"
              >
                <Linkedin
                  size={18}
                  className="text-text-secondary group-hover:text-accent transition-colors duration-300"
                />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="group p-2.5 rounded-lg border border-border bg-card/50 hover:border-accent hover:bg-accent/10 transition-all duration-300"
              >
                <Mail
                  size={18}
                  className="text-text-secondary group-hover:text-accent transition-colors duration-300"
                />
              </a>
            </div>
          </div>

          {/* Right — Photo with parallax tilt */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={photoRef}
              id="hero-photo"
              className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-2xl border border-border/40"
              style={{
                opacity: 0,
                perspective: "800px",
                transformStyle: "preserve-3d",
                boxShadow: "0 0 40px rgba(109, 129, 150, 0.15), 0 0 80px rgba(109, 129, 150, 0.05)",
              }}
            >
              <PhotoParticles
                imageSrc="/mithilesh.jpg"
                className="w-full h-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ opacity: 0 }}
      >
        <span className="text-text-secondary/50 font-mono text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-accent/50 to-transparent" />
        <ChevronDown size={14} className="text-accent/50" />
      </div>

      {/* ── Decorative corner brackets ── */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-border/30 rounded-tl-sm z-0 hidden lg:block" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-border/30 rounded-tr-sm z-0 hidden lg:block" />
      <div className="absolute bottom-28 left-8 w-12 h-12 border-l-2 border-b-2 border-border/30 rounded-bl-sm z-0 hidden lg:block" />
      <div className="absolute bottom-28 right-8 w-12 h-12 border-r-2 border-b-2 border-border/30 rounded-br-sm z-0 hidden lg:block" />
    </section>
  );
}
