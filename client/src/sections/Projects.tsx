import type { Project } from "../types/projects";
import ProjectCard from "../components/ProjectCard";

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
  apiStatus: string;
}

function Projects({ projects, loading, apiStatus }: ProjectsProps) {
  return (
    <section
      id="projects"
      className="border-t border-slate-800 bg-slate-900/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
          What I've built
        </p>

        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Featured Projects
        </h2>

        <p className="mb-12 text-slate-400">
          A selection of applications and projects I've worked on.
        </p>

        {loading ? (
          <p className="text-slate-400">Loading projects...</p>
        ) : projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">
            Projects are temporarily unavailable.
          </p>
        )}

        <p className="mt-8 text-xs text-slate-500">API status: {apiStatus}</p>
      </div>
    </section>
  );
}

export default Projects;
