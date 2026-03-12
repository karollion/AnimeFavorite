/* =====================================================
   CLOUDINARY CONFIGURATION
   ===================================================== */

const { v2: cloudinary } = require("cloudinary");

/**
 * Cloudinary configuration used for:
 * - anime covers
 * - character images
 * - user avatars
 * - season covers
 *
 * Credentials are loaded from environment variables.
 *
 * Required ENV variables:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */

/* ---------- ENV VALIDATION ---------- */

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "❌ Cloudinary environment variables are missing"
  );
}

/* ---------- CONFIGURATION ---------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/* ---------- EXPORT INSTANCE ---------- */

module.exports = cloudinary;