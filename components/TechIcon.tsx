import type { IconType } from "react-icons";
import {
  SiPhp, SiJavascript, SiPython, SiLaravel, SiNodedotjs, SiCodeigniter, SiNextdotjs,
  SiMysql, SiSupabase, SiRedis, SiFirebase, SiDigitalocean, SiVercel,
  SiShopify, SiFramer, SiHuggingface, SiOpenai, SiScikitlearn, SiGrafana,
} from "react-icons/si";
import { FaDatabase, FaAws } from "react-icons/fa6";

const icons: Record<string, IconType> = {
  php: SiPhp,
  javascript: SiJavascript,
  python: SiPython,
  laravel: SiLaravel,
  nodejs: SiNodedotjs,
  codeigniter: SiCodeigniter,
  nextjs: SiNextdotjs,
  mysql: SiMysql,
  database: FaDatabase,
  supabase: SiSupabase,
  redis: SiRedis,
  firebase: SiFirebase,
  digitalocean: SiDigitalocean,
  vercel: SiVercel,
  shopify: SiShopify,
  aws: FaAws,
  framer: SiFramer,
  huggingface: SiHuggingface,
  openai: SiOpenai,
  scikitlearn: SiScikitlearn,
  grafana: SiGrafana,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? FaDatabase;
  return <Icon className={className} aria-hidden="true" focusable="false" />;
}
