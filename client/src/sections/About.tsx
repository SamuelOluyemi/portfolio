{
  /* About Section */
}

function About() {
  return (
    <section id="about" className="border-t border-slate-800 bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
          Introduction
        </p>

        <h2 className="mb-8 text-3xl font-bold md:text-4xl">About Me</h2>

        <div className="max-w-3xl space-y-5 leading-relaxed text-slate-400">
          <p>
            I'm a software developer with hands-on experience building web and
            mobile applications using modern technologies.
          </p>

          <p>
            My interests extend beyond application development into cloud
            systems, information security, and information privacy.
          </p>

          <p>
            I believe in continuous learning, building practical projects, and
            strengthening my engineering foundations through hands-on
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
