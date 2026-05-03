import { useQuery, useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '../api/client';

export const usePosts = (params) => {
  return useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await api.get('/posts', {
        params: { ...params, cursor: pageParam }
      });
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor || undefined,
    staleTime: 30000,
    placeholderData: keepPreviousData
  });
};

export const usePost = (id) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${id}`);
      return data.data.post;
    },
    enabled: !!id
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost) => {
      const { data } = await api.post('/posts', newPost);
      return data.data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useUpdatePost = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates) => {
      const { data } = await api.patch(`/posts/${id}`, updates);
      return data.data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};
