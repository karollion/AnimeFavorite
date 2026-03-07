const express = require("express");
const router = express.Router();

const upload = require('../utils/upload');
const season = require("../controllers/season.controller");
const auth = require("../utils/authMiddleware");
const admin = require("../utils/adminMiddleware");

// ===============================
// GET
// ===============================
router.get("/anime/:animeId", season.getSeasonsByAnime);

// ===============================
// CREATE / UPDATE / DELETE
// ===============================
router.post("/", auth, season.createSeason);
router.put("/:id/cover", auth, admin, upload("season_covers").single("cover"), season.updateCover);
router.put("/:id", auth, admin, season.updateSeason);
router.delete("/:id", auth, admin, season.deleteSeason);

module.exports = router;