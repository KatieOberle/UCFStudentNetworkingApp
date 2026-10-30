const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/search', authMiddleware, profileController.searchProfile);
router.get('/:userId', profileController.getProfile);
router.patch('/:userId', authMiddleware, profileController.updateProfile);

module.exports = router;
