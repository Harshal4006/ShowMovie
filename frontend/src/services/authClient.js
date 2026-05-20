const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, data });
  }

  return data;
};

export const authRequest = async (getToken, path, options = {}) => {
  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_URL is not set.');
  }

  const token = await getToken();
  if (!token) {
    throw new ApiError('No authentication token available.', { status: 401 });
  }

  const { method = 'GET', headers = {}, body, signal } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
  });

  return handleResponse(res);
};

export const request = async (path, options = {}) => {
  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_URL is not set.');
  }

  const { method = 'GET', token, headers = {}, body, signal } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body != null ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    signal,
  });

  return handleResponse(res);
};

export default request;