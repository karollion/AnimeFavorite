const Character = require("../models/character.model")
const cloudinary = require("../utils/cloudinary")
const pick = require("../utils/pickAllowedFields")

// ===============================
// GET CHARACTERS BY ANIME
// ===============================
exports.getCharactersByAnime = async (req, res) => {
  try {

    const characters = await Character.find({
      anime: req.params.animeId,
    })

    res.json(characters)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// GET CHARACTER BY ID
// ===============================
exports.getCharacter = async (req, res) => {
  try {

    const character = await Character.findById(req.params.id)
      .populate("anime")

    if (!character || character.is_deleted) {
      return res.status(404).json({ message: "Character not found" })
    }

    res.json(character)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// CREATE CHARACTER
// ===============================
exports.createCharacter = async (req, res) => {
  try {

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

  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


// ===============================
// UPDATE PHOTO
// ===============================
exports.updatePhoto = async (req, res) => {
  try {

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

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// UPDATE CHARACTER
// ===============================
exports.updateCharacter = async (req, res) => {
  try {

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

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// ===============================
// SOFT DELETE CHARACTER
// ===============================
exports.deleteCharacter = async (req, res) => {
  try {

    const character = await Character.findById(req.params.id)

    if (!character) {
      return res.status(404).json({ message: "Character not found" })
    }

    await character.softDelete();

    res.json({ message: "Character deleted" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}