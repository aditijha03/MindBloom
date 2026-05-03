const { supabaseAdmin } = require('../config/supabase');
const AppError = require('../utils/AppError');

const listComments = async (postId, { page, limit }) => {
  // Verify post exists and is published
  const { data: post, error: postError } = await supabaseAdmin
    .from('posts')
    .select('id, status')
    .eq('id', postId)
    .single();

  if (postError || !post || post.status !== 'published') {
    throw new AppError('Post not found or not accessible.', 404, 'NOT_FOUND');
  }

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from('comments')
    .select('*, profiles(display_name, avatar_url)', { count: 'exact' })
    .eq('post_id', postId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    comments: data,
    pagination: {
      total: count,
      page,
      limit,
      hasMore: data.length === limit
    }
  };
};

const createComment = async ({ postId, authorId, body }) => {
  // Verify post is published
  const { data: post, error: postError } = await supabaseAdmin
    .from('posts')
    .select('status')
    .eq('id', postId)
    .single();

  if (postError || !post || post.status !== 'published') {
    throw new AppError('Post not found or not accessible.', 404, 'NOT_FOUND');
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      body
    })
    .select('*, profiles(display_name, avatar_url)')
    .single();

  if (error) throw error;

  return data;
};

const deleteComment = async (postId, commentId, userId, userRole) => {
  const { data: comment, error: getError } = await supabaseAdmin
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .eq('post_id', postId)
    .single();

  if (getError || !comment) throw new AppError('Comment not found.', 404, 'NOT_FOUND');

  const isOwner = comment.author_id === userId;
  const isStaff = ['admin', 'moderator'].includes(userRole);

  if (!isOwner && !isStaff) throw new AppError('Access denied.', 403, 'FORBIDDEN');

  const { error } = await supabaseAdmin
    .from('comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', commentId);

  if (error) throw error;

  return { message: 'Comment deleted successfully.' };
};

module.exports = {
  listComments,
  createComment,
  deleteComment
};
