"use client";
import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import Hero3D from "@/app/components/3d/Hero3D";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <Hero3D />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.div
            className="inline-block glass px-4 py-2 rounded-full mb-6 border border-accent-cyan/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-sm font-medium text-foreground/80 tracking-wide">Available for new opportunities</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Building digital <br className="hidden md:block" />
            experience with <span className="text-gradient">precision</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/60 mb-10 max-w-2xl leading-relaxed">
            Backend Developer focused on scalable architectures, efficient APIs, and high-performance systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.a
              href="#projects"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-semibold rounded-full overflow-hidden transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View My Work</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 glass text-foreground font-semibold rounded-full transition-colors hover:bg-white/10 hover:border-accent-purple/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <a href="#about" className="flex flex-col items-center gap-2 text-foreground/50 hover:text-accent-cyan transition-colors">
          <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
          <ArrowDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
}
