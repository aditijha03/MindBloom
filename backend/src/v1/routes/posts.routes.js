const express = require('express');
const postsController = require('../../controllers/posts.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { PostIdParams, ListPostsQuery, CreatePostBody, UpdatePostBody } = require('../../schemas/posts.schema');

const router = express.Router();

router.get('/', validate.query(ListPostsQuery), postsController.listPosts);
router.post('/', authenticate, validate(CreatePostBody), postsController.createPost);
router.get('/:id', validate.params(PostIdParams), postsController.getPost);
router.patch('/:id', authenticate, validate.params(PostIdParams), validate(UpdatePostBody), postsController.updatePost);
router.delete('/:id', authenticate, validate.params(PostIdParams), postsController.deletePost);

module.exports = router;
