/* =====================================================
   UNIVERSAL UPLOAD MIDDLEWARE (MULTER + CLOUDINARY)
   ===================================================== */

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

/**
 * Allowed image MIME types.
 * Extend this array if you want to support more formats.
 */
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * Maximum upload size (bytes).
 * Currently: 2MB
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/* =====================================================
   STORAGE FACTORY
   ===================================================== */

/**
 * Creates Cloudinary storage instance for a specific folder.
 *
 * @param {string} folder - Cloudinary folder name
 * @returns {CloudinaryStorage}
 *
 * Example:
 * createStorage("anime/covers")
 */
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder,
      transformation: [{ width: 420, height: 594, crop: "fill" }],
      allowed_formats: ["jpg", "jpeg", "png", "webp"],

      /**
       * Optional: unique filename
       * Prevents collisions.
       */
      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase()}`,
    }),
  });
};

/* =====================================================
   FILE FILTER
   ===================================================== */

/**
 * Validates uploaded file type.
 * Allows only image MIME types.
 */
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }

  cb(null, true);
};

/* =====================================================
   UPLOAD FACTORY
   ===================================================== */

/**
 * Generates multer upload middleware.
 *
 * @param {string} folder - Cloudinary destination folder
 *
 * Usage:
 * upload("anime/covers").single("cover")
 * upload("users/avatars").single("avatar")
 */
const upload = (folder) => {
  if (!folder) {
    throw new Error("Upload folder must be provided");
  }

  return multer({
    storage: createStorage(folder),
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
    fileFilter,
  });
};

/* =====================================================
   EXPORT
   ===================================================== */

module.exports = upload;