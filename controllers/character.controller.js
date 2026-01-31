const Character = require("../models/character.model")

// Load all Characters
exports.getAll = async (req, res) => {
  try {
    const characters = await Character.find().sort({ name: 1 })
    res.json(characters)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// Load one Character
exports.getOne = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id)
    if (!character) {
      return res.status(404).json({ message: "Character not found" })
    }
    res.json(character)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};