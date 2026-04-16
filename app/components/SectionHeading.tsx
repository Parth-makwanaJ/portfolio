"use client";
import { motion } from "framer-motion";

export function SectionHeading({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="mb-16">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          className="text-foreground/60 text-lg max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div 
        className="h-1 w-20 bg-gradient-to-r from-accent-cyan to-accent-purple mt-6 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2, duration: 0.8 }}
      />
    </div>
  );
}
