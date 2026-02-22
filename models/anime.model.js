const mongoose = require("mongoose");

const AnimeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },

  original_title: { type: String, trim: true },

  age_rating: { type: Number, required: true, min: 0, max: 21, default: 0 },

  type: { type: String, enum: ["TV", "Movie", "OVA", "ONA"], required: true },

  world: { type: String, trim: true },

  genres: [{ type: String, trim: true }],
  
  categories: [{ type: String, trim: true }],

  rating_overall: { type: Number, min: 0, max: 10, default: 0 },

  my_opinion: { type: String, trim: true },

  description_short: { type: String, trim: true, required: true },

  anime_cover: { type: String, trim: true, required: true },

  cover_public_id: { type: String },

  characters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Character" }
  ],

  seasons: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Season" }
  ],

  status: {
    type: String,
    enum: ["planned", "watching", "completed"],
    default: "planned"
  },

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

module.exports = mongoose.model("Anime", AnimeSchema);