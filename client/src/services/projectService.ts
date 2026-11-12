import type { Project } from "../types/projects";

interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
}

interface ProjectApiResponse {
  success: boolean;
  message: string;
  data: Project;
}

interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export type ProjectInput = Omit<Project, "id">;

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result: ProjectsApiResponse = await response.json();

  return result.data;
}

export async function createProject(project: ProjectInput): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(project),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create project.");
  }

  return (result as ProjectApiResponse).data;
}

export async function updateProject(
  id: number,
  project: ProjectInput,
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(project),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update project.");
  }

  return (result as ProjectApiResponse).data;
}

export async function deleteProject(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result: ApiMessageResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete project.");
  }
}
