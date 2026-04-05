/* =====================================================
   ENVIRONMENT INITIALIZATION
   ===================================================== */

/**
 * Loads environment variables and validates configuration.
 * Must be executed BEFORE anything else.
 */
require("dotenv").config();
require("./models/index");
require("./utils/env");

/* =====================================================
   IMPORTS
   ===================================================== */

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const rateLimit = require("express-rate-limit");

const connectToDB = require("./db");

/* ================= ROUTES ================= */

const homeRoutes = require("./routes/home.routes");
const animeRoutes = require("./routes/anime.routes");
const authRoutes = require("./routes/auth.routes");
const userAnimeRoutes = require("./routes/userAnime.routes");
const characterRoutes = require("./routes/character.routes");
const seasonRoutes = require("./routes/season.routes");
const reviewRoutes = require("./routes/review.routes");

/* =====================================================
   APP INITIALIZATION
   ===================================================== */

const app = express();

/**
 * Trust proxy is required when app runs behind:
 * - Nginx
 * - Render
 * - Railway
 * - Vercel
 * - Cloudflare
 *
 * Enables correct HTTPS + secure cookies detection.
 */
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

/* =====================================================
   RATE LIMITERS
   ===================================================== */

/**
 * Login brute-force protection.
 */
const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW),
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX),
  message: { message: "Too many login attempts" },
  standardHeaders: true,
  legacyHeaders: false,
});

/* =====================================================
   GLOBAL SECURITY MIDDLEWARE
   ===================================================== */

/**
 * Helmet sets secure HTTP headers.
 */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/**
 * Removes Express fingerprint header.
 */
app.disable("x-powered-by");

/**
 * CORS only enabled in development.
 * Production should be handled by reverse proxy.
 */
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://127.0.0.1:3000",
    credentials: true
  }));
}

/**
 * Body parsers
 */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   SERVER BOOTSTRAP
   ===================================================== */

/**
 * Initializes database connection,
 * sessions, routes and HTTP server.
 */
const startServer = async () => {
  /* ---------- DATABASE ---------- */
  await connectToDB();

  /* =====================================================
     SESSION CONFIGURATION
     ===================================================== */

  /**
   * Session stored in MongoDB.
   * Enables persistent login across restarts.
   */
  const isProd = process.env.NODE_ENV === "production";

  app.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,

      store: MongoStore.create({
        mongoUrl:
          process.env.NODE_ENV === "production"
            ? process.env.MONGO_URI_PROD
            : process.env.MONGO_URI_DEV,
        collectionName: "sessions",
      }),


      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24,
      }
    })
  );

  /* =====================================================
   COOKIE DEBUG MIDDLEWARE
   ===================================================== */
  /*
  app.use((req, res, next) => {
    console.log("\n===== REQUEST DEBUG =====");
    console.log("URL:", req.method, req.url);
    console.log("Origin:", req.headers.origin);
    console.log("Cookie header:", req.headers.cookie);
    console.log("Session ID:", req.sessionID);
    console.log("Session exists:", !!req.session);
    console.log("=========================\n");

    next();
  });
  */

  /* =====================================================
     ROUTES
     ===================================================== */

  /**
   * Apply rate limit ONLY to login endpoint.
   */
  app.use("/api/auth/login", loginLimiter);

  app.use("/api/home", homeRoutes);
  app.use("/api/animes", animeRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/user-anime", userAnimeRoutes);
  app.use("/api/characters", characterRoutes);
  app.use("/api/seasons", seasonRoutes);
  app.use("/api/reviews", reviewRoutes);


  app.get("/debug-session", (req, res) => {
  res.json({
      cookie: req.headers.cookie || null,
      session: req.session || null,
    });
  });

  /* =====================================================
     STATIC FILES
     ===================================================== */

  /**
   * Public uploads + React production build.
   */
  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.static(path.join(__dirname, "client/build")));

  /* =====================================================
     404 HANDLER
     ===================================================== */

  app.use((req, res) => {
    res.status(404).json({
      message: "404 Not found...",
    });
  });

  /* =====================================================
     GLOBAL ERROR HANDLER
     ===================================================== */

  /**
   * Centralized error handling middleware.
   * Works together with asyncHandler().
   */
  app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  });

  /* =====================================================
     START LISTENING
     ===================================================== */

  const PORT = process.env.PORT || 3030;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

/* Start application */
startServer();