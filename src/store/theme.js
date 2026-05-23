import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export const useTheme = create(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (t) => { applyTheme(t); set({ theme: t }); },
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: 'greenit-theme',
      onRehydrateStorage: () => (state) => { if (state) applyTheme(state.theme); },
    },
  ),
);
