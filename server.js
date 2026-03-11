/* ENV */
require('dotenv').config();
require('./models/index');
require("./utils/env");

/* Imports */
const path = require('path');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const connectToDB = require('./db');

/* Routes */
const animeRoutes     = require('./routes/anime.routes');
const authRoutes      = require('./routes/auth.routes');
const userAnimeRoutes = require('./routes/userAnime.routes');
const characterRoutes = require("./routes/character.routes");
const seasonRoutes    = require("./routes/season.routes");
const reviewRoutes    = require("./routes/review.routes");

const app = express();

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW),
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX),
  message: { message: "Too many login attempts" },
  standardHeaders: true,
  legacyHeaders: false
});

/* ======================
   SECURITY & MIDDLEWARE
====================== */

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.disable("x-powered-by");

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true
    })
  )
};

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* ======================
   START SERVER
====================== */

const startServer = async () => {
  await connectToDB();

  app.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI_PROD
            : process.env.MONGO_URI_DEV,
        collectionName: 'sessions'
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		    maxAge: Number(process.env.COOKIE_MAX_AGE)
      }
    })
  );

  /* ROUTES */
  app.use('/api/auth/login', loginLimiter);
  app.use('/api/animes', animeRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/user-anime', userAnimeRoutes);
  app.use("/api/characters", characterRoutes);
  app.use("/api/seasons", seasonRoutes);
  app.use("/api/reviews", reviewRoutes);

  /* STATIC */
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.use((req, res) => {
    res.status(404).json({ message: '404 Not found...' })
  });

  app.use((err, req, res, next) => {
    console.error(err)
    res.status(err.status || 500).json({
      message: err.message || "Internal server error"
    })
  });

  const PORT = process.env.PORT || 3030
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  });
};

startServer();