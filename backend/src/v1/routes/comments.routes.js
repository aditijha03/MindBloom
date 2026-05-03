const express = require('express');
const commentsController = require('../../controllers/comments.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate');
const { CommentParams, ListCommentsQuery, CreateCommentBody } = require('../../schemas/comments.schema');

const router = express.Router({ mergeParams: true });

router.get('/:postId/comments', validate.params(CommentParams), validate.query(ListCommentsQuery), commentsController.listComments);
router.post('/:postId/comments', authenticate, validate.params(CommentParams), validate(CreateCommentBody), commentsController.createComment);
router.delete('/:postId/comments/:commentId', authenticate, validate.params(CommentParams), commentsController.deleteComment);

module.exports = router;
