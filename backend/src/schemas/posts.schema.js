const Joi = require('joi');

const PostIdParams = Joi.object({
  id: Joi.string().uuid().required()
});

const ListPostsQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  cursor: Joi.string().isoDate().optional(),
  status: Joi.string().valid('draft', 'published', 'archived').default('published'),
  search: Joi.string().max(200).optional()
});

const CreatePostBody = Joi.object({
  title: Joi.string().min(3).max(200).trim().required(),
  body: Joi.string().min(10).required(),
  status: Joi.string().valid('draft', 'published').default('draft')
});

const UpdatePostBody = Joi.object({
  title: Joi.string().min(3).max(200).trim().optional(),
  body: Joi.string().min(10).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').optional()
}).min(1);

module.exports = {
  PostIdParams,
  ListPostsQuery,
  CreatePostBody,
  UpdatePostBody
};
