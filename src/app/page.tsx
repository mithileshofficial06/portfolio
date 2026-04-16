import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Hackathons from "@/components/sections/Hackathons";
import WhyMe from "@/components/sections/WhyMe";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Hackathons />
      <WhyMe />
      <Contact />
      <Footer />
    </main>
  );
}
