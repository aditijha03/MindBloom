import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      setProfiles: (profiles) => {
        set({ profiles });
        if (profiles.length > 0 && !get().activeProfileId) {
          set({ activeProfileId: profiles[0].id || profiles[0].name });
        }
      },

      addProfile: (profile) => {
        const newProfiles = [...get().profiles, profile];
        set({ 
          profiles: newProfiles,
          activeProfileId: profile.id || profile.name
        });
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get();
        return profiles.find(p => (p.id || p.name) === activeProfileId) || profiles[0] || null;
      },

      clearProfiles: () => set({ profiles: [], activeProfileId: null })
    }),
    {
      name: 'mb-profile-storage',
    }
  )
);

export default useProfileStore;
