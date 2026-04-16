"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { hackathons } from "@/data/hackathons";
import { cn } from "@/lib/utils";
import { Trophy, MapPin, Calendar, Zap } from "lucide-react";

export default function Hackathons() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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

      // Card animations
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const isLeft = i % 2 === 0;

        gsap.fromTo(
          card,
          { x: isLeft ? -50 : 50, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Dot fill animations
      dotsRef.current.forEach((dot) => {
        if (!dot) return;
        gsap.fromTo(
          dot,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
              trigger: dot,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hackathons" className="py-24 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        <div ref={headerRef} className="mb-16 text-center" style={{ opacity: 0 }}>
          <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-2">
            Competitions
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Hackathon Journey
          </h2>
          <p className="text-text-secondary font-body max-w-lg mx-auto">
            From campus hackathons to international demos — my competitive coding journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line — gradient glow */}
          <div
            className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 h-full w-[2px] hidden md:block"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--color-accent), var(--color-accent), transparent)",
              boxShadow: "0 0 8px rgba(109, 129, 150, 0.3)",
            }}
          />
          <div
            className="absolute left-6 top-0 h-full w-[2px] md:hidden"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--color-accent), var(--color-accent), transparent)",
            }}
          />

          <div className="space-y-10">
            {hackathons.map((hack, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={hack.id}
                  className={cn(
                    "relative flex items-center",
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Timeline dot */}
                  <div
                    ref={(el) => {
                      if (el) dotsRef.current[index] = el;
                    }}
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 border-2 border-accent"
                    style={{
                      transform: "scale(0)",
                      backgroundColor: "var(--color-accent)",
                      boxShadow: "0 0 10px rgba(109, 129, 150, 0.5)",
                    }}
                  />

                  {/* Card */}
                  <div
                    ref={(el) => {
                      if (el) cardsRef.current[index] = el;
                    }}
                    className={cn(
                      "ml-14 md:ml-0 md:w-[44%] p-5 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300 group",
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    )}
                    style={{ opacity: 0 }}
                  >
                    {/* Year + Hackathon name */}
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={13} className="text-accent" />
                      <span className="text-accent font-mono text-xs font-medium">
                        {hack.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-text-primary mb-1 group-hover:text-accent transition-colors duration-300">
                      {hack.name}
                    </h3>

                    <p className="text-text-secondary font-body text-sm flex items-center gap-1.5 mb-3">
                      <MapPin size={12} className="flex-shrink-0" />
                      {hack.organizer}
                    </p>

                    {/* Achievement badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 group-hover:border-accent/60 transition-colors duration-300">
                      <Trophy size={13} className="text-accent" />
                      <span className="text-xs font-mono text-accent font-medium">
                        {hack.achievement}
                      </span>
                    </div>

                    {hack.project && (
                      <p className="text-text-secondary font-body text-xs mt-3 flex items-center gap-1.5">
                        <Zap size={11} className="text-accent" />
                        Project: <span className="text-text-primary font-medium">{hack.project}</span>
                      </p>
                    )}
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
