/* =====================================================
   🌱 DATABASE SEED SCRIPT
   ===================================================== */

/* ENV */
require("dotenv").config();

/* DB */
const mongoose = require("mongoose");
const connectDB = require("../db");

/* MODELS */
const User = require("../models/user.model");
const Anime = require("../models/anime.model");
const Character = require("../models/character.model");
const Review = require("../models/review.model");
const Season = require("../models/season.model");
const UserAnime = require("../models/userAnime.model");

/* DATA */
const users = require("./data/users");
const anime = require("./data/anime");
const characters = require("./data/characters");
const reviews = require("./data/reviews");
const seasons = require("./data/seasons");
const userAnime = require("./data/userAnime");

/* =====================================================
   🚀 SEED FUNCTION
   ===================================================== */

async function seed() {
  await connectDB()

  console.log("🧹 Cleaning database...")

  await Promise.all([
    User.deleteMany(),
    Anime.deleteMany(),
    Character.deleteMany(),
    Review.deleteMany(),
    Season.deleteMany(),
    UserAnime.deleteMany(),
  ])

  console.log("👤 Seeding users...")
  await User.insertMany(users)

  console.log("🎭 Seeding characters...")
  await Character.insertMany(characters)

  console.log("📺 Seeding seasons...")
  await Season.insertMany(seasons)

  console.log("📺 Seeding animes...")
  await Anime.insertMany(anime)

  console.log("⭐ Seeding reviews...")
  await Review.insertMany(reviews)

  console.log("👤 Seeding user animes...")
  await UserAnime.insertMany(userAnime)

  console.log("✅ DATABASE SEEDED SUCCESSFULLY")

  process.exit(0)
}

/* START */
seed()