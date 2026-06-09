// import { useUserStore } from "@/store/userStore";

// Base API configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// API Error class for better error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Main API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  // Get auth token from user store
  const token: string = "";

  // Prepare request headers
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...((options.headers as Record<string, string>) || {}),
  };

  let body = options.body;

  // Handle body formatting and Content-Type
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  // Prepare request configuration
  const config: RequestInit = {
    ...options,
    headers,
    body,
  };

  // Make the request
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type");
  const isJSON = contentType?.includes("application/json");

  // Parse response
  const data: T = isJSON ? await response.json() : await response.text();

  // Handle errors
  if (!response.ok) {
    const err = data as Record<string, unknown>;
    throw new APIError(
      (err?.message as string) || String(data) || "An error occurred",
      response.status,
      data,
    );
  }

  return data;
};

// Convenience methods for different HTTP verbs
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      body: data as BodyInit,
      ...options,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      body: data as BodyInit,
      ...options,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      body: data as BodyInit,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { method: "DELETE", ...options }),
};

// Export default
export default api;
