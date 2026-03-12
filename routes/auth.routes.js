/* =====================================================
   Auth Routes
   ===================================================== */

/**
 * @file auth.routes.js
 * @description Routes for user authentication and profile management.
 *              Includes registration, login, logout, profile retrieval,
 *              avatar update, and user statistics.
 */

const express = require('express');
const router = express.Router();

const upload = require('../utils/upload');
const authMiddleware = require('../utils/authMiddleware');
const auth = require('../controllers/auth.controller');

/* =====================================================
   AUTHENTICATION ENDPOINTS
   ===================================================== */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', auth.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and create session
 * @access  Public
 */
router.post('/login', auth.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and destroy session
 * @access  Private
 * @middleware authMiddleware
 */
router.post('/logout', authMiddleware, auth.logout);

/* =====================================================
   USER PROFILE ENDPOINTS
   ===================================================== */

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user's profile
 * @access  Private
 * @middleware authMiddleware
 */
router.get('/me', authMiddleware, auth.getProfile);

/**
 * @route   GET /api/auth/me/stats
 * @desc    Get dynamic user stats (e.g., favorite characters count)
 * @access  Private
 * @middleware authMiddleware
 */
router.get('/me/stats', authMiddleware, auth.getUserStats);

/**
 * @route   PUT /api/auth/me/avatar
 * @desc    Update user's avatar image
 * @access  Private
 * @middleware authMiddleware, file upload
 */
router.put(
  '/me/avatar',
  authMiddleware,
  upload("avatars").single("avatar"),
  auth.updateAvatar
);

/**
 * @route   PUT /api/auth/me
 * @desc    Update user's profile details (description, email, birth year)
 * @access  Private
 * @middleware authMiddleware
 */
router.put('/me', authMiddleware, auth.updateProfile);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */

module.exports = router;