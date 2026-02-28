const UserAnimeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Anime",
    required: true
  },

  status: {
    type: String,
    enum: ["not watched", "planned", "watching", "completed", "suspended", "abandoned"],
    default: "not watched"
  },

  rating: {
    type: Number,
    min: 0,
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: "Rating must be integer"
    }
  },

  my_opinion: {
    type: String,
    trim: true
  },

  favorite_anime: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

UserAnimeSchema.index({ user: 1, anime: 1 }, { unique: true })

module.exports = mongoose.model("UserAnime", UserAnimeSchema)