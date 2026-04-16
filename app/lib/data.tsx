import React from "react";
import {
  SiPhp, SiJavascript, SiPython, SiLaravel, SiNodedotjs, SiCodeigniter, SiNextdotjs,
  SiMysql, SiSupabase, SiRedis, SiFirebase, SiDigitalocean, SiVercel,
  SiShopify, SiFramer, SiHuggingface, SiOpenai, SiScikitlearn
} from "react-icons/si";
import { FaDatabase } from "react-icons/fa6";

export const skills = [
  // Languages
  { name: "PHP", level: 90, category: "Languages", icon: <SiPhp className="w-6 h-6" /> },
  { name: "JavaScript", level: 85, category: "Languages", icon: <SiJavascript className="w-6 h-6" /> },
  { name: "Python", level: 75, category: "Languages", icon: <SiPython className="w-6 h-6" /> },

  // Frameworks
  { name: "Laravel", level: 95, category: "Frameworks", icon: <SiLaravel className="w-6 h-6" /> },
  { name: "Node.js", level: 85, category: "Frameworks", icon: <SiNodedotjs className="w-6 h-6" /> },
  { name: "CodeIgniter", level: 80, category: "Frameworks", icon: <SiCodeigniter className="w-6 h-6" /> },
  { name: "Next.js", level: 80, category: "Frameworks", icon: <SiNextdotjs className="w-6 h-6" /> },

  // Databases
  { name: "MySQL", level: 90, category: "Databases", icon: <SiMysql className="w-6 h-6" /> },
  { name: "SQL Server", level: 80, category: "Databases", icon: <FaDatabase className="w-5 h-5" /> },
  { name: "Supabase", level: 85, category: "Databases", icon: <SiSupabase className="w-6 h-6" /> },

  // Tools
  { name: "Redis", level: 80, category: "Tools", icon: <SiRedis className="w-6 h-6" /> },
  { name: "Firebase", level: 85, category: "Tools", icon: <SiFirebase className="w-6 h-6" /> },
  { name: "DigitalOcean", level: 75, category: "Tools", icon: <SiDigitalocean className="w-6 h-6" /> },
  { name: "Vercel", level: 80, category: "Tools", icon: <SiVercel className="w-6 h-6" /> },

  // Platforms
  { name: "Shopify", level: 95, category: "Platforms", icon: <SiShopify className="w-6 h-6" /> },
  { name: "Framer", level: 75, category: "Platforms", icon: <SiFramer className="w-6 h-6" /> },

  // AI/ML
  { name: "Hugging Face", level: 70, category: "AI/ML", icon: <SiHuggingface className="w-6 h-6" /> },
  { name: "Prompt Engineering", level: 85, category: "AI/ML", icon: <SiOpenai className="w-6 h-6" /> },
  { name: "Python ML Basic", level: 65, category: "AI/ML", icon: <SiScikitlearn className="w-6 h-6" /> },
];

export const experiences = [
  {
    company: "NicheTech Computer Solutions",
    title: "Backend Developer",
    duration: "2023 - 2025",
    achievements: [
      "Rising Star Award – Recognized for exceptional performance and rapid growth.",
      "Tech Expert of the Year (2025) – Honored for technical excellence and impact."
    ],
    tech: ["Laravel", "Node.js", "Shopify", "Framer"]
  },
  {
    company: "Sandesh Digital",
    title: "Backend Developer",
    duration: "2025 - Present",
    achievements: [
      "Led a full team while working as a Backend Developer.",
      // "Rising Star Award – Recognized for exceptional performance and rapid growth.",
      // "Tech Expert of the Year (2025) – Honored for technical excellence and impact.",
      // "Developed scalable APIs and CMS features using Laravel and Node.js for high-traffic platforms.",
      // "Led migrations from CodeIgniter to Node.js, improving modularity and maintainability.",
      "Optimized system performance implementing Redis caching, WebP conversion, and DB tuning.",
      // "Integrated third-party services like Firebase, DigitalOcean Spaces, and payment gateways."
    ],
    tech: ["Node.js", "Laravel", "Shopify", "AWS", "Figma"]
  }
];

export const projects = [
  {
    title: "Sandesh",
    description: "Led development of a large-scale news CMS and API system with a high-volume database. Built core modules and optimized Node.js APIs.",
    tech: ["Laravel", "Node.js", "MySQL"],
    image: "/Sandesh.png",
    category: "CMS",
    live: "https://sandesh.com/",
    github: ""
  },
  {
    title: "Field Tracking System",
    description: "Developed backend for a complaint tracking platform with notification integration. Architected logic to separate workflows for two companies.",
    tech: ["CodeIgniter", "SQL Server", "Firebase"],
    image: "/FTS.png",
    category: "Web App",
    live: "http://prasadgroup.com/",
    github: ""
  },
  {
    title: "Matrubharti",
    description: "Led backend APIs powering a Flutter app. Built payment microservices, managed admin dashboard, and implemented Redis caching.",
    tech: ["Node.js", "Laravel", "Core PHP", "Redis"],
    image: "/Matrubharti.png",
    category: "Mobile APIs",
    live: "https://matrubharti.com/",
    github: ""
  },
  // {
  //   title: "Keyword Generator - SEO Tool",
  //   description: "Built an SEO keyword generation tool using Python and a Hugging Face language model with custom prompt logic.",
  //   tech: ["Python", "Hugging Face"],
  //   image: "/placeholder-project.jpg",
  //   category: "AI/ML",
  //   live: "",
  //   github: ""
  // },
  {
    title: "Crystal World",
    description: "Built a custom Shopify store from scratch implementing payment gateways and automated delivery handling via Shiprocket.",
    tech: ["Shopify"],
    image: "/crystalworlld.png",
    category: "E-Commerce",
    live: "https://crystalworlld.com/",
    github: ""
  },
  {
    title: "Duali",
    description: "Design, develop, maintain, and continuously optimize custom features and functionalities to enhance the performance and user experience of the Shopify store.",
    tech: ["Shopify"],
    image: "/Duali.png",
    category: "E-Commerce",
    live: "https://duali.co/",
    github: ""
  },
  {
    title: "LuxaDerme",
    description: "Create a high-performance, fast, and fully responsive Shopify store optimized for seamless user experience and efficient functionality.",
    tech: ["Shopify"],
    image: "/luxaderme.png",
    category: "E-Commerce",
    live: "https://luxaderme.in/",
    github: ""
  },
  {
    title: "White Maison De Couture",
    description: "Develop a scalable, high-speed Shopify store with a strong focus on performance optimization and intuitive user experience.",
    tech: ["Shopify"],
    image: "/WMDC.png",
    category: "E-Commerce",
    live: "https://whitemaisondecouture.com/",
    github: ""
  },
  {
    title: "Amin New York",
    description: "Build and optimize a responsive Shopify store that delivers fast load times, smooth navigation, and an engaging user experience.",
    tech: ["Shopify"],
    image: "/aminnewyork.png",
    category: "E-Commerce",
    live: "https://aminnewyork.com/",
    github: ""
  },
  {
    title: "Champions Cricket Club",
    description: "Built a Laravel-based cricket management system with player registration, subscriptions, events, teams, and venue management.",
    tech: ["Laravel"],
    image: "/3c.png",
    category: "Web App",
    live: "https://championscricket.club/",
    github: ""
  },
  {
    title: "Pragati Finance",
    description: "Led backend API development for financial modules including interest calculation, brokerage, and transaction tracking.",
    tech: ["Node.js"],
    image: "/Pragati.png",
    category: "Finance",
    live: "",
    github: ""
  }
];
