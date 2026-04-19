"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { Project } from "@/types";
import {
  FolderOpen,
  Folder,
  Github,
  ExternalLink,
  X,
  Maximize2,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// ─── Badge colour map ───────────────────────────────────────────────────────
const badgeColor: Record<string, { text: string; border: string; bg: string }> = {
  "In Dev":        { text: "#6D8196", border: "rgba(109,129,150,0.5)", bg: "rgba(109,129,150,0.1)" },
  Freelance:       { text: "#C9A84C", border: "rgba(201,168,76,0.5)",  bg: "rgba(201,168,76,0.1)" },
  "Social Impact": { text: "#34d399", border: "rgba(52,211,153,0.5)",  bg: "rgba(52,211,153,0.1)" },
  Cybersecurity:   { text: "#f87171", border: "rgba(248,113,113,0.5)", bg: "rgba(248,113,113,0.1)" },
  ML:              { text: "#a78bfa", border: "rgba(167,139,250,0.5)", bg: "rgba(167,139,250,0.1)" },
  "Full Stack":    { text: "#38bdf8", border: "rgba(56,189,248,0.5)",  bg: "rgba(56,189,248,0.1)" },
};

// ─── Traffic lights ─────────────────────────────────────────────────────────
function TrafficLights({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClose}
        className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
        style={{ backgroundColor: "#FF5F57" }}
        aria-label="Close"
      />
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
    </div>
  );
}

