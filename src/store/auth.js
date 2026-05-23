import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import client from '../api/client';

export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      async login(email, password) {
        const res = await client.post('/auth/login', { email, password });
        set({ token: res.data.token, user: res.data.user });
        return res.data.user;
      },

      async register(payload) {
        const res = await client.post('/auth/register', payload);
        set({ token: res.data.token, user: res.data.user });
        return res.data.user;
      },

      logout() {
        set({ token: null, user: null });
      },

      isAuthenticated() {
        return Boolean(useAuth.getState().token);
      },
    }),
    {
      name: 'greenit-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
