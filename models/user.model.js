/* =====================================================
   User Model
   ===================================================== */

/**
 * @file user.model.js
 * @description Mongoose schema and model for User entities.
 *              Users can be admin or regular users, have login, password, avatar,
 *              favorite characters, email, birth year, and soft delete support.
 */

const mongoose = require("mongoose");
const softDelete = require("../utils/softDelete.plugin");

/* =====================================================
   SCHEMA DEFINITION
   ===================================================== */
const UserSchema = new mongoose.Schema(
  {
    /** Unique login of the user */
    login: { type: String, required: true, unique: true, trim: true, lowercase: true },

    /** Hashed password (excluded by default in queries) */
    password: { type: String, required: true, select: false },

    /** Role of the user: admin or regular user */
    role: { type: String, enum: ["admin", "user"], default: "user" },

    /** Optional description of the user */
    description: { type: String, trim: true },

    /** Unique email of the user */
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] },

    /** Birth year of the user */
    birth_year: { type: Number },

    /** Preferred user settings */
    preferences: {
      version: { type: Number, default: 1 },
    
      ui: {
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        language: { type: String, enum: ['en', 'pl'], default: 'en' },
        defaultView: { type: String, enum: ['grid', 'list'], default: 'grid' },
        autoPlay: { type: Boolean, default: false },
      },
    
      content: {
        showNsfw: { type: Boolean, default: false },
        hideSpoilers: { type: Boolean, default: true },
        preferredGenres: [{ type: String }],
      },
    
      behavior: {
        defaultSort: { type: String, enum: ['rating', 'newest'], default: 'rating' },
      },
    
      notifications: {
        email: { type: Boolean, default: false },
        inApp: { type: Boolean, default: false },
        push: { type: Boolean, default: false },
      },
    },

    /** URL to avatar image */
    avatar: { type: String, trim: true },

    /** Cloudinary public ID of the avatar */
    avatar_public_id: { type: String },

    /** List of favorite characters by reference */
    favorite_characters: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Character" }
    ],

    /** Slug version of login for URLs */
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

/* =====================================================
   SLUG PRE-SAVE HOOK
   ===================================================== */
/**
 * Generates a URL-friendly slug from the login before saving.
 * Ensures uniqueness by appending a counter if needed.
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("login")) return next();

  const User = mongoose.model("User");

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
    .replace(/\s+/g, "-");

  let slug = baseSlug;
  let count = 1;

  while (await User.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

/* =====================================================
   INDEXES
   ===================================================== */
// Index slug for fast lookup; skip soft-deleted users
UserSchema.index(
  { slug: 1 },
  { partialFilterExpression: { is_deleted: { $ne: true } } }
);

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { is_deleted: { $ne: true } } }
);

UserSchema.index(
  { login: 1 },
  { unique: true, partialFilterExpression: { is_deleted: { $ne: true } } }
);

/* =====================================================
   PLUGINS
   ===================================================== */
UserSchema.plugin(softDelete);

/* =====================================================
   EXPORT MODEL
   ===================================================== */
module.exports = mongoose.model("User", UserSchema);