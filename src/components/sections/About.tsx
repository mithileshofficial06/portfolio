"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Image from "next/image";
import { personalInfo } from "@/data/meta";
import { GraduationCap, Award, MapPin, Code2 } from "lucide-react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Photo slide in from left
      gsap.fromTo(
        photoContainerRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );

      // Content slide in from right
      gsap.fromTo(
        contentRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );

      // Stats stagger
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 relative">
      {/* Section divider gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-2">
            About Me
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary">
            Who I Am
          </h2>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left — Photo + quick stats */}
          <div ref={photoContainerRef} className="space-y-6" style={{ opacity: 0 }}>
            {/* Photo with accent border */}
            <div className="relative mx-auto lg:mx-0 w-72 h-72 md:w-80 md:h-80">
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-accent/40 via-transparent to-accent/20" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/mithilesh.jpg"
                  alt="Mithilesh KS"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
              </div>
            </div>

            {/* Quick info cards */}
            <div ref={statsRef} className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0" />
                <span className="text-text-secondary text-xs font-body">Chennai, India</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
                <GraduationCap size={16} className="text-accent flex-shrink-0" />
                <span className="text-text-secondary text-xs font-body">B.E. CSE &apos;28</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
                <Code2 size={16} className="text-accent flex-shrink-0" />
                <span className="text-text-secondary text-xs font-body">7+ Projects</span>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
                <Award size={16} className="text-accent flex-shrink-0" />
                <span className="text-text-secondary text-xs font-body">2 Certifications</span>
              </div>
            </div>
          </div>

          {/* Right — Bio + details */}
          <div ref={contentRef} className="space-y-6" style={{ opacity: 0 }}>
            <p className="text-text-secondary font-body leading-relaxed text-lg">
              {personalInfo.bio}
            </p>

            {/* Education */}
            <div className="p-5 rounded-xl bg-card border border-border hover:border-accent/40 transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <GraduationCap size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-text-primary font-heading font-bold text-sm mb-1">
                    Education
                  </h3>
                  <p className="text-text-secondary font-body text-sm">{personalInfo.education}</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-3">
              <h3 className="text-text-primary font-heading font-bold text-sm flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Award size={16} className="text-accent" />
                </div>
                Certifications
              </h3>
              <div className="space-y-2">
                {personalInfo.certifications.map((cert, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-accent group-hover:shadow-[0_0_8px_rgba(109,129,150,0.6)] transition-shadow duration-300 flex-shrink-0" />
                    <span className="text-text-secondary font-body text-sm group-hover:text-text-primary transition-colors duration-300">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
