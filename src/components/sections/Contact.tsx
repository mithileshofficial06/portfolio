"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { personalInfo, socialLinks } from "@/data/meta";
import { Send, CheckCircle, Loader2, Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

type FormState = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<FormState>("idle");

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
        contentRef.current,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setFormState("sending");

    const formData = new FormData(formRef.current);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormState("success");
        formRef.current.reset();
        setTimeout(() => setFormState("idle"), 3000);
      } else {
        setFormState("error");
        setTimeout(() => setFormState("idle"), 3000);
      }
    } catch {
      setFormState("error");
      setTimeout(() => setFormState("idle"), 3000);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "github": return <Github size={18} />;
      case "linkedin": return <Linkedin size={18} />;
      case "mail": return <Mail size={18} />;
      default: return null;
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="py-24 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div ref={headerRef} className="mb-16 text-center" style={{ opacity: 0 }}>
          <p className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-2">
            Let&apos;s Connect
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Get In Touch
          </h2>
          <p className="text-text-secondary font-body max-w-lg mx-auto">
            Have a project in mind, want to collaborate, or just say hello?
            I&apos;d love to hear from you.
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-[1fr_1.3fr] gap-10" style={{ opacity: 0 }}>
          {/* Left — Contact info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300"
                data-hover
              >
                <div className="p-2.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">Email</p>
                  <p className="text-text-primary text-sm font-body">{personalInfo.email}</p>
                </div>
              </a>

              <a
                href={`tel:${personalInfo.phone}`}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/40 transition-all duration-300"
                data-hover
              >
                <div className="p-2.5 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <Phone size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">Phone</p>
                  <p className="text-text-primary text-sm font-body">{personalInfo.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                <div className="p-2.5 rounded-lg bg-accent/10">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-text-secondary text-xs font-mono uppercase tracking-wider">Location</p>
                  <p className="text-text-primary text-sm font-body">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl border border-border bg-card hover:border-accent hover:bg-accent/10 transition-all duration-300"
                  data-hover
                  aria-label={link.name}
                >
                  <span className="text-text-secondary group-hover:text-accent transition-colors duration-300">
                    {getIconComponent(link.icon)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="floating-label-group">
              <input
                type="text"
                name="name"
                id="contact-name"
                placeholder=" "
                required
                autoComplete="name"
              />
              <label htmlFor="contact-name">Your Name</label>
            </div>

            <div className="floating-label-group">
              <input
                type="email"
                name="email"
                id="contact-email"
                placeholder=" "
                required
                autoComplete="email"
              />
              <label htmlFor="contact-email">Your Email</label>
            </div>

            <div className="floating-label-group">
              <textarea
                name="message"
                id="contact-message"
                placeholder=" "
                required
                rows={5}
                style={{ resize: "vertical" }}
              />
              <label htmlFor="contact-message">Your Message</label>
            </div>

            <button
              type="submit"
              disabled={formState === "sending"}
              className="w-full py-4 rounded-xl font-heading font-bold text-sm tracking-wider uppercase
                bg-accent text-bg hover:bg-accent/90 transition-all duration-300 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:shadow-[0_0_24px_rgba(109,129,150,0.3)]"
              data-hover
            >
              {formState === "idle" && (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
              {formState === "sending" && (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              )}
              {formState === "success" && (
                <>
                  <CheckCircle size={16} />
                  Message Sent!
                </>
              )}
              {formState === "error" && (
                <>
                  <Send size={16} />
                  Failed — Try Again
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
