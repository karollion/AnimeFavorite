const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  anime: { type: mongoose.Schema.Types.ObjectId, ref: "Anime", required: true },

  rating: { type: Number, min: 0, max: 10, required: true },
  review_text: { type: String, trim: true },
  contains_spoilers: { type: Boolean, default: false },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

ReviewSchema.index({ user: 1, anime: 1 }, { unique: true }) //Jedna recenzja na usera

module.exports = mongoose.model('Review', ReviewSchema);