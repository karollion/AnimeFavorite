const Character = require("../models/character.model");
const cloudinary = require("../utils/cloudinary");

const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

/* =====================================================
   GET CHARACTERS BY ANIME
   ===================================================== */

/**
 * Get all characters belonging to a specific anime
 *
 * @route   GET /api/anime/:animeId/characters
 * @access  Public
 *
 * Returns lightweight objects using lean()
 * for better read performance.
 */
exports.getCharactersByAnime = asyncHandler(async (req, res) => {
  const characters = await Character.find({
    anime: req.params.animeId,
  }).lean();

  res.json(characters);
});

/* =====================================================
   GET CHARACTER BY ID
   ===================================================== */

/**
 * Get single character with populated anime reference
 *
 * @route   GET /api/characters/:id
 * @access  Public
 *
 * Includes:
 * - anime relation
 */
exports.getCharacter = asyncHandler(async (req, res) => {
  const character = await Character.findById(req.params.id)
    .populate("anime")
    .lean();

  if (!character || character.is_deleted) {
    return res
      .status(404)
      .json({ message: "Character not found" });
  }

  res.json(character);
});

/* =====================================================
   CREATE CHARACTER
   ===================================================== */

/**
 * Create new character
 *
 * @route   POST /api/characters
 * @access  Admin
 *
 * Security:
 * - whitelist fields using pick()
 * - prevents mass assignment attacks
 */
exports.createCharacter = asyncHandler(async (req, res) => {
  const allowed = [
    "firstName",
    "lastName",
    "anime",
    "gender",
    "role",
    "description",
    "species",
    "age",
    "originWorld",
  ];

  const characterData = pick(req.body, allowed);

  const character = await Character.create(characterData);

  res.status(201).json(character);
});

/* =====================================================
   UPDATE CHARACTER PHOTO
   ===================================================== */

/**
 * Upload or replace character photo
 *
 * Flow:
 * 1. Validate upload
 * 2. Remove previous Cloudinary image
 * 3. Save new image metadata
 *
 * @route   PUT /api/characters/:id/photo
 * @access  Admin
 */
exports.updatePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded" });
  }

  const character = await Character.findById(req.params.id);

  if (!character) {
    return res
      .status(404)
      .json({ message: "Character not found" });
  }

  /* ---------- REMOVE OLD IMAGE ---------- */
  if (character.photo_public_id) {
    await cloudinary.uploader.destroy(
      character.photo_public_id
    );
  }

  /* ---------- SAVE NEW IMAGE ---------- */
  character.photo = req.file.path;
  character.photo_public_id = req.file.filename;

  await character.save();

  res.json(character);
});

/* =====================================================
   UPDATE CHARACTER DATA
   ===================================================== */

/**
 * Update character information
 *
 * @route   PUT /api/characters/:id
 * @access  Admin
 *
 * Only allowed fields are updated.
 */
exports.updateCharacter = asyncHandler(async (req, res) => {
  const allowed = [
    "firstName",
    "lastName",
    "gender",
    "role",
    "description",
    "species",
    "age",
    "originWorld",
  ];

  const updates = pick(req.body, allowed);

  const character = await Character.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!character) {
    return res
      .status(404)
      .json({ message: "Character not found" });
  }

  res.json(character);
});

/* =====================================================
   SOFT DELETE CHARACTER
   ===================================================== */

/**
 * Soft delete character
 *
 * Uses schema softDelete() method:
 * - sets is_deleted = true
 * - sets deleted_at timestamp
 *
 * @route   DELETE /api/characters/:id
 * @access  Admin
 */
exports.deleteCharacter = asyncHandler(async (req, res) => {
  const character = await Character.findById(req.params.id);

  if (!character) {
    return res
      .status(404)
      .json({ message: "Character not found" });
  }

  await character.softDelete();

  res.json({ message: "Character deleted" });
});