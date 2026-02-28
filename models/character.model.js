const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  anime: { type: ObjectId, ref: "Anime", required: true },
  
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

  imageUrl: { type: String, trim: true },
  description: { type: String, trim: true },

  species: { type: String, trim: true },
  age: { type: Number },

  originWorld: { type: String, trim: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);