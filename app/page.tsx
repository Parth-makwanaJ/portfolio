import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Skills from "@/app/sections/Skills";
import Experience from "@/app/sections/Experience";
import Projects from "@/app/sections/Projects";
import Contact from "@/app/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      
      <footer className="py-8 text-center text-foreground/40 text-sm border-t border-white/5 mx-6 lg:mx-24 mb-6 relative z-10">
        <p>© {new Date().getFullYear()} Portfolio. Crafted with Next.js, Framer Motion & Three.js</p>
      </footer>
    </main>
  );
}
