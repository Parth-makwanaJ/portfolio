"use client";
import { motion } from "framer-motion";
import { SectionHeading } from "@/app/components/SectionHeading";
import { skills } from "@/app/lib/data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Skills() {
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="skills" className="py-24 relative max-w-7xl mx-auto px-6">
      <SectionHeading title="My Capabilities" subtitle="The tools and technologies I use to build digital experiences." />
      
      <div className="space-y-16">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
              {category}
              <div className="h-[1px] flex-1 bg-white/10" />
            </h3>
            
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {skills.filter(s => s.category === category).map((skill) => (
                <motion.div 
                  key={skill.name}
                  variants={item}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4 group cursor-pointer transform-gpu"
                >
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent-cyan/20 transition-colors text-accent-cyan">
                     {skill.icon}
                   </div>
                   <div className="text-center w-full">
                     <div className="font-medium text-sm truncate">{skill.name}</div>
                     <div className="text-xs text-foreground/50 mt-1">{skill.level}%</div>
                   </div>
                   
                   <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                     <motion.div 
                       className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                       initial={{ width: 0 }}
                       whileInView={{ width: `${skill.level}%` }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.5 }}
                     />
                   </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
