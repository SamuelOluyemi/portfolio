{
  /* Skills Section */
}

function Skills() {
  const skills = [
    "React",
    "TypeScript",
    "HTML5",
    "CSS3",
    "JavaScript",
    "Python",
    "SQL",
    "REST APIs",
    "Vite",
    "TailwindCSS",
    "Node.js",
    "Express",
    "C++",
    "PostgreSQL",
    "Git",
    "GitHub",
    "Docker",
  ];

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
        My toolkit
      </p>

      <h2 className="mb-10 text-3xl font-bold md:text-4xl">Technical Skills</h2>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Skills;
