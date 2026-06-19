import { useUserStore } from "@/store/userStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = useUserStore.getState().user?.token;
  const jti = useUserStore.getState().user?.jti;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(token && { AuthToken: jti }),
    ...((options.headers as Record<string, string>) || {}),
  };

  let body = options.body;

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...options,
    headers,
    body,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  const contentType = response.headers.get("content-type");
  const isJSON = contentType?.includes("application/json");
  // Read the body as text first. An empty body (e.g. Rails `head :created`)
  // served with a JSON content-type makes response.json() throw, which TanStack
  // treats as a retryable error and re-fires the mutation (so a single OTP send
  // ended up hitting the endpoint 3×). Only parse when there's actually a body.
  const text = await response.text();
  const raw: unknown = isJSON && text ? JSON.parse(text) : text;

  if (!response.ok) {
    const errPayload = raw as { error?: { message?: string } };
    throw new APIError(
      errPayload?.error?.message ?? "An error occurred",
      response.status,
      raw,
    );
  }

  const payload = raw as { data?: unknown };
  return (payload?.data !== undefined ? payload.data : raw) as T;
};

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

  delete: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      method: "DELETE",
      body: data as BodyInit,
      ...options,
    }),
};

export default api;
