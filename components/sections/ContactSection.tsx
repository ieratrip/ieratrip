"use client";

import { FormEvent, useState } from "react";
import { Reveal } from "@/components/Reveal";

type ContactDetails = {
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
};

type ContactUi = {
  label: string;
  title: { line1: string; emphasis: string };
  copy: string;
  form: {
    subjectDefault: string;
    body: { nameLabel: string; emailLabel: string; fallbackMessage: string };
    placeholders: { name: string; email: string; subject: string; message: string };
    submit: string;
    sent: string;
  };
  meta: {
    phone: { label: string; copy: string };
    email: { label: string; copy: string };
    location: { label: string; value: string };
  };
};

type Props = {
  contactDetails: ContactDetails;
  ui: ContactUi;
};

export function ContactSection({ contactDetails, ui }: Props) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const subject = String(form.get("subject") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const mailto = new URL(`mailto:${contactDetails.email}`);
    mailto.searchParams.set("subject", subject || ui.form.subjectDefault);
    mailto.searchParams.set(
      "body",
      [
        `${ui.form.body.nameLabel}: ${name}`,
        `${ui.form.body.emailLabel}: ${email}`,
        "",
        message || ui.form.body.fallbackMessage,
      ].join("\n"),
    );

    window.location.href = mailto.toString();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <section id="contact" className="section">
      <div className="site-shell">
        <div className="contact-grid">
          <div className="contact-panel">
            <Reveal>
              <p className="section-label">{ui.label}</p>
            </Reveal>
            <Reveal delay="1">
              <h2 className="section-title">
                {ui.title.line1}
                <br />
                <em style={{ color: "var(--terracotta)" }}>{ui.title.emphasis}</em>
              </h2>
            </Reveal>
            <Reveal delay="2">
              <p className="section-copy">{ui.copy}</p>
            </Reveal>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <input name="name" type="text" placeholder={ui.form.placeholders.name} required />
                <input name="email" type="email" placeholder={ui.form.placeholders.email} required />
              </div>
              <input name="subject" type="text" placeholder={ui.form.placeholders.subject} required />
              <textarea name="message" placeholder={ui.form.placeholders.message} required />
              <button className="button-primary" type="submit">
                {ui.form.submit}
              </button>
              {sent ? (
                <p className="section-copy" style={{ marginTop: 0 }}>
                  {ui.form.sent}
                </p>
              ) : null}
            </form>
          </div>

          <div className="contact-meta">
            <article className="meta-card">
              <p className="meta-card-label">{ui.meta.phone.label}</p>
              <p className="meta-card-value">{contactDetails.phone}</p>
              <p className="meta-card-copy">{ui.meta.phone.copy}</p>
            </article>
            <article className="meta-card">
              <p className="meta-card-label">{ui.meta.email.label}</p>
              <p className="meta-card-value">{contactDetails.email}</p>
              <p className="meta-card-copy">{ui.meta.email.copy}</p>
            </article>
            <article className="meta-card">
              <p className="meta-card-label">{ui.meta.location.label}</p>
              <p className="meta-card-value">{ui.meta.location.value}</p>
              <p className="meta-card-copy">
                <a href={contactDetails.mapsUrl} target="_blank" rel="noreferrer">
                  {contactDetails.address}
                </a>
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
