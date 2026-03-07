const express = require("express");
const router = express.Router();

const upload = require('../utils/upload');
const character = require("../controllers/character.controller");
const auth = require("../utils/authMiddleware");
const admin = require("../utils/adminMiddleware");

// ===============================
// GET
// ===============================
router.get("/anime/:animeId", character.getCharactersByAnime);
router.get("/:id", character.getCharacter);

// ===============================
// CREATE / UPDATE / DELETE
// ===============================
router.post("/", auth, admin, character.createCharacter);
router.put("/:id/photo", auth, admin, upload("characters").single("photo"), character.updatePhoto);
router.put("/:id", auth, admin, character.updateCharacter);
router.delete("/:id", auth, admin, character.deleteCharacter);

module.exports = router;