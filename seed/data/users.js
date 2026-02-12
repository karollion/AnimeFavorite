const bcrypt = require("bcryptjs")

module.exports = [
  {
    _id: "680000000000000000000001",
    slug: "admin",
    login: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    email: "admin@example.com",
    birth_year: 1995,
    favorite_anime: [
      "670000000000000000000001"
    ],
    watched_anime: [
      "670000000000000000000002"
    ],
    favorite_characters: [
      "650000000000000000000002"
    ],
    createdAt: "2020-01-01T00:00:00Z",
    updatedAt: "2020-01-01T00:00:00Z"
  },
  {
    _id: "65a000000000000000000002",
    slug: "user1",
    login: "otakuPL",
    password: bcrypt.hashSync("test123", 10),
    email: "otaku@anime.pl",
    birth_year: 2000
  }
]