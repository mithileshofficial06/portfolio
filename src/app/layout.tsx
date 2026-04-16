import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import NavDock from "@/components/ui/NavDock";
import SmoothScroller from "@/components/layout/SmoothScroller";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mithilesh KS — Full Stack Developer | Cybersecurity | AI",
  description:
    "Portfolio of Mithilesh KS — Aspiring Full Stack Developer, Cybersecurity Enthusiast, and AI Builder based in Chennai, India. B.E. CSE student at LICET.",
  keywords: [
    "Mithilesh KS",
    "Full Stack Developer",
    "Cybersecurity",
    "AI Builder",
    "Portfolio",
    "Chennai",
    "LICET",
    "Next.js",
  ],
  authors: [{ name: "Mithilesh KS" }],
  openGraph: {
    title: "Mithilesh KS — Full Stack Developer | Cybersecurity | AI",
    description:
      "Aspiring Full Stack Developer, Cybersecurity Enthusiast, and AI Builder. B.E. CSE at LICET Chennai.",
    url: "https://mithileshks.dev",
    siteName: "Mithilesh KS Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mithilesh KS Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mithilesh KS — Full Stack Developer | Cybersecurity | AI",
    description:
      "Aspiring Full Stack Developer, Cybersecurity Enthusiast, and AI Builder.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mithilesh KS",
  url: "https://mithileshks.dev",
  jobTitle: "Aspiring Full Stack Developer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Loyola-ICAM College of Engineering and Technology",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/mithileshofficial06",
    "https://linkedin.com/in/mithilesh06/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="cursor-none">
        <SmoothScroller>
          <CustomCursor />
          <ScrollProgress />
          {children}
          <NavDock />
        </SmoothScroller>
      </body>
    </html>
  );
}
