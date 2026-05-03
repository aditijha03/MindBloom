import { create } from 'zustand';
import axios from 'axios';

// The backend endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const useBloomBotStore = create((set, get) => ({
  isOpen: false,
  currentScreen: 'welcome', // 'welcome', 'disclaimer', 'emotion-checkin', 'chat', 'activity', 'crisis'
  userType: null, // 'child' | 'parent'
  ageTier: null, // 'early' | 'middle' | 'tween'
  nickname: '',
  sessionId: null,
  history: [],
  isTyping: false,
  error: null,
  
  // Actions
  setIsOpen: (isOpen) => set({ isOpen }),
  setScreen: (screen) => set({ currentScreen: screen }),
  setUserType: (type) => set({ userType: type }),
  setAgeTier: (tier) => set({ ageTier: tier }),
  setNickname: (name) => set({ nickname: name }),
  
  startSession: async () => {
    try {
      set({ isTyping: true, error: null });
      const { userType, ageTier } = get();
      
      const response = await axios.post(`${API_URL}/bloombot/session`, {
        userType,
        ageTier
      });
      
      const { sessionId, disclaimer } = response.data;
      
      set({ 
        sessionId, 
        history: [{ role: 'assistant', content: disclaimer }],
        isTyping: false 
      });
    } catch (err) {
      console.error(err);
      set({ error: 'Failed to start session. Please try again.', isTyping: false });
    }
  },
  
  sendMessage: async (message) => {
    try {
      set((state) => ({
        history: [...state.history, { role: 'user', content: message }],
        isTyping: true,
        error: null
      }));
      
      const { sessionId } = get();
      
      const response = await axios.post(`${API_URL}/bloombot/message`, {
        sessionId,
        message
      });
      
      const { text, isCrisis } = response.data;
      
      if (isCrisis) {
        set({ currentScreen: 'crisis' });
      }
      
      set((state) => ({
        history: [...state.history, { role: 'assistant', content: text }],
        isTyping: false
      }));
    } catch (err) {
      console.error(err);
      set((state) => ({
        history: [...state.history, { role: 'assistant', content: 'Bloom is taking a little rest right now. Please try again in a few minutes!' }],
        isTyping: false
      }));
    }
  },
  
  clearSession: () => set({
    currentScreen: 'welcome',
    userType: null,
    ageTier: null,
    nickname: '',
    sessionId: null,
    history: [],
    error: null
  })
}));

export default useBloomBotStore;
