import type { JourneyMilestone } from "../types/journey";

export type JourneyInput = Omit<JourneyMilestone, "id">;

interface JourneyApiResponse {
  success: boolean;
  data: JourneyMilestone[];
}

interface SingleJourneyApiResponse {
  success: boolean;
  message: string;
  data: JourneyMilestone;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function getJourney(): Promise<JourneyMilestone[]> {
  const response = await fetch(`${API_BASE_URL}/journey`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result: JourneyApiResponse = await response.json();
  return result.data;
}

export async function createMilestone(
  milestone: JourneyInput,
): Promise<JourneyMilestone> {
  const response = await fetch(`${API_BASE_URL}/journey`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestone),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to create milestone.");
  }

  return (result as SingleJourneyApiResponse).data;
}

export async function updateMilestone(
  id: number,
  milestone: JourneyInput,
): Promise<JourneyMilestone> {
  const response = await fetch(`${API_BASE_URL}/journey/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestone),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update milestone.");
  }

  return (result as SingleJourneyApiResponse).data;
}

export async function deleteMilestone(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/journey/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Unable to delete milestone.");
  }
}
