/* =====================================================
   UserAnime Model
   ===================================================== */

/**
 * @file userAnime.model.js
 * @description Mongoose schema and model for tracking user's anime list.
 *              Tracks status, rating, favorites, and personal opinion for each anime per user.
 */

const mongoose = require("mongoose");

/* =====================================================
   SCHEMA DEFINITION
   ===================================================== */
const UserAnimeSchema = new mongoose.Schema(
  {
    /** Reference to the user */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /** Reference to the anime */
    anime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anime",
      required: true
    },

    /** User's current status for the anime */
    status: {
      type: String,
      enum: ["not watched", "planned", "watching", "completed", "suspended", "abandoned"],
      default: "not watched"
    },

    /** User's rating for the anime (0–10, rounded to nearest integer) */
    rating: {
      type: Number,
      min: 0,
      max: 10,
      set: v => Math.round(v)
    },

    /** User's personal opinion / review text */
    my_opinion: {
      type: String,
      trim: true
    },

    /** Mark this anime as favorite */
    favorite_anime: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* =====================================================
   INDEXES
   ===================================================== */
// Ensure one entry per user-anime pair
UserAnimeSchema.index({ user: 1, anime: 1 }, { unique: true });

// Quickly query favorites for a user
UserAnimeSchema.index({ user: 1, favorite_anime: 1 });

/* =====================================================
   EXPORT MODEL
   ===================================================== */
module.exports = mongoose.model("UserAnime", UserAnimeSchema);