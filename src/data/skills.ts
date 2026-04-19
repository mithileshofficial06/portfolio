export interface RopeSkill {
  name: string;
  emoji: string;
  category: string;
  ropeX: number;
}

export const ropeSkills: RopeSkill[] = [
  // Languages
  { name: "Python",      emoji: "🐍", category: "Languages",     ropeX: 30  },
  { name: "JavaScript",  emoji: "⚡", category: "Languages",     ropeX: 90  },
  { name: "TypeScript",  emoji: "🔷", category: "Languages",     ropeX: 150 },
  { name: "Java",        emoji: "☕", category: "Languages",     ropeX: 210 },
  { name: "SQL",         emoji: "🗄️", category: "Languages",     ropeX: 260 },
  { name: "HTML/CSS",    emoji: "🌐", category: "Languages",     ropeX: 315 },
  // Frontend
  { name: "React",       emoji: "⚛️", category: "Frontend",      ropeX: 370 },
  { name: "Next.js",     emoji: "🔺", category: "Frontend",      ropeX: 420 },
  { name: "GSAP",        emoji: "🎯", category: "Frontend",      ropeX: 470 },
  { name: "Tailwind",    emoji: "💨", category: "Frontend",      ropeX: 520 },
  // Backend
  { name: "Node.js",     emoji: "🟢", category: "Backend",       ropeX: 570 },
  { name: "Flask",       emoji: "🌶️", category: "Backend",       ropeX: 615 },
  // Cybersecurity
  { name: "Burp Suite",  emoji: "🔒", category: "Cybersecurity", ropeX: 660 },
  { name: "Nmap",        emoji: "🗺️", category: "Cybersecurity", ropeX: 705 },
  { name: "Wireshark",   emoji: "🦈", category: "Cybersecurity", ropeX: 750 },
  { name: "OWASP ZAP",   emoji: "🛡️", category: "Cybersecurity", ropeX: 795 },
  // AI/ML
  { name: "Gemini API",  emoji: "🤖", category: "AI/ML",         ropeX: 840 },
  { name: "TensorFlow",  emoji: "🧠", category: "AI/ML",         ropeX: 890 },
  // Tools
  { name: "Git",         emoji: "🐙", category: "Tools",         ropeX: 935 },
  { name: "Vercel",      emoji: "▲",  category: "Tools",         ropeX: 980 },
  { name: "MongoDB",     emoji: "🍃", category: "Tools",         ropeX: 1030 },
];

export const skillCategories = [
  "All", "Languages", "Frontend", "Backend", "Cybersecurity", "AI/ML", "Tools",
];
