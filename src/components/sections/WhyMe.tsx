"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Code2, Shield, Trophy, Users } from "lucide-react";

const STATS = [
  { icon: Trophy, label: "Hackathons", end: 5, suffix: "+" },
  { icon: Code2, label: "Projects Built", end: 7, suffix: "+" },
  { icon: Shield, label: "Certifications", end: 2, suffix: "" },
  { icon: Users, label: "Client Projects", end: 1, suffix: "" },
];

const PILLARS = [
  {
    title: "Build",
    description:
      "I build full stack applications that solve real-world problems — from AI agents to vaccination trackers.",
    icon: Code2,
    gradient: "from-sky-500/20 to-sky-500/5",
  },
  {
    title: "Secure",
    description:
      "I hunt vulnerabilities with Burp Suite, Nmap, and Metasploit. Security isn't an afterthought — it's baked in.",
    icon: Shield,
    gradient: "from-red-500/20 to-red-500/5",
  },
  {
    title: "Ship",
    description:
      "From hackathon prototypes to freelance client sites, I ship production-ready code that performs.",
    icon: Trophy,
    gradient: "from-accent/20 to-accent/5",
  },
];

export default function WhyMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<HTMLSpanElement[]>([]);
  const pillarRefs = useRef<HTMLDivElement[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      // CountTo animations
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i].end;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });

      // Pillar card animations
      pillarRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-me" className="py-24 relative overflow-hidden">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div ref={headerRef} className="mb-16 text-center" style={{ opacity: 0 }}>
          <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-2">
            The Numbers
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Why Work With Me
          </h2>
          <p className="text-text-secondary font-body max-w-lg mx-auto">
            Results speak louder than words. Here&apos;s what I&apos;ve accomplished so far.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-accent/10 w-fit mx-auto mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                <stat.icon size={24} className="text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-1">
                <span
                  ref={(el) => {
                    if (el) counterRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="text-text-secondary font-body text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              ref={(el) => {
                if (el) pillarRefs.current[i] = el;
              }}
              className="group relative p-8 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-500 overflow-hidden"
              style={{ opacity: 0 }}
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${pillar.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-accent/10 w-fit mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                  <pillar.icon size={22} className="text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="text-text-secondary font-body text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
