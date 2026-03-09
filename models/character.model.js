const mongoose = require('mongoose');
const softDelete = require("../utils/softDelete.plugin");

const CharacterSchema = new mongoose.Schema({
  anime: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Anime",
    required: true
  },
  
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

  photo: { type: String, trim: true },
  photo_public_id: { type: String },

  description: { type: String, trim: true },

  species: { type: String, trim: true },
  age: { type: Number },

  originWorld: { type: String, trim: true },

}, { timestamps: true });

CharacterSchema.index({ anime: 1 }, {partialFilterExpression: { is_deleted: { $ne: true } }});
CharacterSchema.index({ anime: 1 });

CharacterSchema.plugin(softDelete);

module.exports = mongoose.model('Character', CharacterSchema);