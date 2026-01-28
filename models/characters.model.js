const mongoose = require('mongoose');

//create shema for model
const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["main", "support", "side"], default: "side" },
  image_url: String,
  description: String,
  favorite: Boolean
});

// Create and export model for data in anime colection
module.exports = mongoose.model('Character', CharacterSchema);