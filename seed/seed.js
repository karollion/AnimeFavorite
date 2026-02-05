const mongoose = require("mongoose")
const connectDB = require("../db")

const user = require("../models/user.model")
const anime = require("../models/anime.model")
const character = require("../models/character.model")
const review = require("../models/review.model")
const season = require("../models/season.model")

const users = require("./data/users")
const animes = require("./data/anime")
const characters = require("./data/characters")
const reviews = require("./data/reviews")

async function seed() {
  await connectDB()

  console.log("🧹 Cleaning database...")
  await Promise.all([
    user.deleteMany(),
    anime.deleteMany(),
    character.deleteMany(),
    review.deleteMany(),
    season.deleteMany()
  ])

  console.log("👤 Inserting users...")
  await user.insertMany(users)

  console.log("📺 Inserting anime...")
  await anime.insertMany(animes)

  console.log("🎭 Inserting characters...")
  await character.insertMany(characters)

  console.log("⭐ Inserting reviews...")
  await review.insertMany(reviews)

  console.log("✅ SEED DONE")
  process.exit()
}

seed()