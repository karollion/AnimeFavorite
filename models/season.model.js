const mongoose = require("mongoose");

const SeasonSchema = new mongoose.Schema({
  anime: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Anime",
    required: true
  },
  
  season_number: { type: Number, required: true },

  title: { type: String, required: true, trim: true },

  year: { type: Number },
  episodes_count: { type: Number },

  rating: { type: Number, min: 0, max: 10 },

  season_cover: { type: String, trim: true },
  cover_public_id: { type: String },

  release_date: { type: Date },

  notes: { type: String, trim: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

SeasonSchema.index( { anime: 1, season_number: 1 }, { unique: true } );

module.exports = mongoose.model('Season', SeasonSchema);