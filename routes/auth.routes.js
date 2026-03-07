const express = require('express');
const router = express.Router();

const upload = require('../utils/upload');
const authMiddleware = require('../utils/authMiddleware');
const auth = require('../controllers/auth.controller');

// ===============================
// AUTH
// ===============================
router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', authMiddleware, auth.logout);

// ===============================
// USER
// ===============================
router.get('/me', authMiddleware, auth.getProfile);
router.get('/me/stats', authMiddleware, auth.getUserStats);
router.put('/me/avatar', authMiddleware, upload("avatars").single("avatar"), auth.updateAvatar);
router.put('/me', authMiddleware, auth.updateProfile);

module.exports = router;

