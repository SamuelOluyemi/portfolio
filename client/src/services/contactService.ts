import type { ContactFormData, ContactApiResponse } from "../types/contact";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function submitContactForm(
  formData: ContactFormData,
): Promise<ContactApiResponse> {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const result: ContactApiResponse = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      ...result,
    };
  }

  return result;
}
