import { create } from 'zustand';

export interface UserData {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  customAvatar?: string;
  bio?: string;
  createdAt: string;
  lastLogin: string;
}

interface UserStore {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserData | null) => void;
  fetchUser: () => Promise<void>;
  updateUser: (updates: Partial<UserData>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, error: null }),

  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      set({ user: userData, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user', 
        isLoading: false 
      });
    }
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  clearUser: () => set({ user: null, error: null }),
}));
