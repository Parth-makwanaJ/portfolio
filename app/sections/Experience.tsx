"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/app/components/SectionHeading";
import { experiences } from "@/app/lib/data";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 relative max-w-7xl mx-auto px-6">
      <SectionHeading title="Work Experience" subtitle="My professional journey and key achievements." />
      
      <div ref={containerRef} className="relative mt-16 max-w-4xl mx-auto">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-gradient-to-b from-accent-cyan to-accent-purple"
            style={{ height: lineHeight }}
          />
        </div>

        <div className="space-y-24">
          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                <div className={`hidden md:block w-5/12 ${isEven ? 'order-1' : 'order-3 text-right'}`}>
                  {isEven && (
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="text-right pr-8"
                    >
                      <h4 className="text-xl font-bold">{exp.title}</h4>
                      <div className="text-accent-cyan font-medium my-1">{exp.company}</div>
                      <div className="text-foreground/50 text-sm">{exp.duration}</div>
                    </motion.div>
                  )}
                  {!isEven && (
                    <motion.div 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="text-left pl-8"
                    >
                      <h4 className="text-xl font-bold">{exp.title}</h4>
                      <div className="text-accent-purple font-medium my-1">{exp.company}</div>
                      <div className="text-foreground/50 text-sm">{exp.duration}</div>
                    </motion.div>
                  )}
                </div>

                <div className="order-2 absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-4 border-accent-cyan z-10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-accent-purple rounded-full" />
                </div>

                <motion.div 
                  className={`w-full md:w-5/12 pl-12 md:pl-0 ${isEven ? 'order-3 md:pl-8' : 'order-1 md:pr-8'}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                   {/* Mobile Header view */}
                   <div className="md:hidden mb-4">
                     <h4 className="text-xl font-bold leading-tight">{exp.title}</h4>
                     <div className="text-gradient font-medium my-1">{exp.company}</div>
                     <div className="text-foreground/50 text-sm mb-4">{exp.duration}</div>
                   </div>

                  <div className="glass p-6 rounded-2xl relative group hover:border-accent-cyan/30 transition-colors">
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="text-foreground/70 text-sm flex items-start gap-2">
                          <span className="text-accent-cyan mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                      {exp.tech.map(tech => (
                        <span key={tech} className="text-xs px-2 py-1 bg-white/5 rounded-full text-foreground/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
