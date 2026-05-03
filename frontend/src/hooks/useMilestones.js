import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export const useMilestones = (childId) => {
  return useQuery({
    queryKey: ['milestones', childId],
    queryFn: async () => {
      const { data } = await api.get(`/milestones/${childId}`);
      return data.data.milestones;
    },
    enabled: !!childId
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (milestoneData) => {
      const { data } = await api.post('/milestones', milestoneData);
      return data.data.milestone;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', data.child_id] });
    }
  });
};

export const useUpdateMilestone = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(`/milestones/${id}`, updates);
      return data.data.milestone;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', data.child_id] });
    }
  });
};
