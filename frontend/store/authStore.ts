import { create } from 'zustand';
import Cookies from 'js-cookie';
import { userAPI } from '@/lib/api/endpoints';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DATA_ENTRY' | 'BDA';
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

  hydrate: async () => {
    const token = Cookies.get('token');
    if (token) {
      set({
        token,
        isAuthenticated: true,
        isLoading: true, // Keep loading while we fetch user
      });
      try {
        const res = await userAPI.getCurrentUser();
        set({ user: res.data.user });
      } catch (err: any) {
        console.error('Failed to restore user session', err);
        if (err.response?.status === 401) {
          Cookies.remove('token');
          set({ isAuthenticated: false, token: null });
        }
      }
    }
    set({ isLoading: false });
  },
}));
