"use client";
import { SITE } from "../../data/site";

// No backend yet: the form opens the visitor's mail app with the message filled in.
export default function ContactForm() {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const body = `Name: ${f.get("name")}\nEmail: ${f.get("email")}\nPhone: ${f.get("phone")}\n\n${f.get("message")}`;
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("New project enquiry from " + (f.get("name") || "the website"))}&body=${encodeURIComponent(body)}`;
      }}
    >
      <label className="nx-field"><span>Full Name *</span><input className="input-field" name="name" type="text" required /></label>
      <label className="nx-field"><span>Email Address *</span><input className="input-field" name="email" type="email" required /></label>
      <label className="nx-field"><span>Phone Number</span><input className="input-field" name="phone" type="tel" /></label>
      <label className="nx-field"><span>Message *</span><textarea className="input-field textarea" name="message" required /></label>
      <div className="send-div">
        <div className="required-text">* Required fields</div>
        <button type="submit" className="submit-button">send</button>
      </div>
    </form>
  );
}
