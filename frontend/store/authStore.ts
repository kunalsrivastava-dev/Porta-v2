import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DATA_ENTRY' | 'INTERN';
  permissions?: {
    influencer: { read: boolean; write: boolean };
    bde: { read: boolean; write: boolean };
  };
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),

  logout: () => {
    Cookies.remove('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const token = Cookies.get('token');
    if (token) {
      set({
        token,
        isAuthenticated: true,
      });
    }
    set({ isLoading: false });
  },
}));
