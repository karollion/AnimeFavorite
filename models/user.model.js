const mongoose = require("mongoose");
const softDelete = require("../utils/softDelete.plugin");

const UserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  
  description: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  birth_year: { type: Number },

  avatar: { type: String, trim: true },
  avatar_public_id: { type: String },

  favorite_characters: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Character" }
  ],

  slug: { type: String, unique: true, index: true },

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

  while (await User.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`
  }

  this.slug = slug
  next()
})

UserSchema.index({ slug: 1 },{partialFilterExpression: { is_deleted: { $ne: true } }});

UserSchema.plugin(softDelete);

module.exports = mongoose.model("User", UserSchema);