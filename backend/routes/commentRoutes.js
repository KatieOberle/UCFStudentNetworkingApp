// Katie: comment routing javascript file
const express = require('express'); // integrate express
const router = express.Router();

// Link to controller and middleware
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Included comment endpoints
// Create comment on post
router.post('/:postId', authMiddleware, commentController.createComment);

// Retrieve comments for post
router.get('/:postId', authMiddleware, commentController.getPostComments);

// Update comment
router.patch('/:replyId', authMiddleware, commentController.updateComment);

// Delete comment
router.delete('/:replyId', authMiddleware, commentController.deleteComment);

module.exports = router;
