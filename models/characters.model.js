const mongoose = require('mongoose');

//create shema for model
const CharacterSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String},
  role: { type: String, enum: ["main", "support", "side"], default: "side" },
  image_url: { type: String},
  description: { type: String},
  favorite: { type: Boolean}
});

// Create and export model for data in anime colection
module.exports = mongoose.model('Character', CharacterSchema);