const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'animefavorite/animes',
    allowed_formats: ['jpg', 'png', 'webp'],
    transformation: [
      { width: 420, height: 594, crop: 'fill' }
    ]
  }
})

const uploadPhotoAnime = multer({ storage })

module.exports = uploadPhotoAnime