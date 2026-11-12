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

import {
  createMilestone,
  deleteMilestone,
  getJourney,
  updateMilestone,
  type JourneyInput,
} from "../services/journeyService";

import { getMessages } from "../services/messageService";

import MessagesManager from "../components/admin/MessagesManager";

import type { Project } from "../types/projects";
import type { JourneyMilestone } from "../types/journey";
import type { ContactMessage } from "../types/messages";

const emptyProject: ProjectInput = {
  title: "",
  description: "",
  technologies: [],
  category: "",
  githubUrl: "",
  liveDemoUrl: "",
  imageUrl: "",
};

const emptyMilestone: JourneyInput = {
  organization: "",
  title: "",
  description: "",
  dateLabel: "",
  displayOrder: 0,
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<JourneyMilestone[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Project form state
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProjectInput>(emptyProject);
  const [technologiesInput, setTechnologiesInput] = useState("");

  // Journey form state
  const [showJourneyForm, setShowJourneyForm] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<number | null>(
    null,
  );
  const [journeyForm, setJourneyForm] = useState<JourneyInput>(emptyMilestone);

  // =========================================
  // INITIALIZE DASHBOARD
  // =========================================

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

        try {
          const journeyData = await getJourney();

          if (active) {
            setMilestones(journeyData);
          }
        } catch {
          if (active) {
            setError("Unable to load journey milestones. Please refresh.");
          }
        }

        try {
          const messageData = await getMessages();

          if (active) {
            setMessages(messageData);
          }
        } catch {
          if (active) {
            setError("Unable to load messages. Please refresh the page.");
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

  // =========================================
  // PROJECT MANAGEMENT
  // =========================================

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

  // =========================================
  // JOURNEY MANAGEMENT
  // =========================================

  const resetJourneyForm = () => {
    setJourneyForm(emptyMilestone);
    setEditingMilestoneId(null);
    setShowJourneyForm(false);
    setError("");
  };

  const handleJourneyEdit = (milestone: JourneyMilestone) => {
    setEditingMilestoneId(milestone.id);

    setJourneyForm({
      organization: milestone.organization,
      title: milestone.title,
      description: milestone.description,
      dateLabel: milestone.dateLabel || "",
      displayOrder: milestone.displayOrder,
    });

    setShowJourneyForm(true);
    setError("");
  };

  const handleJourneySubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingMilestoneId !== null) {
        const updated = await updateMilestone(editingMilestoneId, journeyForm);

        setMilestones((current) =>
          current
            .map((item) => (item.id === updated.id ? updated : item))
            .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id),
        );
      } else {
        const created = await createMilestone(journeyForm);

        setMilestones((current) =>
          [...current, created].sort(
            (a, b) => a.displayOrder - b.displayOrder || a.id - b.id,
          ),
        );
      }

      resetJourneyForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save milestone.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleJourneyDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this milestone?",
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteMilestone(id);

      setMilestones((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete milestone.",
      );
    }
  };

  // =========================================
  // AUTHENTICATION
  // =========================================

  const handleLogout = async () => {
    setError("");

    try {
      await logoutAdmin();
      navigate("/admin/login", { replace: true });
    } catch {
      setError("Unable to log out. Please try again.");
    }
  };

  // =========================================
  // LOADING AND AUTH CHECK
  // =========================================

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

  // =========================================
  // DASHBOARD UI
  // =========================================

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

        {/* =====================================
            PROJECT MANAGEMENT
        ===================================== */}

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

        {/* =====================================
            JOURNEY MANAGEMENT
        ===================================== */}

        <section className="mb-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Manage Journey</h2>
              <p className="mt-1 text-slate-400">
                Add, edit, reorder, and remove career milestones.
              </p>
            </div>

            <button
              onClick={() => {
                resetJourneyForm();
                setShowJourneyForm(true);
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
            >
              Add Milestone
            </button>
          </div>

          {showJourneyForm && (
            <form
              onSubmit={handleJourneySubmit}
              className="mb-8 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-semibold">
                {editingMilestoneId !== null
                  ? "Edit Milestone"
                  : "New Milestone"}
              </h3>

              <div>
                <label className="mb-2 block text-sm">Organization *</label>
                <input
                  required
                  maxLength={150}
                  value={journeyForm.organization}
                  onChange={(event) =>
                    setJourneyForm({
                      ...journeyForm,
                      organization: event.target.value,
                    })
                  }
                  placeholder="e.g. Athabasca University"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Milestone title *</label>
                <input
                  required
                  maxLength={200}
                  value={journeyForm.title}
                  onChange={(event) =>
                    setJourneyForm({
                      ...journeyForm,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. Computer Science Foundations"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={journeyForm.description}
                  onChange={(event) =>
                    setJourneyForm({
                      ...journeyForm,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe this milestone..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Date label</label>
                <input
                  maxLength={100}
                  value={journeyForm.dateLabel || ""}
                  onChange={(event) =>
                    setJourneyForm({
                      ...journeyForm,
                      dateLabel: event.target.value,
                    })
                  }
                  placeholder="e.g. 2026 or Present"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm">Display order</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={journeyForm.displayOrder}
                  onChange={(event) =>
                    setJourneyForm({
                      ...journeyForm,
                      displayOrder: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Milestone"}
                </button>

                <button
                  type="button"
                  onClick={resetJourneyForm}
                  className="rounded-lg bg-slate-700 px-5 py-3 font-semibold hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {milestones.map((milestone) => (
              <article
                key={milestone.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm text-blue-400">
                  {milestone.organization}
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {milestone.title}
                </h3>

                {milestone.dateLabel && (
                  <p className="mt-1 text-sm text-slate-500">
                    {milestone.dateLabel}
                  </p>
                )}

                <p className="mt-3 text-slate-300">{milestone.description}</p>

                <p className="mt-3 text-xs text-slate-500">
                  Display order: {milestone.displayOrder}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleJourneyEdit(milestone)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleJourneyDelete(milestone.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          {milestones.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              No milestones found. Add your first milestone above.
            </p>
          )}
        </section>

        {/* =====================================
            MESSAGES MANAGEMENT
        ===================================== */}

        <MessagesManager
          initialMessages={messages}
          onMessagesChange={setMessages}
        />
      </div>
    </main>
  );
}

export default AdminDashboard;
