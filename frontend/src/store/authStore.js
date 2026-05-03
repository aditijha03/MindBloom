import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken) => set({
    user,
    accessToken,
    isAuthenticated: !!accessToken
  }),

  clearAuth: () => set({
    user: null,
    accessToken: null,
    isAuthenticated: false
  }),

  setAccessToken: (accessToken) => set({ accessToken })
}));

export default useAuthStore;
