{
  /** Journey Section */
}

function LearningJourney() {
  return (
    <section id="journey" className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
        Continuous learning
      </p>

      <h2 className="mb-12 text-3xl font-bold md:text-4xl">
        My Learning Journey
      </h2>

      <div className="space-y-8 border-l border-slate-700 pl-8">
        <div>
          <p className="mb-2 text-sm text-blue-400">Athabasca University</p>
          <h3 className="text-xl font-semibold">
            Computer Science Foundations
          </h3>
          <p className="mt-3 leading-relaxed text-slate-400">
            Completed coursework in Introduction to Programming (C++), Data
            Structures and Algorithms, and Operating Systems.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm text-blue-400">Harvard edX</p>
          <h3 className="text-xl font-semibold">Practical Web Development</h3>
          <p className="mt-3 leading-relaxed text-slate-400">
            Developed an interactive technology blog as a course project,
            implementing user registration, authentication, articles, comments,
            and admin functionality.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm text-blue-400">Current Focus</p>
          <h3 className="text-xl font-semibold">Cloud, Security & Privacy</h3>
          <p className="mt-3 leading-relaxed text-slate-400">
            Expanding my knowledge of software engineering, cloud systems,
            information security, and privacy.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LearningJourney;