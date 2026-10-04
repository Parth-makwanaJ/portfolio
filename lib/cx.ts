/**
 * Class name joiner for client components. Unlike cn() it does not resolve Tailwind conflicts,
 * which keeps tailwind-merge (about 8 KB gzipped) out of the browser bundle. Only use it where
 * the classes passed in never conflict.
 */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
