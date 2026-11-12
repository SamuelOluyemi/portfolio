import type { JourneyMilestone } from "../types/journey";

interface JourneyApiResponse {
  success: boolean;
  data: JourneyMilestone[];
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
