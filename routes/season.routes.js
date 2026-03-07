const express = require("express");
const router = express.Router();

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
router.put("/:id", auth, admin, season.updateSeason);
router.delete("/:id", auth, admin, season.deleteSeason);

module.exports = router;