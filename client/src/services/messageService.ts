import type {
  ContactMessage,
  MessageApiResponse,
  MessagesApiResponse,
  MessageStatus,
} from "../types/messages";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function parseResponse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result as T;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    credentials: "include",
  });

  const result = await parseResponse<MessagesApiResponse>(response);

  return result.data || [];
}

export async function updateMessageStatus(
  id: number,
  status: MessageStatus,
): Promise<ContactMessage> {
  const response = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await parseResponse<MessageApiResponse>(response);

  if (!result.data) {
    throw new Error("The updated message was not returned.");
  }

  return result.data;
}

export async function deleteMessage(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  await parseResponse<{ success: boolean; message?: string }>(response);
}
