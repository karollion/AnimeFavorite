/* ENV */
require('dotenv').config()

/* Imports */
const mongoose = require("mongoose")
const connectDB = require("../db")

const User = require("../models/user.model")
const Anime = require("../models/anime.model")
const Character = require("../models/character.model")
const Review = require("../models/review.model")
const Season = require("../models/season.model")

const users = require("./data/users")
const anime = require("./data/anime")
const characters = require("./data/characters")
const reviews = require("./data/reviews")
const seasons = require("./data/seasons")

async function seed() {
  await connectDB()

  console.log("🧹 Cleaning database...")
  await Promise.all([
    User.deleteMany(),
    Anime.deleteMany(),
    Character.deleteMany(),
    Review.deleteMany(),
    Season.deleteMany()
  ])

  console.log("👤 Inserting users...")
  await User.insertMany(users)

  console.log("📺 Inserting anime...")
  await Anime.insertMany(anime)

  console.log("🎭 Inserting characters...")
  await Character.insertMany(characters)

  console.log("⭐ Inserting reviews...")
  await Review.insertMany(reviews)

  console.log("📺 Inserting seasons...")
  await Season.insertMany(seasons)

  console.log("✅ SEED DONE")
  process.exit()
}

seed()