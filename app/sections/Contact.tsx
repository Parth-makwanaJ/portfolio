"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Github, Linkedin, XLogo } from "@/app/components/Icons";
import { SectionHeading } from "@/app/components/SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative max-w-4xl mx-auto px-6 mb-20">
      <SectionHeading title="Get In Touch" subtitle="Have a project in mind or just want to say hi? I'd love to hear from you." />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="glass bg-foreground/5 p-10 md:p-16 rounded-3xl relative overflow-hidden text-center flex flex-col items-center"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <h3 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
          Let's create something <span className="text-gradient">extraordinary.</span>
        </h3>

        <p className="text-foreground/70 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl relative z-10">
          Whether you have a specific project outline or just an idea, I help turn concepts into reality.
          My inbox is always open.
        </p>

        <motion.a
          href="mailto:parthmakwan02@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-accent-cyan to-accent-purple text-background font-bold text-lg rounded-full overflow-hidden group mb-14"
        >
          <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Email Me Directly</span>
          <div className="absolute inset-0 bg-foreground/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </motion.a>

        <div className="relative z-10 pt-10 border-t border-foreground/10 w-full flex flex-col items-center">
          <div className="text-sm font-semibold text-foreground/40 uppercase tracking-widest mb-8">Or find me on</div>
          <div className="flex items-center gap-6">
            {[
              { icon: Github, href: "https://github.com/Parth-makwanaJ" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/parth-makwana-408571278/" },
              { icon: XLogo, href: "https://x.com/parthx09" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="w-16 h-16 rounded-full glass border border-foreground/10 flex items-center justify-center text-foreground hover:text-accent-purple hover:border-accent-purple/50 transition-all duration-300"
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
