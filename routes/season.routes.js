const express = require("express")
const router = express.Router()

const season = require("../controllers/season.controller")
const auth = require("../utils/authMiddleware")

router.get("/anime/:animeId", season.getSeasonsByAnime)

router.post("/", auth, season.createSeason)

router.put("/:id", auth, season.updateSeason)

router.delete("/:id", auth, season.deleteSeason)

module.exports = router