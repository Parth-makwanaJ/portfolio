"use server";

import { contact } from "@/content/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "projectType" | "budget" | "message", string>>;
  values?: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates the contact form and sends it by email through Resend's REST API.
 * Env vars: RESEND_API_KEY (required to send), CONTACT_TO_EMAIL (defaults to the address in
 * content/site.ts), CONTACT_FROM_EMAIL (a sender on a domain verified in Resend).
 */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = {
    name: get("name"),
    email: get("email"),
    projectType: get("projectType"),
    budget: get("budget"),
    message: get("message"),
  };

  // Honeypot: real people never see or fill this field. Pretend it worked.
  if (get("website")) return { status: "success" };

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2 || values.name.length > 100) errors.name = "Please enter your name.";
  if (!EMAIL.test(values.email) || values.email.length > 200) errors.email = "Please enter a valid email address.";
  if (!contact.projectTypes.includes(values.projectType)) errors.projectType = "Please choose a project type.";
  if (contact.budgets.length > 0 && !contact.budgets.includes(values.budget)) errors.budget = "Please choose a budget range.";
  if (values.message.length < 20) errors.message = "Please tell me a little more (at least 20 characters).";
  if (values.message.length > 5000) errors.message = "Please keep the message under 5000 characters.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please fix the highlighted fields.", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || contact.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_FROM_EMAIL is not set.");
    return {
      status: "error",
      message: `The form is not available right now. Please email me at ${contact.email}.`,
      values,
    };
  }

  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Project type: ${values.projectType}`,
    values.budget ? `Budget: ${values.budget}` : null,
    "",
    values.message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `New project enquiry: ${values.projectType} from ${values.name}`,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("Contact form: sending failed.", err);
    return {
      status: "error",
      message: `Sorry, the message could not be sent. Please email me at ${contact.email}.`,
      values,
    };
  }

  return { status: "success" };
}
