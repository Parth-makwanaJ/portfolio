"use client";

/**
 * Loads the Radix accordion as its own chunk, only on pages that actually render an FAQ.
 * Still server-rendered (ssr stays on), so the questions and answers are in the HTML.
 */
import dynamic from "next/dynamic";

export const FaqAccordionLazy = dynamic(() => import("@/components/home/FaqAccordion"));
