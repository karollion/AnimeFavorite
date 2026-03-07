const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

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
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
  });
};

module.exports = upload;