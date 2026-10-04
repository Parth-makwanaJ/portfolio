"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { sendContact, type ContactState } from "@/app/contact/actions";
import { cx } from "@/lib/cx";

const initial: ContactState = { status: "idle" };

const fieldClass =
  "mt-2 block w-full border border-rule-strong bg-bg px-3 py-3 text-body outline-none transition-colors duration-(--dur-fast) ease-brand focus-visible:border-signal aria-invalid:border-signal";

export function ContactForm({ projectTypes, budgets }: { projectTypes: string[]; budgets: string[] }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the result so screen reader and keyboard users hear it.
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-rule-strong p-6 outline-none md:p-8">
        <p className="label text-fg-subtle">Sent</p>
        <p className="mt-3 text-h3">Thanks. Your message is on its way.</p>
        <p className="mt-3 text-fg-muted">I will reply to the email address you gave.</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const e = state.errors ?? {};
  const err = (k: keyof NonNullable<ContactState["errors"]>) =>
    e[k] ? (
      <p id={`${k}-error`} className="mt-2 text-small text-signal">
        {e[k]}
      </p>
    ) : null;

  return (
    <form action={action} noValidate className="space-y-6">
      {state.status === "error" && state.message && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="border-l-2 border-signal pl-3 text-small outline-none">
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label text-fg-subtle">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            aria-invalid={!!e.name}
            aria-describedby={e.name ? "name-error" : undefined}
            className={fieldClass}
          />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="label text-fg-subtle">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={v.email}
            aria-invalid={!!e.email}
            aria-describedby={e.email ? "email-error" : undefined}
            className={fieldClass}
          />
          {err("email")}
        </div>
      </div>

      <div className={cx("grid gap-6", budgets.length > 0 && "sm:grid-cols-2")}>
        <div>
          <label htmlFor="projectType" className="label text-fg-subtle">
            Project type
          </label>
          <div className="relative">
            <select
              id="projectType"
              name="projectType"
              required
              defaultValue={v.projectType ?? ""}
              aria-invalid={!!e.projectType}
              aria-describedby={e.projectType ? "projectType-error" : undefined}
              className={cx(fieldClass, "appearance-none pr-10")}
            >
              <option value="" disabled>
                Choose one
              </option>
              {projectTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
          </div>
          {err("projectType")}
        </div>
        {budgets.length > 0 && (
          <div>
            <label htmlFor="budget" className="label text-fg-subtle">
              Budget range
            </label>
            <div className="relative">
              <select
                id="budget"
                name="budget"
                required
                defaultValue={v.budget ?? ""}
                aria-invalid={!!e.budget}
                aria-describedby={e.budget ? "budget-error" : undefined}
                className={cx(fieldClass, "appearance-none pr-10")}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {budgets.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            </div>
            {err("budget")}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className="label text-fg-subtle">
          About the project
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={20}
          defaultValue={v.message}
          aria-invalid={!!e.message}
          aria-describedby={e.message ? "message-error message-hint" : "message-hint"}
          className={cx(fieldClass, "resize-y")}
        />
        <p id="message-hint" className="mt-2 text-small text-fg-muted">
          What you need, any links, and when you would like it done.
        </p>
        {err("message")}
      </div>

      {/* Honeypot for bots: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex h-12 w-full items-center justify-between gap-6 bg-signal px-5 font-medium text-on-signal transition-opacity duration-(--dur-fast) ease-brand hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}
