import { useAuth } from '@clerk/clerk-react';

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
    throw new ApiError('VITE_API_URL is not set. Configure it in your frontend environment.');
  }

  const token = await getToken();
  console.log('[AuthRequest] Token obtained:', token ? 'YES (length: ' + token.length + ')' : 'NO');

  if (!token) {
    throw new ApiError('No authentication token available. Please sign in again.', { status: 401 });
  }

  const {
    method = 'GET',
    headers = {},
    body,
    signal,
  } = options;

  console.log('[AuthRequest] Sending request to:', `${API_BASE_URL}${path}`);
  console.log('[AuthRequest] Authorization header:', 'Bearer [TOKEN]');

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

  console.log('[AuthRequest] Response status:', res.status);

  return handleResponse(res);
};

export const createAuthRequester = (getToken) => {
  return {
    get: (path, options = {}) => authRequest(getToken, path, { ...options, method: 'GET' }),
    post: (path, body, options = {}) => authRequest(getToken, path, { ...options, method: 'POST', body }),
    put: (path, body, options = {}) => authRequest(getToken, path, { ...options, method: 'PUT', body }),
    patch: (path, body, options = {}) => authRequest(getToken, path, { ...options, method: 'PATCH', body }),
    delete: (path, options = {}) => authRequest(getToken, path, { ...options, method: 'DELETE' }),
  };
};

export const useAuthRequest = () => {
  const { getToken } = useAuth();
  return createAuthRequester(getToken);
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