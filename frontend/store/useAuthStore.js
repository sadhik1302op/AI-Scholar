import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, 
  token: null,
  login: (userData, token) => set({ user: userData, token }),
  logout: () => set({ user: null, token: null }),
  updateXP: (xp, level, badges) => set((state) => ({
    user: { ...state.user, xpPoints: state.user.xpPoints + xp, level, badges }
  }))
}));
