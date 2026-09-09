// In production the API is served by the same Vercel deployment through the
// /api rewrite. This avoids baking a stale localhost or external URL into the
// client bundle. Local development keeps using the standalone API server.
const API_URL =
  process.env.NODE_ENV === 'production'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    if ((window as any).Clerk?.session) {
      const clerkToken = await (window as any).Clerk.session.getToken();
      if (clerkToken) return clerkToken;
    }
  } catch (err) {
    console.warn('Error obtaining Clerk token:', err);
  }
  return localStorage.getItem('atopic_token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
};