// ─── Project detail panel content (shared between explorer + floating) ─────
function ProjectContent({ project }: { project: Project }) {
  const bc = badgeColor[project.badge || ""] || badgeColor["In Dev"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3 }}
      className="p-6 h-full"
      style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        overflowY: "auto",
        overscrollBehavior: "contain",
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Badge */}
      {project.badge && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] mb-4"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: bc.text,
            border: `1px solid ${bc.border}`,
            backgroundColor: bc.bg,
          }}
        >
          {project.badge === "In Dev" && (
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                style={{ backgroundColor: bc.text }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ backgroundColor: bc.text }}
              />
            </span>
          )}
          {project.badge}
        </span>
      )}

      {/* Title */}
      <h3
        className="text-[28px] font-bold mb-2"
        style={{
          fontFamily: "var(--font-space-grotesk), sans-serif",
          color: "#FFFFE3",
        }}
      >
        {project.name}
      </h3>

      {/* One-liner */}
      <p
        className="text-sm leading-relaxed mb-5"
        style={{ color: "#CBCBCB" }}
      >
        {project.description.split(".")[0]}.
      </p>

      {/* Metadata terminal block */}
      <div
        className="rounded-lg p-4 mb-5 text-xs leading-[1.9] whitespace-pre"
        style={{
          backgroundColor: "#141414",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          color: "#CBCBCB",
        }}
      >
        <span style={{ color: "#6D8196" }}>&gt; type:</span>
        {"        "}
        {project.type}
        {"\n"}
        <span style={{ color: "#6D8196" }}>&gt; stack:</span>
        {"       "}
        {project.stack.join(" · ")}
        {"\n"}
        <span style={{ color: "#6D8196" }}>&gt; status:</span>
        {"      "}
        <span
          style={{
            color:
              project.status === "Live"
                ? "#34d399"
                : project.status === "In Development"
                ? "#FFBD2E"
                : "#CBCBCB",
          }}
        >
          {project.status}
        </span>
        {"\n"}
        <span style={{ color: "#6D8196" }}>&gt; impact:</span>
        {"      "}
        {project.impact}
      </div>

      {/* Full description */}
      <p
        className="text-sm mb-6"
        style={{ color: "#CBCBCB", lineHeight: 1.7 }}
      >
        {project.description}
      </p>

      {/* Tech tags */}
      <motion.div className="flex flex-wrap gap-2 mb-6">
        {project.stack.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className="px-3 py-1.5 rounded-md text-xs"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "#6D8196",
              border: "1px solid rgba(109,129,150,0.2)",
              backgroundColor: "rgba(109,129,150,0.1)",
            }}
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors duration-200"
            style={{
              border: "1px solid rgba(109,129,150,0.4)",
              backgroundColor: "rgba(109,129,150,0.1)",
              color: "#FFFFE3",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(109,129,150,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(109,129,150,0.1)")
            }
          >
            <Github size={15} />
            Open GitHub
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-colors duration-200"
            style={{
              border: "1px solid rgba(109,129,150,0.55)",
              backgroundColor: "rgba(109,129,150,0.1)",
              color: "#FFFFE3",
              fontFamily: "var(--font-inter), sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(109,129,150,0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(109,129,150,0.1)")
            }
          >
            <ExternalLink size={15} />
            Live Preview
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Floating draggable window ──────────────────────────────────────────────
function FloatingWindow({
  project,
  onClose,
  zIndex,
  onFocus,
  offsetIndex,
}: {
  project: Project;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  offsetIndex: number;
}) {
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const posInitialized = useRef(false);

  // Use document-level listeners for reliable drag even when cursor leaves the title bar
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging.current || !windowRef.current) return;
      e.preventDefault();
      const x = e.clientX - dragOffset.current.x;
      const y = e.clientY - dragOffset.current.y;
      windowRef.current.style.left = `${x}px`;
      windowRef.current.style.top = `${y}px`;
    };

    const handleUp = () => {
      isDragging.current = false;
    };

    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleUp);
    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handleTitlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Ignore if clicking the close button
      if ((e.target as HTMLElement).closest("button")) return;
      onFocus();
      isDragging.current = true;
      const el = windowRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [onFocus]
  );

  // Stagger initial position so multiple windows don't stack exactly
  const initialLeft = `calc(50% - 300px + ${offsetIndex * 30}px)`;
  const initialTop = `calc(50% - 250px + ${offsetIndex * 30}px)`;

  return (
    <motion.div
      ref={windowRef}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed"
      style={{
        top: posInitialized.current ? undefined : initialTop,
        left: posInitialized.current ? undefined : initialLeft,
        width: "min(600px, 90vw)",
        height: "min(500px, 70vh)",
        backgroundColor: "#1e1e1e",
        border: "1px solid #3a3a3a",
        borderRadius: 10,
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(109,129,150,0.1)",
        zIndex,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onPointerDown={onFocus}
    >
      {/* Title bar (draggable) */}
      <div
        className="flex items-center justify-between px-4 py-2.5 select-none"
        style={{
          backgroundColor: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          cursor: "grab",
          touchAction: "none",
        }}
        onPointerDown={handleTitlePointerDown}
      >
        <span
          className="text-xs truncate"
          style={{
            fontFamily: "var(--font-jetbrains-mono), monospace",
            color: "#CBCBCB",
          }}
        >
          {project.name}
        </span>
        <TrafficLights onClose={onClose} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ProjectContent project={project} />
      </div>
    </motion.div>
  );
}

// ─── Main Projects section ──────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState<number | null>(projects[0]?.id ?? null);
  const [floatingWindows, setFloatingWindows] = useState<number[]>([]);
  const [topZ, setTopZ] = useState(1000);
  const [windowZMap, setWindowZMap] = useState<Record<number, number>>({});

  const selectedProject = projects.find((p) => p.id === selectedId) || null;

  // ── GSAP scroll-triggered entrance ──
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
        explorerRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Pop out handler ──
  const popOut = useCallback(
    (id: number) => {
      if (!floatingWindows.includes(id)) {
        const nextZ = topZ + 1;
        setFloatingWindows((prev) => [...prev, id]);
        setWindowZMap((prev) => ({ ...prev, [id]: nextZ }));
        setTopZ(nextZ);
      }
    },
    [floatingWindows, topZ]
  );

  const closeFloating = useCallback((id: number) => {
    setFloatingWindows((prev) => prev.filter((w) => w !== id));
  }, []);

  const focusWindow = useCallback(
    (id: number) => {
      const nextZ = topZ + 1;
      setWindowZMap((prev) => ({ ...prev, [id]: nextZ }));
      setTopZ(nextZ);
    },
    [topZ]
  );

  return (
    <>
      <section ref={sectionRef} id="projects" className="py-24 relative">
        {/* Section divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="max-w-[1100px] mx-auto px-6">
          {/* Header */}
          <div
            ref={headerRef}
            className="mb-12 text-center"
            style={{ opacity: 0 }}
          >
            <p
              className="text-sm tracking-[0.3em] uppercase mb-2"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "#6D8196",
              }}
            >
              Portfolio
            </p>
            <h2
              className="text-3xl md:text-5xl font-bold mb-3"
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                color: "#FFFFE3",
              }}
            >
              Featured Projects
            </h2>
            <p className="text-sm" style={{ color: "#CBCBCB" }}>
              Click to explore. Pop out to compare.
            </p>
          </div>

          {/* Explorer window */}
          <div
            ref={explorerRef}
            className="overflow-hidden"
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              opacity: 0,
              height: 520,
            }}
          >
            {/* ── Title bar ── */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                backgroundColor: "#1a1a1a",
                borderBottom: "1px solid #2a2a2a",
              }}
            >
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#6D8196",
                }}
              >
                ~/mithilesh/projects
              </span>
              <TrafficLights />
            </div>

            {/* ── Two-panel body ── */}
            <div className="flex" style={{ height: "calc(100% - 40px)" }}>
              {/* LEFT SIDEBAR */}
              <div
                className="flex-shrink-0 overflow-y-auto"
                style={{
                  width: 280,
                  backgroundColor: "#1a1a1a",
                  borderRight: "1px solid #2a2a2a",
                }}
              >
                {/* Explorer header */}
                <div
                  className="px-4 py-3"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "#6D8196",
                    textTransform: "uppercase",
                  }}
                >
                  Explorer
                </div>

                {/* File list */}
                {projects.map((p) => {
                  const isActive = selectedId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className="w-full flex items-center gap-3 text-left transition-colors duration-150 relative"
                      style={{
                        padding: "10px 16px",
                        backgroundColor: isActive
                          ? "rgba(109,129,150,0.15)"
                          : "transparent",
                        color: isActive ? "#FFFFE3" : "#CBCBCB",
                        fontSize: 13,
                        fontFamily: "var(--font-inter), sans-serif",
                        borderLeft: isActive
                          ? "2px solid #6D8196"
                          : "2px solid transparent",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(109,129,150,0.1)";
                          e.currentTarget.style.color = "#FFFFE3";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#CBCBCB";
                        }
                      }}
                    >
                      {isActive ? (
                        <FolderOpen size={16} style={{ color: "#6D8196", flexShrink: 0 }} />
                      ) : (
                        <Folder size={16} style={{ color: "#6D8196", flexShrink: 0 }} />
                      )}
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* RIGHT PREVIEW PANEL */}
              <div
                className="flex-1 flex flex-col min-w-0"
                style={{ backgroundColor: "#1e1e1e" }}
              >
                {/* Tab bar */}
                {selectedProject && (
                  <div
                    className="flex items-center"
                    style={{ borderBottom: "1px solid #2a2a2a" }}
                  >
                    <div
                      className="flex items-center gap-2 px-5 py-2"
                      style={{
                        backgroundColor: "#232323",
                        borderBottom: "2px solid #6D8196",
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 12,
                        color: "#FFFFE3",
                      }}
                    >
                      <span className="truncate">{selectedProject.name}</span>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="ml-1 rounded p-0.5 transition-colors hover:bg-white/10"
                        style={{ color: "#6D8196" }}
                      >
                        <X size={12} />
                      </button>
                    </div>

                    {/* Pop out button */}
                    <button
                      onClick={() => popOut(selectedProject.id)}
                      className="ml-auto mr-3 p-1.5 rounded transition-colors hover:bg-white/10"
                      style={{ color: "#6D8196" }}
                      title="Pop out"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                )}

                {/* Panel content */}
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {selectedProject ? (
                      <ProjectContent
                        key={selectedProject.id}
                        project={selectedProject}
                      />
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center gap-4"
                      >
                        <Folder size={48} style={{ color: "#2a2a2a" }} />
                        <p
                          className="italic text-sm"
                          style={{
                            fontFamily:
                              "var(--font-jetbrains-mono), monospace",
                            color: "#3a3a3a",
                          }}
                        >
                          Select a project to view details
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating windows portal ── */}
      <AnimatePresence>
      {floatingWindows.map((id, i) => {
          const p = projects.find((pr) => pr.id === id);
          if (!p) return null;
          return (
            <FloatingWindow
              key={id}
              project={p}
              zIndex={windowZMap[id] || 1000}
              onClose={() => closeFloating(id)}
              onFocus={() => focusWindow(id)}
              offsetIndex={i}
            />
          );
        })}
      </AnimatePresence>
    </>
  );
}
