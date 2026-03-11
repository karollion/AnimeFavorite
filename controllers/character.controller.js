const Character = require("../models/character.model");
const cloudinary = require("../utils/cloudinary");
const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

// ===============================
// GET CHARACTERS BY ANIME
// ===============================
exports.getCharactersByAnime = asyncHandler(async (req, res) => {
  const characters = await Character.find({
    anime: req.params.animeId,
  }).lean();

  res.json(characters)
});


// ===============================
// GET CHARACTER BY ID
// ===============================
exports.getCharacter = asyncHandler(async (req, res) => {
  const character = await Character.findById(req.params.id)
    .populate("anime")
    .lean();

  if (!character || character.is_deleted) {
    return res.status(404).json({ message: "Character not found" })
  }

  res.json(character)
});


// ===============================
// CREATE CHARACTER
// ===============================
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
    "originWorld"
  ]

  const characterData = pick(req.body, allowed)

  const character = await Character.create(characterData)

  res.status(201).json(character)
});


// ===============================
// UPDATE PHOTO
// ===============================
exports.updatePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const character = await Character.findById(req.params.id)

  if (!character) {
    return res.status(404).json({ message: "Character not found" })
  }

  if (character.photo_public_id) {
    await cloudinary.uploader.destroy(character.photo_public_id)
  }

  character.photo = req.file.path
  character.photo_public_id = req.file.filename

  await character.save()

  res.json(character)
});


// ===============================
// UPDATE CHARACTER
// ===============================
exports.updateCharacter = asyncHandler(async (req, res) => {
  const allowed = [
    "firstName",
    "lastName",
    "gender",
    "role",
    "description",
    "species",
    "age",
    "originWorld"
  ]

  const updates = pick(req.body, allowed)

  const character = await Character.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  )

  if (!character) {
    return res.status(404).json({ message: "Character not found" })
  }

  res.json(character)
});


// ===============================
// SOFT DELETE CHARACTER
// ===============================
exports.deleteCharacter = asyncHandler(async (req, res) => {
  const character = await Character.findById(req.params.id)

  if (!character) {
    return res.status(404).json({ message: "Character not found" })
  }

  await character.softDelete();

  res.json({ message: "Character deleted" })
});