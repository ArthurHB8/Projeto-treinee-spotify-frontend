const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function resolveImageUrl(imageUrl: string | null): string | null {
  return imageUrl ? `${BASE_URL}${imageUrl}` : null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${init?.method ?? "GET"} ${path} failed with ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function upload<T>(path: string, file: File): Promise<T> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${BASE_URL}${path}`, { method: "POST", body });

  if (!response.ok) {
    throw new ApiError(response.status, `POST ${path} failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string) => request<T>(path, { method: "PATCH" }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload,
};
