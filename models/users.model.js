const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nick: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },

  email: { type: String, required: true, unique: true, trim: true },
  birth_year: { type: Number },

  avatar_url: { type: String, trim: true },

  registered_at: { type: Date, default: Date.now },

  favorite_characters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Character" }
  ],

  watched_anime: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Anime" }
  ],

  watchlist_anime: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Anime" }
  ],

  favorite_anime: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Anime" }
  ],

  slug: { type: String, unique: true, index: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

//Przygotowanie nicku do dodania do Url
UserSchema.pre("save", async function (next) {
  if (!this.isModified("nick")) return next()

  const User = mongoose.model("User")

  let baseSlug = this.nick
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

  while (await User.exists({ slug })) {
    slug = `${baseSlug}-${count++}`
  }

  this.slug = slug
  next()
})

module.exports = mongoose.model("User", UserSchema);