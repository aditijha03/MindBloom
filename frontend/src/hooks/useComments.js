import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export const useComments = (postId) => {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(`/posts/${postId}/comments`, {
        params: { page: pageParam }
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      const { page, hasMore } = lastPage.pagination;
      return hasMore ? page + 1 : undefined;
    },
    staleTime: 15000,
    enabled: !!postId
  });
};

export const useCreateComment = (postId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await api.post(`/posts/${postId}/comments`, { body });
      return data.data.comment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    }
  });
};

export const useDeleteComment = (postId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    }
  });
};
