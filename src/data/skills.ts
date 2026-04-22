export interface BannerSkill {
  name: string;
  category: string;
  iconKey: string;
}

export const allSkills: BannerSkill[] = [
  { name: "Python",      category: "Languages",     iconKey: "python" },
  { name: "JavaScript",  category: "Languages",     iconKey: "javascript" },
  { name: "TypeScript",  category: "Languages",     iconKey: "typescript" },
  { name: "Java",        category: "Languages",     iconKey: "java" },
  { name: "SQL",         category: "Languages",     iconKey: "mysql" },
  { name: "HTML/CSS",    category: "Languages",     iconKey: "html5" },
  { name: "React",       category: "Frontend",      iconKey: "react" },
  { name: "Next.js",     category: "Frontend",      iconKey: "nextjs" },
  { name: "GSAP",        category: "Frontend",      iconKey: "fallback" },
  { name: "Tailwind",    category: "Frontend",      iconKey: "tailwindcss" },
  { name: "Node.js",     category: "Backend",       iconKey: "nodejs" },
  { name: "Flask",       category: "Backend",       iconKey: "flask" },
  { name: "MongoDB",     category: "Backend",       iconKey: "mongodb" },
  { name: "Burp Suite",  category: "Cybersecurity", iconKey: "fallback" },
  { name: "Nmap",        category: "Cybersecurity", iconKey: "fallback" },
  { name: "Wireshark",   category: "Cybersecurity", iconKey: "wireshark" },
  { name: "OWASP ZAP",   category: "Cybersecurity", iconKey: "fallback" },
  { name: "Gemini API",  category: "AI/ML",         iconKey: "fallback" },
  { name: "TensorFlow",  category: "AI/ML",         iconKey: "tensorflow" },
  { name: "Git",         category: "Tools",         iconKey: "git" },
  { name: "GitHub",      category: "Tools",         iconKey: "github" },
  { name: "Vercel",      category: "Tools",         iconKey: "fallback" },
  { name: "Chrome DT",   category: "Tools",         iconKey: "chrome" },
  { name: "npm",         category: "Tools",         iconKey: "npm" },
];

export const skillCategories = ["All","Languages","Frontend","Backend","Cybersecurity","AI/ML","Tools"];

export const catColors: Record<string,string> = {
  Languages:"#64B5F6", Frontend:"#81C784", Backend:"#FFB74D",
  Cybersecurity:"#EF5350", "AI/ML":"#CE93D8", Tools:"#4DB6AC",
};

export const iconUrls: Record<string,string> = {
  python:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  javascript:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  typescript:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  java:        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  mysql:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  html5:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  react:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  nextjs:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  tailwindcss: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  nodejs:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  flask:       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  mongodb:     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  wireshark:   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wireshark/wireshark-original.svg",
  tensorflow:  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  git:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  github:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  chrome:      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg",
  npm:         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
};
