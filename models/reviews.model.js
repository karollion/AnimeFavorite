const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  anime: { type: mongoose.Schema.Types.ObjectId, ref: "Anime", required: true },

  rating: { type: Number, min: 0, max: 10, required: true },
  review_text: { type: String, trim: true },
  contains_spoilers: { type: Boolean, default: false },

  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },

}, { timestamps: true });

//Jedna recenzja na usera
ReviewSchema.index({ user: 1, anime: 1 }, { unique: true });

//Funkcja przeliczająca rating anime
async function recalcAnimeRating(animeId) {
  const stats = await mongoose.model("Review").aggregate([
    { $match: { anime: animeId } },
    {
      $group: {
        _id: "$anime",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ])

  const avgRating = stats.length > 0
    ? Number(stats[0].avgRating.toFixed(2))
    : 0

  const ratingCount = stats.length > 0
    ? stats[0].count
    : 0

  await Anime.findByIdAndUpdate(animeId, {
    rating_overall: avgRating,
    rating_count: ratingCount
  })
};

//Po dodaniu lub edycji recenzji → przelicz rating
ReviewSchema.post("save", async function () {
  await recalcAnimeRating(this.anime)
});

//Po usunięciu recenzji → przelicz rating
ReviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await recalcAnimeRating(this.anime)
  }
);

module.exports = mongoose.model('Review', ReviewSchema);