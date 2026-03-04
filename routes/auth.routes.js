const express = require('express');
const router = express.Router();
const uploadPhotoUser = require('../utils/uploadPhotoUser')
const authMiddleware = require('../utils/authMiddleware');
const auth = require('../controllers/auth.controller');


router.post('/register', uploadPhotoUser.single('avatar') , auth.register);

router.post('/login', auth.login);

router.get('/user', authMiddleware, auth.getProfile);

router.get('/user/stats', authMiddleware, auth.getUserStats);

router.put('/user/avatar', authMiddleware, uploadPhotoUser.single('avatar'), auth.updateAvatar);
router.put('/user', authMiddleware, auth.updateProfile);

router.delete('/logout', authMiddleware, auth.logout);


module.exports = router;

