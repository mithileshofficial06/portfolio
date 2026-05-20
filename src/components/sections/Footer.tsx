import { personalInfo } from "@/data/meta";

export default function Footer() {
  return (
    <footer className="relative py-8">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-text-secondary/60 font-body text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()} {personalInfo.name}
          </p>
        </div>
      </div>

      {/* Bottom spacing for NavDock */}
      <div className="h-16" />
    </footer>
  );
}
