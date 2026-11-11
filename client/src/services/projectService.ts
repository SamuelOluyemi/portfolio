import type { Project } from "../types/projects";

interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch("/api/projects");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result: ProjectsApiResponse = await response.json();

  return result.data;
}
