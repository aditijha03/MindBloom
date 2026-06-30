const { getSupabaseUserClient } = require('../config/supabase');
const AppError = require('../utils/AppError');

const listPosts = async ({ page, limit, cursor, status, search }, token) => {
  let query = getSupabaseUserClient(token)
    .from('posts')
    .select('id, title, slug, status, published_at, author_id, profiles(display_name, avatar_url)', { count: 'exact' })
    .eq('status', status)
    .is('deleted_at', null);

  if (search) {
    query = query.textSearch('fts', search, { type: 'websearch' });
  }

  if (cursor) {
    query = query.lt('published_at', cursor);
  } else {
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
  }

  query = query.order('published_at', { ascending: false }).limit(limit);

  const { data, error, count } = await query;

  if (error) throw error;

  const hasMore = data.length === limit;
  const nextCursor = hasMore ? data[data.length - 1].published_at : null;

  return {
    posts: data,
    pagination: {
      total: count,
      page,
      limit,
      hasMore,
      nextCursor
    }
  };
};

const getPost = async (id, token) => {
  const { data, error } = await getSupabaseUserClient(token)
    .from('posts')
    .select('*, profiles(display_name, avatar_url)')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error || !data) throw new AppError('Post not found.', 404, 'NOT_FOUND');

  return data;
};

const createPost = async ({ authorId, title, body, status }, token) => {
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  const { data, error } = await getSupabaseUserClient(token)
    .from('posts')
    .insert({
      author_id: authorId,
      title,
      body,
      status,
      slug,
      published_at: publishedAt
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

const updatePost = async (id, userId, updates, token) => {
  const userClient = getSupabaseUserClient(token);

  // Verify ownership using user-scoped client
  const { data: post, error: getError } = await userClient
    .from('posts')
    .select('author_id, status, published_at')
    .eq('id', id)
    .single();

  if (getError || !post) throw new AppError('Post not found.', 404, 'NOT_FOUND');
  if (post.author_id !== userId) throw new AppError('Access denied.', 403, 'FORBIDDEN');

  if (updates.status === 'published' && !post.published_at) {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await userClient
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

const deletePost = async (id, userId, userRole, token) => {
  const userClient = getSupabaseUserClient(token);

  const { data: post, error: getError } = await userClient
    .from('posts')
    .select('author_id')
    .eq('id', id)
    .single();

  if (getError || !post) throw new AppError('Post not found.', 404, 'NOT_FOUND');

  const isOwner = post.author_id === userId;
  const isStaff = ['admin', 'moderator'].includes(userRole);

  if (!isOwner && !isStaff) throw new AppError('Access denied.', 403, 'FORBIDDEN');

  const { error } = await userClient
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;

  return { message: 'Post deleted successfully.' };
};

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};
