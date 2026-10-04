/** The 12-column grid (4 on phones), drawn behind every page so the structure is visible. */
export function GridOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="container-page grid-12 h-full">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={`border-l border-grid-line ${i >= 4 ? "hidden md:block" : ""} ${i === 3 ? "border-r md:border-r-0" : ""} ${i === 11 ? "border-r" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
