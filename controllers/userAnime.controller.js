const UserAnime = require('../models/userAnime.model');
const Anime = require('../models/anime.model');
const asyncHandler = require("../utils/asyncHandler");

// =======================================
// ADD / UPDATE USER ANIME RELATION
// =======================================
// POST /api/user-anime
exports.upsert = asyncHandler(async (req, res) => {
  const user = req.session.user.id;
  const { anime, favorite_anime, rating, status } = req.body;

  // sprawdź czy anime istnieje
  const animeExists = await Anime.exists({ _id: anime, is_deleted: { $ne: true } });
  if (!animeExists) {
    return res.status(404).json({ message: 'Anime not found' });
  }

  // sprawdź czy już istnieje relacja
  let userAnime = await UserAnime.findOne({ user, anime });

  if (userAnime) {
    // update
    userAnime.favorite_anime = favorite_anime ?? userAnime.favorite_anime;
    userAnime.rating = rating ?? userAnime.rating;
    userAnime.status = status ?? userAnime.status;

    await userAnime.save();
    return res.json(userAnime);
  }

  // create
  userAnime = await UserAnime.create({
    user,
    anime,
    favorite_anime,
    rating,
    status
  });

  res.status(201).json(userAnime);
});


// =======================================
// GET ALL ANIME FOR USER
// =======================================
// GET /api/user-anime/:userId
exports.getUserAnime = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;

  const list = await UserAnime.find({ user: userId })
    .populate({
      path: 'anime',
      match: { is_deleted: { $ne: true } }
    })
    .sort({ createdAt: -1 })
    .lean();

  res.json(list);
});


// =======================================
// GET FAVORITES
// =======================================
// GET /api/user-anime/:userId/favorites
exports.getFavorites = asyncHandler(async (req, res) => {
  const userId = req.session.user.id;

  const favorites = await UserAnime
    .find({
      user: userId,
      favorite_anime: true
    })
    .populate({
      path: 'anime',
      match: { is_deleted: { $ne: true } }
    })
    .select('anime rating status')
    .lean();

  // zwróć same anime (czyściej dla frontu)
  const cleaned = favorites
    .filter(f => f.anime) // usuń null jeśli anime soft deleted
    .map(f => ({
      ...f.anime.toObject(),
      rating: f.rating,
      status: f.status
    }));

  res.json(cleaned);
});


// =======================================
// REMOVE FROM USER LIST
// =======================================
// DELETE /api/user-anime/:id
exports.remove = asyncHandler(async (req, res) => {
  const relation = await UserAnime.findOne({
    _id: req.params.id,
    user: req.session.user.id
  });

  if (!relation) {
    return res.status(404).json({ message: 'Relation not found' });
  }

  await relation.deleteOne();

  res.json({ message: 'Removed from user list' });
});