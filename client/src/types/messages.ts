export type MessageStatus = "unread" | "read" | "archived";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface MessagesApiResponse {
  success: boolean;
  message?: string;
  data?: ContactMessage[];
}

export interface MessageApiResponse {
  success: boolean;
  message?: string;
  data?: ContactMessage;
}
