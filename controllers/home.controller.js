const Anime = require("../models/anime.model");
const asyncHandler = require("../utils/asyncHandler");

/*
=====================================================
FIELDS USED BY AnimeCard (LIGHT RESPONSE)
=====================================================
*/

const ANIME_CARD_FIELDS =
  "_id slug title anime_cover rating_avg rating_count type age_rating";

/*
=====================================================
GET HOME PAGE DATA
=====================================================
*/

/**
 * Get homepage sections
 *
 * Returns:
 * - newest animes (10)
 * - highest rated animes (10)
 * - random anime films (10)
 * - random TV series (10)
 * - one random anime (hero section)
 *
 * @route   GET /api/home
 * @access  Public
 *
 * Response:
 * {
 *   newest: AnimeCard[],
 *   topRated: AnimeCard[],
 *   films: AnimeCard[],
 *   tvSeries: AnimeCard[],
 *   random: AnimeCard
 * }
 */
exports.getHome = asyncHandler(async (req, res) => {

  const [
    newest,
    topRated,
    films,
    tvSeries,
    randomAnime
  ] = await Promise.all([

    /* =====================================================
       NEWEST ANIME
       ===================================================== */

    Anime.find()
      .select(ANIME_CARD_FIELDS)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),

    /* =====================================================
       HIGHEST RATED
       ===================================================== */

    Anime.find()
      .select(ANIME_CARD_FIELDS)
      .sort({ rating_avg: -1 })
      .limit(10)
      .lean(),

    /* =====================================================
       RANDOM FILMS (Movie / OVA / ONA)
       ===================================================== */

    Anime.aggregate([
      { $match: { type: { $in: ["Movie", "OVA", "ONA"] } } },
      { $sample: { size: 10 } },
      {
        $project: {
          _id: 1,
          slug: 1,
          title: 1,
          anime_cover: 1,
          rating_avg: 1,
          rating_count: 1,
          type: 1,
          age_rating: 1,
        },
      },
    ]),

    /* =====================================================
       RANDOM TV SERIES
       ===================================================== */

    Anime.aggregate([
      { $match: { type: "TV" } },
      { $sample: { size: 10 } },
      {
        $project: {
          _id: 1,
          slug: 1,
          title: 1,
          anime_cover: 1,
          rating_avg: 1,
          rating_count: 1,
          type: 1,
          age_rating: 1,
        },
      },
    ]),

    /* =====================================================
       RANDOM HERO ANIME
       ===================================================== */

    Anime.aggregate([
      { $sample: { size: 1 } },
      {
        $project: {
          _id: 1,
          slug: 1,
          title: 1,
          anime_cover: 1,
          rating_avg: 1,
          rating_count: 1,
          type: 1,
          age_rating: 1,
        },
      },
    ]),
  ]);

  res.json({
    newest,
    topRated,
    films,
    tvSeries,
    random: randomAnime[0] || null,
  });
});