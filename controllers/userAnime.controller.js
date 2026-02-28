const UserAnime = require('../models/userAnime.model');
const Anime = require('../models/anime.model');


// =======================================
// ADD / UPDATE USER ANIME RELATION
// =======================================
// POST /api/user-anime
exports.upsert = async (req, res) => {
  try {
    const { user, anime, favorite_anime, rating, status } = req.body;

    // sprawdź czy anime istnieje
    const animeExists = await Anime.findById(anime);
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

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =======================================
// GET ALL ANIME FOR USER
// =======================================
// GET /api/user-anime/:userId
exports.getUserAnime = async (req, res) => {
  try {
    const { userId } = req.params;

    const list = await UserAnime.find({ user: userId })
      .populate({
        path: 'anime',
        match: { is_deleted: { $ne: true } }
      })
      .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =======================================
// GET FAVORITES
// =======================================
// GET /api/user-anime/:userId/favorites
exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await UserAnime
      .find({
        user: userId,
        favorite_anime: true
      })
      .populate({
        path: 'anime',
        match: { is_deleted: { $ne: true } }
      })
      .select('anime rating status');

    // zwróć same anime (czyściej dla frontu)
    const cleaned = favorites
      .filter(f => f.anime) // usuń null jeśli anime soft deleted
      .map(f => ({
        ...f.anime.toObject(),
        rating: f.rating,
        status: f.status
      }));

    res.json(cleaned);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =======================================
// REMOVE FROM USER LIST
// =======================================
// DELETE /api/user-anime/:id
exports.remove = async (req, res) => {
  try {
    const relation = await UserAnime.findById(req.params.id);

    if (!relation) {
      return res.status(404).json({ message: 'Relation not found' });
    }

    await relation.deleteOne();

    res.json({ message: 'Removed from user list' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};