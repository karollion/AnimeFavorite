/* =====================================================
   Character Model
   ===================================================== */

/**
 * @file character.model.js
 * @description Mongoose schema and model for Character entities.
 *              Includes fields for first/last name, role, gender,
 *              anime reference, photo, species, age, origin world,
 *              and soft delete plugin.
 */

const mongoose = require('mongoose');
const softDelete = require("../utils/softDelete.plugin");

/* =====================================================
   SCHEMA DEFINITION
   ===================================================== */
const CharacterSchema = new mongoose.Schema(
  {
    /** 
     * Reference to the anime this character belongs to
     * @type {ObjectId}
     * @required
     */
    anime: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anime",
      required: true
    },

    /** First name of the character */
    firstName: { type: String, required: true, trim: true },

    /** Last name of the character */
    lastName: { type: String, trim: true },

    /** Gender of the character */
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown"
    },

    /** Role in the anime (main, support, side) */
    role: { 
      type: String, 
      enum: ["main", "support", "side"], 
      default: "side" 
    },

    /** Photo URL (Cloudinary) */
    photo: { type: String, trim: true },

    /** Cloudinary public ID for photo */
    photo_public_id: { type: String },

    /** Short description or biography */
    description: { type: String, trim: true },

    /** Species of the character */
    species: { type: String, trim: true },

    /** Age of the character */
    age: { type: Number },

    /** Origin world / universe of the character */
    originWorld: { type: String, trim: true },
  },
  { timestamps: true }
);

/* =====================================================
   INDEXES
   ===================================================== */
// Index for fast lookup by anime, ignoring soft-deleted
CharacterSchema.index(
  { anime: 1 },
  { partialFilterExpression: { is_deleted: { $ne: true } } }
);
// General index on anime
CharacterSchema.index({ anime: 1 });

/* =====================================================
   PLUGINS
   ===================================================== */
CharacterSchema.plugin(softDelete);

/* =====================================================
   EXPORT MODEL
   ===================================================== */
module.exports = mongoose.model('Character', CharacterSchema);