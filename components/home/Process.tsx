import { process } from "@/content/site";

/**
 * How a project runs. A hairline runs beside the steps; the motion runtime draws a lime line down it
 * with the scroll and lights each step's marker as the line reaches it (and the scene's path lights
 * the matching node). Without JavaScript, or with reduced motion, the line is drawn in full.
 */
export function Process() {
  return (
    <section id="process" data-stop-mark="6" aria-labelledby="process-title" className="section-space">
      <div className="container-page">
        <div data-scene-text className="w-fit max-w-full">
          <p className="label text-fg-muted">Process</p>
          <h2 id="process-title" data-reveal className="mt-4 max-w-[14ch] text-h2">
            How a project runs
          </h2>
          <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
            Five steps. You always know what is happening and what comes next.
          </p>
        </div>

        <div data-process data-scene-text className="relative mt-14 md:mt-20 md:w-[52%]">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[4px] w-px bg-rule" />
          <span
            data-process-line
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[4px] w-px origin-top bg-signal"
          />
          <ol>
            {process.map((s, i) => (
              <li
                key={s.step}
                data-process-step
                className="group relative grid grid-cols-[2.75rem_1fr] gap-x-4 pb-10 pl-8 last:pb-0 md:grid-cols-[3.5rem_1fr] md:pb-14 md:pl-12"
              >
                <span
                  aria-hidden="true"
                  className="process-marker absolute top-[0.85rem] left-0 size-[9px] rounded-full bg-signal group-data-off:scale-75 group-data-off:bg-fg-muted"
                />
                <span className="label pt-2.5 tabular-nums text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-h3">{s.step}</h3>
                  <p className="mt-2 max-w-[42ch] text-fg-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
