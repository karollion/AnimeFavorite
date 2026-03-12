/* =====================================================
   Season Model
   ===================================================== */

/**
 * @file season.model.js
 * @description Mongoose schema and model for Season entities.
 *              Each season belongs to an Anime and can have rating, episodes count,
 *              cover image, release date, and notes. Includes soft delete plugin.
 */

const mongoose = require("mongoose");
const softDelete = require("../utils/softDelete.plugin");

/* =====================================================
   SCHEMA DEFINITION
   ===================================================== */
const SeasonSchema = new mongoose.Schema(
  {
    /** Reference to the anime this season belongs to */
    anime: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anime",
      required: true
    },

    /** Sequential number of the season */
    season_number: { type: Number, required: true },

    /** Title of the season */
    title: { type: String, required: true, trim: true },

    /** Year of release */
    year: { type: Number },

    /** Number of episodes in this season */
    episodes_count: { type: Number },

    /** Optional average rating of the season */
    rating: { type: Number, min: 0, max: 10 },

    /** URL to season cover image */
    season_cover: { type: String, trim: true },

    /** Cloudinary public ID of the cover */
    cover_public_id: { type: String },

    /** Official release date */
    release_date: { type: Date },

    /** Optional notes about the season */
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

/* =====================================================
   INDEXES
   ===================================================== */
// Ensure unique season numbers per anime
SeasonSchema.index({ anime: 1, season_number: 1 }, { unique: true });

// Index for fast lookup of seasons by anime
SeasonSchema.index({ anime: 1 });

/* =====================================================
   PLUGINS
   ===================================================== */
SeasonSchema.plugin(softDelete);

/* =====================================================
   EXPORT MODEL
   ===================================================== */
module.exports = mongoose.model('Season', SeasonSchema);