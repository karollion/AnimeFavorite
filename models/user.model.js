const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true},
  role: { 
    type: String, 
    enum: ["admin", "user"], 
    default: "user" 
  },
  
  description: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  birth_year: { type: Number },

  avatar: { type: String, trim: true },

  favorite_characters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Character" }
  ],

  slug: { type: String, unique: true, index: true },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

//Przygotowanie loginu do dodania do Url
UserSchema.pre("save", async function (next) {
  if (!this.isModified("login")) return next()

  const User = mongoose.model("User")

  let baseSlug = this.login
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