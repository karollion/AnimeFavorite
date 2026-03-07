const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// funkcja generująca storage dla konkretnego folderu
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
};

// middleware generator
const upload = (folder) => {
  return multer({
    storage: createStorage(folder),
    limits: { fileSize: 2 * 1024 * 1024 },   // Max 2MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image")) {
        return cb(new Error("Only images allowed"), false);
      }
      cb(null, true);
    }
  });
};

module.exports = upload;