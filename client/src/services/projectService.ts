import type { Project } from "../types/projects";

interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
}

// Define the base URL for the API, using an environment variable if available
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
// console.log("API_BASE_URL:", API_BASE_URL); // Log the API base URL for debugging

export async function getProjects(): Promise<Project[]> {
  //   const response = await fetch("/api/projects");
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result: ProjectsApiResponse = await response.json();

  return result.data;
}
