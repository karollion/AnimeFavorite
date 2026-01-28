const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },

  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    default: "unknown"
  },
  role: { 
    type: String, 
    enum: ["main", "support", "side"], 
    default: "side" 
  },

  imageUrl: { type: String },
  description: { type: String },
  species: { type: String },      // human, demon, elf
  age: { type: Number },          // character age
  originWorld: { type: String },  // from what world
  favorite: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);