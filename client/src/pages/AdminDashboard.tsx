import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { checkAuth, logoutAdmin } from "../services/authService";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type ProjectInput,
} from "../services/projectService";
import type { Project } from "../types/projects";

const emptyProject: ProjectInput = {
  title: "",
  description: "",
  technologies: [],
  category: "",
  githubUrl: "",
  liveDemoUrl: "",
  imageUrl: "",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProjectInput>(emptyProject);
  const [technologiesInput, setTechnologiesInput] = useState("");

  useEffect(() => {
    let active = true;

    const initializeDashboard = async () => {
      try {
        const result = await checkAuth();

        if (!active) return;

        if (!result.authenticated) {
          navigate("/admin/login", { replace: true });
          return;
        }

        setAdminId(result.adminId);

        try {
          const projectData = await getProjects();

          if (active) {
            setProjects(projectData);
          }
        } catch {
          if (active) {
            setError("Unable to load projects. Please refresh the page.");
          }
        }
      } catch {
        if (active) {
          navigate("/admin/login", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  const resetForm = () => {
    setFormData(emptyProject);
    setTechnologiesInput("");
    setEditingProjectId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (project: Project) => {
    setEditingProjectId(project.id);

    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      category: project.category,
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      imageUrl: project.imageUrl || "",
    });

    setTechnologiesInput(project.technologies.join(", "));
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    const projectData: ProjectInput = {
      ...formData,
      technologies: technologiesInput
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    };

    try {
      if (editingProjectId !== null) {
        const updatedProject = await updateProject(
          editingProjectId,
          projectData,
        );

        setProjects((current) =>
          current.map((project) =>
            project.id === editingProjectId ? updatedProject : project,
          ),
        );
      } else {
        const newProject = await createProject(projectData);

        setProjects((current) => [...current, newProject]);
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteProject(projectId);

      setProjects((current) =>
        current.filter((project) => project.id !== projectId),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete project.",
      );
    }
  };

  const handleLogout = async () => {
    setError("");

    try {
      await logoutAdmin();
      navigate("/admin/login", { replace: true });
    } catch {
      setError("Unable to log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Verifying administrator session...</p>
      </main>
    );
  }

  if (adminId === null) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-slate-400">
              Welcome, administrator #{adminId}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
          >
            Log out
          </button>
        </header>

        {error && (
          <p
            role="alert"
            className="mb-6 rounded-lg bg-red-950 p-4 text-red-300"
          >
            {error}
          </p>
        )}

        <section className="mb-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Manage Projects</h2>
              <p className="mt-1 text-slate-400">
                Add, edit, and remove portfolio projects.
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
            >
              Add Project
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-semibold">
                {editingProjectId !== null ? "Edit Project" : "New Project"}
              </h3>

              <div>
                <label htmlFor="title" className="mb-2 block text-sm">
                  Project title *
                </label>
                <input
                  id="title"
                  required
                  maxLength={150}
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({ ...formData, title: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm">
                  Description *
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block text-sm">
                  Category *
                </label>
                <input
                  id="category"
                  required
                  maxLength={100}
                  value={formData.category}
                  onChange={(event) =>
                    setFormData({ ...formData, category: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label htmlFor="technologies" className="mb-2 block text-sm">
                  Technologies (comma-separated) *
                </label>
                <input
                  id="technologies"
                  required
                  value={technologiesInput}
                  onChange={(event) => setTechnologiesInput(event.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label htmlFor="githubUrl" className="mb-2 block text-sm">
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl || ""}
                  onChange={(event) =>
                    setFormData({ ...formData, githubUrl: event.target.value })
                  }
                  placeholder="https://github.com/username/project"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label htmlFor="liveDemoUrl" className="mb-2 block text-sm">
                  Live Demo URL
                </label>
                <input
                  id="liveDemoUrl"
                  type="url"
                  value={formData.liveDemoUrl || ""}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      liveDemoUrl: event.target.value,
                    })
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="mb-2 block text-sm">
                  Project image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl || ""}
                  onChange={(event) =>
                    setFormData({ ...formData, imageUrl: event.target.value })
                  }
                  placeholder="https://example.com/image.png"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProjectId !== null
                      ? "Save Changes"
                      : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-700 px-5 py-3 font-semibold hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <h3 className="text-xl font-semibold">{project.title}</h3>

                <p className="mt-2 text-sm text-slate-400">
                  {project.category}
                </p>

                <p className="mt-4 text-slate-300">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              No projects found. Add your first project above.
            </p>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Journey</h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage your career milestones.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="mt-2 text-sm text-slate-400">
              Review contact form submissions.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
