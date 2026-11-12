const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export interface AdminUser {
  id: number;
  email: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  admin: AdminUser;
}

interface AuthStatusResponse {
  success: boolean;
  authenticated: boolean;
  adminId: number;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
}

// Login administrator
export async function loginAdmin(
  email: string,
  password: string,
): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = result as ApiErrorResponse;
    throw new Error(error.message || "Login failed.");
  }

  return (result as LoginResponse).admin;
}

// Check current authentication status
export async function checkAuth(): Promise<AuthStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated.");
  }

  return response.json() as Promise<AuthStatusResponse>;
}

// Logout administrator
export async function logoutAdmin(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}
