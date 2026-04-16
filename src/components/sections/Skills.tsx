"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/utils";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!tagsContainerRef.current) return;

    const tags = tagsContainerRef.current.querySelectorAll(".skill-tag");
    gsap.fromTo(
      tags,
      { scale: 0.8, opacity: 0, y: 12 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: "back.out(1.7)",
      }
    );
  }, [activeTab]);

  // Section header animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skills-header",
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-24 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        <div className="skills-header mb-12 text-center" style={{ opacity: 0 }}>
          <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-2">
            Expertise
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Skills & Technologies
          </h2>
          <p className="text-text-secondary font-body max-w-lg mx-auto">
            Technologies I work with across development, security, and AI.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {skillCategories.map((cat, i) => (
            <button
              key={cat.category}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 border relative overflow-hidden",
                activeTab === i
                  ? "bg-accent/15 border-accent text-text-primary shadow-[0_0_12px_rgba(109,129,150,0.15)]"
                  : "bg-card border-border text-text-secondary hover:border-accent/50 hover:text-text-primary"
              )}
              data-hover
            >
              {cat.category}
              {activeTab === i && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        {/* Skills Tags */}
        <div
          ref={tagsContainerRef}
          className="flex flex-wrap justify-center gap-3 min-h-[120px] items-start"
        >
          {skillCategories[activeTab]?.skills.map((skill) => (
            <span
              key={skill.name}
              className="skill-tag px-5 py-2.5 rounded-xl text-sm font-mono border border-border bg-card text-text-secondary
                hover:bg-accent/15 hover:text-text-primary hover:border-accent hover:shadow-[0_0_16px_rgba(109,129,150,0.12)]
                transition-all duration-300 cursor-default"
              style={{ opacity: 0 }}
            >
              {skill.name}
            </span>
          ))}
        </div>

        {/* Category count indicator */}
        <div className="mt-8 text-center">
          <span className="text-text-secondary/40 font-mono text-xs">
            {skillCategories[activeTab]?.skills.length} skills in{" "}
            {skillCategories[activeTab]?.category}
          </span>
        </div>
      </div>
    </section>
  );
}
