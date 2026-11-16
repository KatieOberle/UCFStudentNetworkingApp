const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/recent', authMiddleware, postController.getRecentPosts);
router.get('/user/:userId', authMiddleware, postController.getUserPosts);
router.patch('/:postId', authMiddleware, postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);

module.exports = router;
