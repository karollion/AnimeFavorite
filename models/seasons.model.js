const mongoose = require("mongoose");

const SeasonSchema = new mongoose.Schema({
  season_number: { type: Number, required: true },

  title: { type: String, required: true, trim: true },

  year: { type: Number },
  episodes_count: { type: Number },

  rating: { type: Number, min: 0, max: 10 },

  cover_image: { type: String, trim: true },

  release_date: { type: Date },

  notes: { type: String, trim: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Season', SeasonSchema);