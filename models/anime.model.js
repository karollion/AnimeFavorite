const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },

  original_title: { type: String, trim: true },

  age_rating: { type: Number, required: true, min: 0, max: 21, default: 0 },

  type: { type: String, enum: ["TV", "Movie", "OVA", "ONA"], required: true },

  world: { type: String, trim: true },

  genres: [{ type: String, trim: true, lowercase: true }],

  categories: [{ type: String, trim: true, lowercase: true }],

  description_short: { type: String, trim: true, required: true },

  anime_cover: { type: String, trim: true, required: true },

  cover_public_id: { type: String },

  slug: { type: String, unique: true, index: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

//Przygotowanie tytułu do dodania do Url
AnimeSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next()

  const Anime = mongoose.model("Anime")

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
    .replace(/\s+/g, "-")

  let slug = baseSlug
  let count = 1

  while (await Anime.exists({ slug })) {
    slug = `${baseSlug}-${count++}`
  }

  this.slug = slug
  next()
})

AnimeSchema.index({ slug: 1, is_deleted: 1 });

module.exports = mongoose.model("Anime", AnimeSchema);