const commentsService = require('../services/comments.service');
const { success, paginated } = require('../utils/response');
const asyncHandler = require('../utils/asyncHandler');

const listComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { comments, pagination } = await commentsService.listComments(postId, req.query, req.token);
  return paginated(res, comments, pagination);
});

const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comment = await commentsService.createComment({
    postId,
    authorId: req.user.id,
    body: req.body.body
  }, req.token);
  return success(req, res, { comment }, 201);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const result = await commentsService.deleteComment(postId, commentId, req.user.id, req.user.role, req.token);
  return success(req, res, result);
});

module.exports = {
  listComments,
  createComment,
  deleteComment
};
