// app/shinchan/layout.tsx
import "../globals.css";

export default function ShinchanLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
