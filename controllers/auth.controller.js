const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinary");
const mongoose = require('mongoose');

const pick = require("../utils/pickAllowedFields");
const asyncHandler = require("../utils/asyncHandler");

/* =====================================================
   REGISTER USER
   ===================================================== */

/**
 * Register new user account
 *
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Body:
 * - login
 * - password
 * - email
 * - description (optional)
 * - birth_year (optional)
 *
 * Flow:
 * 1. Validate input
 * 2. Check login/email uniqueness
 * 3. Hash password
 * 4. Create user
 */
exports.register = asyncHandler(async (req, res) => {
  const { login, password, description, email, birth_year } = req.body;

  /* ---------- VALIDATION ---------- */

  if (
    typeof login !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    return res.status(400).json({ message: "Bad request" });
  }

  if (
    birth_year !== undefined &&
    !Number.isInteger(Number(birth_year))
  ) {
    return res.status(400).json({ message: "Invalid birth_year" });
  }

  /* ---------- UNIQUE CHECK ---------- */

  const existingUser = await User.findOne({ login });
  if (existingUser) {
    return res.status(409).json({ message: "Login already exists" });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({ message: "Email already exists" });
  }

  /* ---------- CREATE USER ---------- */

  const user = await User.create({
    login: login.trim(),
    password: await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS)
    ),
    description,
    email,
    birth_year: Number(birth_year),
  });

  res.status(201).json({
    message: "User created",
    login: user.login,
  });
});

/* =====================================================
   LOGIN USER
   ===================================================== */

/**
 * Authenticate user and create session
 *
 * @route   POST /api/auth/login
 * @access  Public
 *
 * Security:
 * - timing attack protection
 * - session fixation protection
 */
exports.login = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({
    login,
    is_deleted: false,
  }).select("+password");

  /* ---------- TIMING ATTACK PROTECTION ---------- */
  const passwordHash =
    user?.password || (await bcrypt.hash("fake", 10));

  const valid = await bcrypt.compare(password, passwordHash);

  if (!user || !valid) {
    return res
      .status(401)
      .json({ message: "User or password incorrect" });
  }

  /* ---------- SESSION FIXATION HARDENING ---------- */
  req.session.regenerate(err => {
    if (err) {
      return res.status(500).json({ message: "Session error" });
    }

    req.session.user = {
      id: user._id,
      login: user.login,
      role: user.role,
    };

    console.log("SESSION AFTER LOGIN:", req.session);

    req.session.save(err => {
      if (err) return res.status(500).json(err);
      res.json({
        id: user._id,
        login: user.login,
        role: user.role,
        avatar: user.avatar,
      });
    });

  });
});

/* =====================================================
   GET PROFILE
   ===================================================== */

/**
 * Get authenticated user profile
 *
 * @route   GET /api/auth/user
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findOne({
    _id: req.session.user.id,
    is_deleted: false,
  }).populate(
    "favorite_characters",
    "firstName lastName anime imageUrl"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
  id: req.user._id,
  login: req.user.login,
  email: req.user.email,
  description: req.user.description,
  birth_year: req.user.birth_year,
  avatar: req.user.avatar,
  favorite_characters: req.user.favorite_characters,
});
});

/* =====================================================
   USER STATS
   ===================================================== */

/**
 * Get dynamic user statistics
 *
 * @route   GET /api/auth/user/stats
 * @access  Private
 */
const UserAnime = require("../models/userAnime.model");

exports.getUserStats = asyncHandler(async (req, res) => {

  console.log("===== USER STATS DEBUG =====");

  console.log("SESSION USER:", req.session.user);

  const userId = new mongoose.Types.ObjectId(
    req.session.user.id
  );

  console.log("USER ID OBJECT:", userId);
  console.log("USER ID STRING:", userId.toString());

  /* TEST 1 — normal find */
  const testFind = await UserAnime.find({
    user: userId
  });

  console.log("FOUND BY FIND:", testFind.length);

  /* TEST 2 — raw Mongo aggregation */
  const testAgg = await UserAnime.aggregate([
    { $match: { user: userId } }
  ]);

  console.log("FOUND BY AGG:", testAgg.length);

  console.log("============================");

  /* ===== NORMAL CODE ===== */

  const statusStats = await UserAnime.aggregate([
    {
      $match: { user: userId }
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const statuses = {
    planned: 0,
    watching: 0,
    completed: 0,
    suspended: 0,
    abandoned: 0
  };

  statusStats.forEach(s => {
    statuses[s._id] = s.count;
  });

  const favorites = await UserAnime.find({
    user: userId,
    favorite_anime: true
  })
    .populate({
      path: "anime",
      select:
        "slug title anime_cover rating_avg rating_count type age_rating"
    })
    .lean();

  const favoriteAnime = favorites
    .filter(f => f.anime)
    .map(f => f.anime);

  res.json({
    statuses,
    favoriteAnimeCount: favoriteAnime.length,
    favoriteAnime
  });
});

/* =====================================================
   LOGOUT
   ===================================================== */

/**
 * Destroy user session
 *
 * @route   DELETE /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie(process.env.SESSION_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.json({ message: "Logged out" });
  });
});

/* =====================================================
   UPDATE AVATAR
   ===================================================== */

/**
 * Update user avatar image
 *
 * Flow:
 * 1. Validate upload
 * 2. Remove old Cloudinary image
 * 3. Save new avatar
 *
 * @route   PUT /api/auth/user/avatar
 * @access  Private
 */
exports.updateAvatar = asyncHandler(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ message: "Invalid file type" });
  }

  const user = await User.findOne({
    _id: req.session.user.id,
    is_deleted: false,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  /* ---------- REMOVE OLD IMAGE ---------- */
  if (user.avatar_public_id) {
    await cloudinary.uploader.destroy(user.avatar_public_id);
  }

  /* ---------- SAVE NEW IMAGE ---------- */
  user.avatar = req.file.path;
  user.avatar_public_id = req.file.filename;

  await user.save();

  res.json(user);
});

/* =====================================================
   UPDATE PROFILE
   ===================================================== */

/**
 * Update user profile fields
 *
 * Allowed fields:
 * - description
 * - email
 * - birth_year
 *
 * Security:
 * - whitelist filtering
 * - email uniqueness validation
 *
 * @route   PUT /api/auth/user
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const userId = new mongoose.Types.ObjectId(
    req.session.user.id
  );

  const allowedFields = [
    "description",
    "email",
    "birth_year",
  ];

  const filteredUpdates = pick(req.body, allowedFields);

  /* ---------- SANITIZATION ---------- */

  if (typeof filteredUpdates.description === "string") {
    filteredUpdates.description =
      filteredUpdates.description.trim();
  }

  if (typeof filteredUpdates.email === "string") {
    filteredUpdates.email = filteredUpdates.email.trim();
  }

  if (filteredUpdates.birth_year !== undefined) {
    if (!Number.isInteger(Number(filteredUpdates.birth_year))) {
      return res
        .status(400)
        .json({ message: "Invalid birth_year" });
    }

    filteredUpdates.birth_year = Number(
      filteredUpdates.birth_year
    );
  }

  /* ---------- EMAIL UNIQUENESS ---------- */

  if (filteredUpdates.email) {
    const exists = await User.findOne({
      email: filteredUpdates.email,
      _id: { $ne: userId },
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Email already in use" });
    }
  }

  /* ---------- UPDATE ---------- */

  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true }
  );

  res.json(user);
});