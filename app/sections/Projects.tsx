"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Github } from "@/app/components/Icons";
import { SectionHeading } from "@/app/components/SectionHeading";
import { projects } from "@/app/lib/data";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 relative max-w-7xl mx-auto px-6">
      <SectionHeading title="Selected Works" subtitle="A collection of my recent projects and experiments." />
      
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat 
                ? 'bg-foreground text-background' 
                : 'bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={project.title}
              className="glass rounded-2xl overflow-hidden group flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/20 to-accent-purple/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover relative z-0 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">{project.title}</h4>
                <p className="text-foreground/60 text-sm mb-6 flex-1 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map(tech => (
                    <span key={tech} className="text-xs px-2 py-1 bg-white/5 rounded-full text-foreground/80">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  {project.live && project.live !== "#" && project.live !== "" && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-accent-cyan transition-colors">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {project.github && project.github !== "#" && project.github !== "" && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-accent-purple transition-colors">
                      <Github className="w-4 h-4" /> Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
