const postsService = require('../services/posts.service');
const { success, paginated } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const listPosts = asyncHandler(async (req, res) => {
  const { posts, pagination } = await postsService.listPosts(req.query);
  return paginated(res, posts, pagination);
});

const getPost = asyncHandler(async (req, res) => {
  const post = await postsService.getPost(req.params.id);
  return success(req, res, { post });
});

const createPost = asyncHandler(async (req, res) => {
  const post = await postsService.createPost({
    authorId: req.user.id,
    ...req.body
  });
  return success(req, res, { post }, 201);
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await postsService.updatePost(req.params.id, req.user.id, req.body);
  return success(req, res, { post });
});

const deletePost = asyncHandler(async (req, res) => {
  const result = await postsService.deletePost(req.params.id, req.user.id, req.user.role);
  return success(req, res, result);
});

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};
