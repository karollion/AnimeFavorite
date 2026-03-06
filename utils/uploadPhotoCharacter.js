const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'animefavorite/characters',
    allowed_formats: ['jpg', 'png', 'webp'],
    transformation: [
      { width: 420, height: 594, crop: 'fill' }
    ]
  }
})

const uploadPhotoCharacter = multer({ storage })

module.exports = uploadPhotoCharacter