import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

// Attach JWT from the persisted auth store on every request
client.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('greenit-auth');
    if (raw) {
      const token = JSON.parse(raw)?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    /* ignore */
  }
  return config;
});

// On 401, clear the session so the UI can redirect to login
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('greenit-auth');
      } catch {
        /* ignore */
      }
    }
    return Promise.reject(error);
  },
);

/**
 * GET that gracefully falls back to bundled demo data when the backend is
 * unreachable. Returns { data, live } so the UI can flag demo mode.
 */
export async function getWithFallback(url, fallback, config) {
  try {
    const res = await client.get(url, config);
    return { data: res.data, live: true };
  } catch {
    return { data: fallback, live: false };
  }
}

export default client;
