import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js'

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

export const upload = multer({ storage })