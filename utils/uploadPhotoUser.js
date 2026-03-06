const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'animefavorite/users',
    allowed_formats: ['jpg', 'png', 'webp'],
    transformation: [
      { width: 420, height: 594, crop: 'fill' }
    ]
  }
})

const uploadPhotoUser = multer({ storage })

module.exports = uploadPhotoUser