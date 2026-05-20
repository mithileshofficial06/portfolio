"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { Mail, Linkedin, Github, FileDown } from "lucide-react";

const CONTACT_CARDS = [
  {
    label: "Email",
    value: "mithilesh.28csb@licet.ac.in",
    href: "mailto:mithilesh.28csb@licet.ac.in",
    icon: Mail,
    download: false,
  },
  {
    label: "LinkedIn",
    value: "in/mithilesh06",
    href: "https://www.linkedin.com/in/mithilesh06/",
    icon: Linkedin,
    download: false,
  },
  {
    label: "GitHub",
    value: "mithileshofficial06",
    href: "https://github.com/mithileshofficial06",
    icon: Github,
    download: false,
  },
  {
    label: "Resume",
    value: "Download Resume",
    href: "/api/resume",
    icon: FileDown,
    download: true,
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        gridRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative" style={{ padding: "100px 0" }}>
      {/* Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-[900px] mx-auto px-6">
        {/* ═══ Header ═══ */}
        <div ref={headerRef} className="text-center mb-16" style={{ opacity: 0 }}>
          <p
            className="font-mono uppercase mb-3"
            style={{ color: "#CCFF00", fontSize: "11px", letterSpacing: "0.15em" }}
          >
            Let&apos;s Connect
          </p>
          <h2
            className="font-heading font-bold text-5xl lg:text-6xl"
            style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Get In Touch
          </h2>
        </div>

        {/* ═══ 2×2 Grid ═══ */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ opacity: 0 }}>
          {CONTACT_CARDS.map((card) => {
            const cardContent = (
              <>
                <div
                  className="flex-shrink-0 p-3 rounded-lg transition-colors duration-300"
                  style={{ backgroundColor: "rgba(204,255,0,0.08)" }}
                >
                  <card.icon size={22} style={{ color: "#CCFF00" }} />
                </div>
                <div>
                  <p
                    className="font-mono uppercase text-[10px] tracking-[0.15em] mb-1"
                    style={{ color: "#666" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-sm font-body group-hover:text-[#CCFF00] transition-colors duration-300"
                    style={{ color: "#FFFFFF" }}
                  >
                    {card.value}
                  </p>
                </div>
              </>
            );

            const sharedClass = "group flex items-center gap-5 p-6 rounded-xl transition-all duration-300 cursor-pointer";
            const sharedStyle = {
              backgroundColor: "#111111",
              border: "1px solid rgba(255,255,255,0.06)",
            };
            const onEnter = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.borderColor = "rgba(204,255,0,0.4)";
              e.currentTarget.style.transform = "scale(1.02)";
            };
            const onLeave = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.transform = "scale(1)";
            };

            if (card.download) {
              return (
                <a
                  key={card.label}
                  href={card.href}
                  className={sharedClass}
                  style={sharedStyle}
                  onMouseEnter={onEnter}
                  onMouseLeave={onLeave}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <a
                key={card.label}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={sharedClass}
                style={sharedStyle}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                {cardContent}
              </a>
            );
          })}
        </div>

        {/* ═══ Bottom text ═══ */}
        <p
          className="text-center mt-12 font-mono text-xs"
          style={{ color: "#555" }}
        >
          Based in Chennai, India — open to remote & on-site opportunities
        </p>
      </div>
    </section>
  );
}
