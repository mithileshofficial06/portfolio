"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.1,
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

  const getBadgeStyles = (badge?: string): string => {
    switch (badge) {
      case "In Dev":
        return "text-accent border-accent/50 bg-accent/10";
      case "Freelance":
        return "text-[#C9A84C] border-[#C9A84C]/50 bg-[#C9A84C]/10";
      case "Social Impact":
        return "text-emerald-400 border-emerald-400/50 bg-emerald-400/10";
      case "Cybersecurity":
        return "text-red-400 border-red-400/50 bg-red-400/10";
      case "ML":
        return "text-purple-400 border-purple-400/50 bg-purple-400/10";
      case "Full Stack":
        return "text-sky-400 border-sky-400/50 bg-sky-400/10";
      default:
        return "text-accent border-accent/50 bg-accent/10";
    }
  };

  return (
    <section ref={sectionRef} id="projects" className="py-24 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-2">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-text-secondary font-body max-w-xl mx-auto">
            A selection of projects I&apos;ve built — from AI agents to security scanners, 
            each solving a real-world problem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group relative rounded-xl bg-card border border-border overflow-hidden hover:border-accent/40 transition-all duration-500"
              style={{ opacity: 0 }}
            >
              {/* Top accent line */}
              <div
                className={cn(
                  "h-0.5 w-full transition-all duration-500 group-hover:opacity-100 opacity-50",
                  project.badge === "Freelance"
                    ? "bg-gradient-to-r from-[#C9A84C]/50 via-[#C9A84C] to-[#C9A84C]/50"
                    : project.badge === "Social Impact"
                    ? "bg-gradient-to-r from-emerald-400/50 via-emerald-400 to-emerald-400/50"
                    : project.badge === "Cybersecurity"
                    ? "bg-gradient-to-r from-red-400/50 via-red-400 to-red-400/50"
                    : project.badge === "ML"
                    ? "bg-gradient-to-r from-purple-400/50 via-purple-400 to-purple-400/50"
                    : "bg-gradient-to-r from-accent/50 via-accent to-accent/50"
                )}
              />

              <div className="p-6">
                {/* Badge + Links row */}
                <div className="flex items-center justify-between mb-4">
                  {project.badge && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border",
                        getBadgeStyles(project.badge)
                      )}
                    >
                      {project.badge === "In Dev" && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                        </span>
                      )}
                      {project.badge}
                    </span>
                  )}

                  <div className="flex gap-2 ml-auto">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                      data-hover
                    >
                      <Github size={15} />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-text-secondary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                      data-hover
                    >
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-heading font-bold text-text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary font-body text-sm leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-bg border border-border text-text-secondary
                        group-hover:border-accent/30 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                style={{ boxShadow: "inset 0 0 60px rgba(109, 129, 150, 0.05)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
