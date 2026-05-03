import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export const useChildProfiles = () => {
  return useQuery({
    queryKey: ['childProfiles'],
    queryFn: async () => {
      const { data } = await api.get('/child-profiles');
      return data.data.profiles;
    }
  });
};

export const useCreateChildProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      const { data } = await api.post('/child-profiles', profileData);
      return data.data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles'] });
    }
  });
};

export const useUpdateChildProfile = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(`/child-profiles/${id}`, updates);
      return data.data.profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['childProfiles'] });
    }
  });
};
