import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      
      <footer className="py-8 text-center text-foreground/60 text-sm border-t border-white/5 mx-6 lg:mx-24 mb-6 relative z-10">
        <p>© {new Date().getFullYear()} Portfolio. Crafted with Next.js, Framer Motion & Three.js</p>
      </footer>
    </main>
  );
}
