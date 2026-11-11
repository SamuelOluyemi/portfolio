{
  /* Hero Section */
}

function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-80px)] max-w-6xl flex-col justify-center px-6 py-20 md:py-24">
      <p className="mb-5 font-medium text-blue-400">SOFTWARE DEVELOPER</p>

      <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
        Building software.
        <br />
        Solving problems.
        <br />
        <span className="text-blue-500">Growing every day.</span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
        I'm a software developer passionate about building useful applications,
        exploring cloud technologies, and developing deeper expertise in
        information security and privacy.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
        >
          Explore My Projects
        </a>

        <a
          href="#about"
          className="rounded-lg border border-slate-700 px-6 py-3 font-medium transition hover:border-blue-500"
        >
          More About Me
        </a>

        <a
          href="/resume.pdf"
          download="resume.pdf"
          className="rounded-lg border border-slate-700 px-6 py-3 font-medium transition hover:border-blue-500 hover:text-blue-400"
        >
          Download Resume ↓
        </a>
      </div>

      <p className="mt-16 text-sm text-slate-500">
        Currently learning · Building · Exploring
      </p>
    </section>
  );
}

export default Hero;
