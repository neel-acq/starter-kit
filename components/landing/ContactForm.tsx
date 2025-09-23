"use client";
import React, { useState } from "react";

export const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSend = name.trim() && email.trim() && message.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return setStatus("error");
    setStatus("sending");
    // Simulate send
    setTimeout(() => {
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    }, 800);
  };

  return (
    <section id="contact" className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Contact us</h2>
        <p className="mt-2 text-gray-600">
          Have questions or need help? Send us a message and we'll get back to
          you.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!canSend || status === "sending"}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-full disabled:opacity-50 button-color"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
            {status === "sent" && (
              <span className="text-green-600">Message sent — thanks!</span>
            )}
            {status === "error" && (
              <span className="text-red-600">Please fill all fields.</span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
