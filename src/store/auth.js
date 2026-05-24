import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import client from '../api/client';

// Seeded demo accounts (mirror the backend DataSeeder). Used as an offline
// fallback so login works even when the Spring Boot backend is not running.
const DEMO_USERS = {
  'admin@greenit.org': {
    password: 'admin123',
    user: { id: 1, email: 'admin@greenit.org', fullName: 'Administrateur GreenIT', role: 'ADMIN', organization: 'GreenIT', country: 'Maroc' },
  },
  'demo@greenit.org': {
    password: 'demo123',
    user: { id: 2, email: 'demo@greenit.org', fullName: 'Utilisateur Demo', role: 'PRO_IT', organization: 'Demo Corp', country: 'Senegal' },
  },
};

export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      offline: false,

      async login(email, password) {
        const key = email?.toLowerCase()?.trim();
        try {
          const res = await client.post('/auth/login', { email, password });
          set({ token: res.data.token, user: res.data.user, offline: false });
          return res.data.user;
        } catch (err) {
          // Backend up + wrong password -> 401: only fall back when the entered
          // credentials match a seeded demo account (handles proxy 500/502 too).
          const demo = DEMO_USERS[key];
          if (demo && demo.password === password) {
            set({ token: 'demo-offline-token', user: demo.user, offline: true });
            return demo.user;
          }
          if (!err?.response) {
            const e = new Error('BACKEND_OFFLINE');
            e.offline = true;
            throw e;
          }
          throw err;
        }
      },

      async register(payload) {
        try {
          const res = await client.post('/auth/register', payload);
          set({ token: res.data.token, user: res.data.user, offline: false });
          return res.data.user;
        } catch (err) {
          // Surface real validation errors (400/409); fall back offline only when
          // the backend is unreachable (network error or gateway 5xx from the proxy).
          const status = err?.response?.status;
          if (!err?.response || status >= 500) {
            const user = {
              id: Date.now(),
              email: payload.email,
              fullName: payload.fullName,
              role: payload.role || 'GRAND_PUBLIC',
              organization: payload.organization,
              country: payload.country,
            };
            set({ token: 'demo-offline-token', user, offline: true });
            return user;
          }
          throw err;
        }
      },

      logout() {
        set({ token: null, user: null, offline: false });
      },

      isAuthenticated() {
        return Boolean(useAuth.getState().token);
      },
    }),
    {
      name: 'greenit-auth',
      partialize: (state) => ({ token: state.token, user: state.user, offline: state.offline }),
    },
  ),
);
