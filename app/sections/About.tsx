"use client";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { SectionHeading } from "@/app/components/SectionHeading";

export default function About() {
  return (
    <section id="about" className="py-24 relative max-w-7xl mx-auto px-6">
      <SectionHeading title="About Me" subtitle="A brief introduction to who I am and what I do." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden glass border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/20 to-accent-purple/20 mix-blend-overlay" />
          <div className="w-full h-full bg-foreground/5">
            <img src="/Myself.png" alt="Parth Makwana" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Building with <span className="text-gradient">Logic</span>
          </h3>
          <div className="space-y-4 text-foreground/70 text-lg leading-relaxed mb-8">
            <p>
              I am a passionate Backend Developer who enjoys designing scalable systems, efficient APIs, and robust server-side architectures.
              My journey started with a curiosity about how data flows behind the scenes, which quickly evolved into a deep focus on building reliable and high-performance applications.
            </p>
            <p>
              I focus on creating clean, maintainable code and optimizing performance, ensuring that systems are secure, scalable, and able to handle real-world demands without compromise.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { label: "Years Experience", value: "3+" },
              { label: "Projects Completed", value: "40+" },
              { label: "Happy Clients", value: "25+" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-extrabold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs text-foreground/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <motion.a
            href="/Parth Makwana.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-colors border border-white/10 text-sm font-semibold tracking-wide w-fit"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
