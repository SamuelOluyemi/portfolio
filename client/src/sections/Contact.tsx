{
  /** Contact Section */
}

function Contact() {
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
