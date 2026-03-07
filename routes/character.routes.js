const express = require("express")
const router = express.Router()

const character = require("../controllers/character.controller")
const auth = require("../utils/authMiddleware")

router.get("/anime/:animeId", character.getCharactersByAnime)

router.get("/:id", character.getCharacter)

router.post("/", auth, character.createCharacter)

router.put("/:id", auth, character.updateCharacter)

router.delete("/:id", auth, character.deleteCharacter)

module.exports = router