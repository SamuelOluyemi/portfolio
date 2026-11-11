import type { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950 p-8 transition hover:-translate-y-1 hover:border-blue-500">
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          className="mb-6 aspect-video w-full rounded-lg object-cover"
        />
      )}
      <p className="mb-4 text-sm text-blue-400">{project.category}</p>

      <h3 className="mb-4 text-xl font-bold">{project.title}</h3>

      <p className="mb-8 leading-relaxed text-slate-400">
        {project.description}
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-md bg-slate-800 px-3 py-2 text-xs text-slate-300"
          >
            {technology}
          </span>
        ))}
      </div>

      {(project.githubUrl || project.liveDemoUrl) && (
        <div className="flex flex-wrap gap-4 border-t border-slate-800 pt-5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-300 hover:text-blue-400"
            >
              GitHub →
            </a>
          )}

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Live Demo →
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
