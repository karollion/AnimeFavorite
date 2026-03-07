const Character = require("../models/character.model")

exports.createCharacter = async (req, res) => {
  try {

    const character = new Character(req.body)

    await character.save()

    res.status(201).json(character)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getCharactersByAnime = async (req, res) => {
  try {

    const characters = await Character.find({
      anime: req.params.animeId,
      is_deleted: false
    })

    res.json(characters)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getCharacter = async (req, res) => {
  try {

    const character = await Character.findById(req.params.id)
      .populate("anime")

    res.json(character)

  } catch (err) {
    res.status(500).json({ message: err.message })
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

    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (character.photo_public_id) {
      await cloudinary.uploader.destroy(character.photo_public_id);
    }

    character.photo = req.file.path;
    character.photo_public_id = req.file.filename;

    await character.save();

    res.json(character);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCharacter = async (req, res) => {
  try {

    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(character)

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.deleteCharacter = async (req, res) => {
  try {

    await Character.findByIdAndUpdate(req.params.id, {
      is_deleted: true,
      deleted_at: new Date()
    })

    res.json({ message: "Character deleted" })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}