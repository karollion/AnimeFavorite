/* =====================================================
   Character Routes
   ===================================================== */

/**
 * @file character.routes.js
 * @description Routes for managing characters in the app.
 *              Includes retrieval by anime or ID, creation,
 *              photo updates, general updates, and soft deletion.
 */

const express = require("express");
const router = express.Router();

const upload = require('../utils/upload');
const character = require("../controllers/character.controller");
const auth = require("../utils/authMiddleware");
const admin = require("../utils/adminMiddleware");

/* =====================================================
   CHARACTER RETRIEVAL ENDPOINTS
   ===================================================== */

/**
 * @route   GET /api/characters/anime/:animeId
 * @desc    Get all characters for a specific anime
 * @access  Public
 */
router.get("/anime/:animeId", character.getCharactersByAnime);

/**
 * @route   GET /api/characters/:id
 * @desc    Get a character by its ID
 * @access  Public
 */
router.get("/:id", character.getCharacter);

/* =====================================================
   CHARACTER CREATE / UPDATE / DELETE ENDPOINTS
   ===================================================== */

/**
 * @route   POST /api/characters
 * @desc    Create a new character
 * @access  Private (admin only)
 * @middleware auth, admin
 */
router.post("/", auth, admin, character.createCharacter);

/**
 * @route   PUT /api/characters/:id/photo
 * @desc    Update character's photo
 * @access  Private (admin only)
 * @middleware auth, admin, file upload
 */
router.put(
  "/:id/photo",
  auth,
  admin,
  upload("characters").single("photo"),
  character.updatePhoto
);

/**
 * @route   PUT /api/characters/:id
 * @desc    Update character's details
 * @access  Private (admin only)
 * @middleware auth, admin
 */
router.put("/:id", auth, admin, character.updateCharacter);

/**
 * @route   DELETE /api/characters/:id
 * @desc    Soft delete a character
 * @access  Private (admin only)
 * @middleware auth, admin
 */
router.delete("/:id", auth, admin, character.deleteCharacter);

/* =====================================================
   EXPORT ROUTER
   ===================================================== */

module.exports = router;