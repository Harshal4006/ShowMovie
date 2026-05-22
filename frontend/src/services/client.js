// Replaced by authClient.js - kept for reference

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Superseded by authClient.js exports
export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Superseded by authClient.js exports
export const request = async (path, options = {}) => {
  if (!API_BASE_URL) {
    throw new ApiError(
      "VITE_API_URL is not set. Configure it in your frontend environment (Vercel Project → Settings → Environment Variables) and redeploy."
    );
  }

  const {
    method = "GET",
    token,
    headers = {},
    body,
    signal,
  } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body != null ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, data });
  }

  return data;
};
