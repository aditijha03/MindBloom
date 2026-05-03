const Joi = require('joi');

const CommentParams = Joi.object({
  postId: Joi.string().uuid().required(),
  commentId: Joi.string().uuid().optional()
});

const ListCommentsQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20)
});

const CreateCommentBody = Joi.object({
  body: Joi.string().min(1).max(2000).trim().required()
});

module.exports = {
  CommentParams,
  ListCommentsQuery,
  CreateCommentBody
};
