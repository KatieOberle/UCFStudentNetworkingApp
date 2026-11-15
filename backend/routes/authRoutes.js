const express = require('express');
const router = express.Router();

const {
	login,
	logout,
	register,
	verifyEmail,
	me,
	forgotPassword,
	resetPassword,
	debugDeleteAccount
} = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/verify', verifyEmail);
router.get('/me', me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.delete('/debug-delete-account', debugDeleteAccount);

module.exports = router;
