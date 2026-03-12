/* =====================================================
   Anime Model
   ===================================================== */

/**
 * @file anime.model.js
 * @description Mongoose schema and model for Anime entities.
 *              Includes fields for titles, type, genres, ratings, slug generation,
 *              cover image, and soft delete plugin.
 */

const mongoose = require("mongoose");
const softDelete = require("../utils/softDelete.plugin");

/* =====================================================
   SCHEMA DEFINITION
   ===================================================== */
const AnimeSchema = new mongoose.Schema(
  {
    /** 
     * Main title of the anime
     * @type {String} 
     * @required
     */
    title: { type: String, required: true, trim: true, index: true },

    /** Original title of the anime (if different) */
    original_title: { type: String, trim: true },

    /** Age rating for the anime, 0-21 */
    age_rating: { type: Number, required: true, min: 0, max: 21, default: 0 },

    /** Type of anime (TV, Movie, OVA, ONA) */
    type: { type: String, enum: ["TV", "Movie", "OVA", "ONA"], required: true },

    /** World/Universe of the anime */
    world: { type: String, trim: true },

    /** Genres, stored in lowercase */
    genres: [{ type: String, trim: true, lowercase: true }],

    /** Categories, stored in lowercase */
    categories: [{ type: String, trim: true, lowercase: true }],

    /** Short description of the anime */
    description_short: { type: String, trim: true, required: true },

    /** Cover image URL (stored in Cloudinary) */
    anime_cover: { type: String, trim: true },

    /** Cloudinary public ID for the cover */
    cover_public_id: { type: String },

    /** Aggregate rating count */
    rating_count: { type: Number, default: 0 },

    /** Average rating */
    rating_avg: { type: Number, default: 0 },

    /** URL-friendly slug, generated automatically from title */
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

/* =====================================================
   PRE-SAVE HOOK: SLUG GENERATION
   ===================================================== */
/**
 * @description Generates a URL-friendly slug from the title before saving.
 *              Ensures uniqueness by appending a counter if necessary.
 */
AnimeSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  const Anime = mongoose.model("Anime");

  // Normalize title to a slug
  let baseSlug = this.title
    .toLowerCase()
    .trim()
    .replace(/ł/g, "l")
    .replace(/ą/g, "a")
    .replace(/ę/g, "e")
    .replace(/ś/g, "s")
    .replace(/ć/g, "c")
    .replace(/ż|ź/g, "z")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  let slug = baseSlug;
  let count = 1;

  // Ensure uniqueness of slug, ignoring soft-deleted entries
  while (await Anime.exists({ slug, is_deleted: { $ne: true } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

/* =====================================================
   INDEXES
   ===================================================== */
AnimeSchema.index({ slug: 1 });
AnimeSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { is_deleted: { $ne: true } } }
);
AnimeSchema.index({ title: "text", original_title: "text" });
AnimeSchema.index({ genres: 1 });
AnimeSchema.index({ type: 1 });
AnimeSchema.index({ rating_avg: -1 });

/* =====================================================
   PLUGINS
   ===================================================== */
AnimeSchema.plugin(softDelete);

/* =====================================================
   EXPORT MODEL
   ===================================================== */
module.exports = mongoose.model("Anime", AnimeSchema);