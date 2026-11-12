{
  /** Contact Section */
}

// function Contact() {
//   return (
//     <section id="contact" className="border-t border-slate-800 bg-slate-900/40">
//       <div className="mx-auto max-w-6xl px-6 py-24 text-center">
//         <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
//           Get in touch
//         </p>

//         <h2 className="mb-6 text-3xl font-bold md:text-5xl">
//           Let's Build Something.
//         </h2>

//         <p className="mx-auto max-w-xl leading-relaxed text-slate-400">
//           I'm always interested in connecting with developers, learning from
//           experienced professionals, and exploring new opportunities. Whether
//           you have an opportunity, a question, or simply want to connect, I'd
//           love to hear from you.
//         </p>

//         {/* Email */}
//         <div className="mt-10">
//           <a
//             href="mailto:samueloluyemi@icloud.com"
//             className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
//           >
//             Send Me an Email
//           </a>
//         </div>

//         {/* Social Links */}
//         <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
//           <a
//             href="http://www.github.com/SamuelOluyemi"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-slate-400 transition hover:text-blue-400"
//           >
//             GitHub
//           </a>

//           <a
//             href="http://www.linkedin.com/in/samuel-oluyemi-6b8547184/"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-slate-400 transition hover:text-blue-400"
//           >
//             LinkedIn
//           </a>

//           <a
//             href="mailto:samueloluyemi@icloud.com"
//             className="text-sm text-slate-400 transition hover:text-blue-400"
//           >
//             Email
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Contact;

import { useState } from "react";
import type { FormEvent } from "react";

import { submitContactForm } from "../services/contactService";
import type { ContactApiResponse } from "../types/contact";

function Contact() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<ContactApiResponse["errors"]>
  >({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);

    const contactData = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const result = await submitContactForm(contactData);

      setSuccessMessage(result.message);
      form.reset();
    } catch (error) {
      const apiError = error as ContactApiResponse & {
        status?: number;
      };

      if (apiError.errors) {
        setFieldErrors(apiError.errors);
        setErrorMessage(apiError.message);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="border-t border-slate-800 bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Get in touch
        </p>

        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          Let's Build Something.
        </h2>

        <p className="mx-auto max-w-xl leading-relaxed text-slate-400">
          I'm always interested in connecting with developers, learning from
          experienced professionals, and exploring new opportunities. Whether
          you have an opportunity, a question, or simply want to connect, I'd
          love to hear from you.
        </p>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-2xl space-y-5 text-left"
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Your name"
            />
            {fieldErrors.name?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-400">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="you@example.com"
            />
            {fieldErrors.email?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-400">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              minLength={3}
              maxLength={200}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="What would you like to discuss?"
            />
            {fieldErrors.subject?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-400">
                {error}
              </p>
            ))}
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              className="w-full resize-y rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Write your message..."
            />
            {fieldErrors.message?.map((error) => (
              <p key={error} className="mt-1 text-sm text-red-400">
                {error}
              </p>
            ))}
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p role="status" className="text-sm text-green-400">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Email */}
        <div className="mt-10">
          <a
            href="mailto:samueloluyemi@icloud.com"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Send Me an Email
          </a>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <a
            href="http://www.github.com/SamuelOluyemi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 transition hover:text-blue-400"
          >
            GitHub
          </a>

          <a
            href="http://www.linkedin.com/in/samuel-oluyemi-6b8547184/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 transition hover:text-blue-400"
          >
            LinkedIn
          </a>

          <a
            href="mailto:samueloluyemi@icloud.com"
            className="text-sm text-slate-400 transition hover:text-blue-400"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
