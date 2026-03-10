const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary')
const pick = require('../utils/pickAllowedFields');

// ===============================
// REGISTER USER
// ===============================
exports.register = async (req, res) => {
  try{
    const { login, password, description, email, birth_year } = req.body

    if(typeof login !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string"
      ) {
      return res.status(400).json({ message: "Bad request" })
    }

    if (birth_year !== undefined && !Number.isInteger(Number(birth_year))) {
      return res.status(400).json({ message: "Invalid birth_year" })
    }

    const existingUser = await User.findOne({ login })
    if (existingUser) {
      return res.status(409).json({ message: "Login already exists" })
    }
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" })
    }

    const user = await User.create({
      login: login.trim(),
      password: await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS)),
      description,
      email,
      birth_year: Number(birth_year),
    })

    res.status(201).json({ message: "User created", login: user.login })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

// ===============================
// LOGIN USER
// ===============================
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User
      .findOne({ login, is_deleted: false })
      .select("+password");

    const passwordHash = user?.password || await bcrypt.hash("fake", 10);
    const valid = await bcrypt.compare(password, passwordHash);

    if (!user || !valid) {
      return res.status(401).json({ message: "User or password incorrect" });
    }

    // SESSION FIXATION PROTECTION
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: "Session error" });
      }

      req.session.user = {
        id: user._id,
        login: user.login,
        role: user.role
      };

      req.session.save(() => {
        res.json({
          id: user._id,
          login: user.login,
          role: user.role,
          avatar: user.avatar
        });
      });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// Get user with populate
// ===============================
exports.getProfile = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  const user = await User.findOne({ _id: req.session.user.id, is_deleted: false })
    .populate("favorite_characters", "firstName lastName anime imageUrl")

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user._id,
    login: user.login,
    email: user.email,
    description: user.description,
    avatar: user.avatar,
    favorite_characters: user.favorite_characters
  });
};

// ===============================
// Dynamic user stats
// ===============================
exports.getUserStats = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  const user = await User.findOne({
    _id: req.session.user.id,
    is_deleted: false
  })
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    favorite_characters_count: user.favorite_characters.length
  })
};

// ===============================
// LOGOUT
// ===============================
exports.logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie(process.env.SESSION_NAME);
    res.json({ message: 'Logged out' });
  });
};

// ===============================
// UPDATE AVATAR
// ===============================
exports.updateAvatar = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Invalid file type" })
  }

  try {
    const user = await User.findOne({ _id: req.session.user.id, is_deleted: false })

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatar_public_id) {
      await cloudinary.uploader.destroy(user.avatar_public_id);
    }

    user.avatar = req.file.path;
    user.avatar_public_id = req.file.filename;

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const updates = req.body

    const allowedFields = [
      "description",
      "email",
      "birth_year"
    ]

    const filteredUpdates = pick(req.body, allowedFields);

    if (typeof filteredUpdates.description === "string") {
      filteredUpdates.description = filteredUpdates.description.trim()
    }

    if (typeof filteredUpdates.email === "string") {
      filteredUpdates.email = filteredUpdates.email.trim()
    }

    if (filteredUpdates.birth_year !== undefined) {
      if (!Number.isInteger(Number(filteredUpdates.birth_year))) {
        return res.status(400).json({ message: "Invalid birth_year" })
      }
      filteredUpdates.birth_year = Number(filteredUpdates.birth_year)
    }

    if (filteredUpdates.email) {
      const exists = await User.findOne({
        email: filteredUpdates.email,
        _id: { $ne: userId }
      });
    
      if (exists) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      filteredUpdates,
      { new: true }
    )

    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};