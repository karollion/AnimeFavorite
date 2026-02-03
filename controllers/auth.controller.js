const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try{
    const { login, password, description, email, birth_year, avatar } = req.body

    if(typeof login !== "string" ||
      typeof password !== "string" ||
      typeof email !== "string" ||
      !Number.isInteger(Number(birth_year)) 
      ) {
      return res.status(400).json({ message: "Bad request" })
    }

    const existingUser = await User.findOne({ login })
    if (existingUser) {
      return res.status(409).json({ message: "Login already exists" })
    }

    const user = await User.create({
      login: login.trim(),
      password: await bcrypt.hash(password, 10),
      description,
      email,
      birth_year: Number(birth_year),
      avatar
    })

    res.status(201).json({ message: "User created", login: user.login })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.login = async (req, res) => {
  try{
    const { login, password} = req.body;

    if(login && typeof login === 'string' && password && typeof password === 'string') {
      const user = await User.findOne({ login, is_deleted: false });

      if (!user) {
        return res.status(400).send({ message: 'User or password are incorrect' });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const userLogged = { login: user.login, id: user._id, avatar: user.avatar};
          req.session.user = {
                            id: user._id,
                            login: user.login,
                            role: user.role
                            }
          
          res.status(200).json( req.session.user );

          console.log('Hello ' + req.session.user.login + ' you are logged in.')
        } else {
          res.status(401).send({ message: 'User or password are incorrect' });
        }
      }

    } else {
      res.status(400).send({ message: 'Bad request'});
    }

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/* Get user with populate */
exports.getProfile = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  const user = await User.findById(req.session.user.id)
    .populate("favorite_anime", "title cover year")
    .populate("watchlist_anime", "title cover")
    .populate("watched_anime", "title cover rating_overall")
    .populate("favorite_characters", "name anime image_url")

  res.json(user)
};

/* Dynamic user stats */
exports.getUserStats = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  const user = await User.findById(req.session.user.id)

  res.json({
    watched_count: user.watched_anime.length,
    watchlist_count: user.watchlist_anime.length,
    favorites_count: user.favorite_anime.length,
    favorite_characters_count: user.favorite_characters.length
  })
};

exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.send({ message: 'You are logout' })
  })
};

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
      "birth_year",
      "avatar"
    ]

    const filteredUpdates = {}
    for (const key of allowedFields) {
      if (typeof updates[key] === "string" && updates[key].trim() !== "") {
        filteredUpdates[key] = updates[key].trim()
      }
      if (key === "birth_year" && Number.isInteger(Number(updates[key]))) {
        filteredUpdates.birth_year = Number(updates[key])
      }
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key]
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

exports.addFavoriteAnime = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { animeId } = req.body

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorite_anime: animeId } } // brak duplikatów
    )

    res.json({ message: "Anime added to favorites" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.removeFavoriteAnime = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { animeId } = req.body

    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorite_anime: animeId } }
    )

    res.json({ message: "Anime removed from favorites" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.addFavoriteCharacter = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { characterId } = req.body

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorite_characters: characterId } }
    )

    res.json({ message: "Character added to favorites" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.removeFavoriteCharacter = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { characterId } = req.body

    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorite_characters: characterId } }
    )

    res.json({ message: "Character removed from favorites" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.markAsWatched = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { animeId } = req.body

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { watched_anime: animeId },
        $pull: { watchlist_anime: animeId } // auto-usunięcie z "do obejrzenia"
      }
    )

    res.json({ message: "Anime marked as watched" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.addToWatchlist = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { animeId } = req.body

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { watchlist_anime: animeId },
        $pull: { watched_anime: animeId }
      }
    )

    res.json({ message: "Anime added to watchlist" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};

exports.removeAnimeFromAllLists = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" })
  }
  try {
    const userId = req.session.user.id
    const { animeId } = req.body

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favorite_anime: animeId,
          watched_anime: animeId,
          watchlist_anime: animeId
        }
      }
    )

    res.json({ message: "Anime removed from all lists" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};