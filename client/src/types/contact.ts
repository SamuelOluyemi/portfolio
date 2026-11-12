export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  };
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
  };
}
