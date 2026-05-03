import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export const useAssessments = () => {
  return useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const { data } = await api.get('/assessments');
      return data.data.assessments;
    }
  });
};

export const useSaveAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (assessmentData) => {
      const { data } = await api.post('/assessments', assessmentData);
      return data.data.assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    }
  });
};
