const mongoose = require("mongoose");

/* =====================================================
   MONGOOSE GLOBAL CONFIG
   ===================================================== */

/**
 * Enforces strict query filtering.
 * Prevents querying by fields not defined in schema.
 * Security + performance improvement.
 */
mongoose.set("strictQuery", true);

/* =====================================================
   DATABASE CONNECTION
   ===================================================== */

/**
 * Connects application to MongoDB.
 *
 * Chooses URI based on environment:
 * - production → MONGO_URI_PROD
 * - development → MONGO_URI_DEV
 *
 * Terminates process if connection fails.
 *
 * @async
 * @function connectToDB
 * @returns {Promise<void>}
 */
const connectToDB = async () => {
  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV;

  try {
    /* ---------- VALIDATION ---------- */

    if (!uri) {
      throw new Error("❌ MongoDB URI is not defined in .env");
    }

    /* ---------- CONNECT ---------- */

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);

    /**
     * Exit process immediately.
     * Running API without DB is unsafe.
     */
    process.exit(1);
  }
};

/* =====================================================
   CONNECTION EVENTS (OBSERVABILITY)
   ===================================================== */

/**
 * Fired when connection is lost.
 */
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

/**
 * Fired on runtime connection errors.
 */
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err.message);
});

/**
 * Fired when connection is re-established.
 */
mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

/* =====================================================
   GRACEFUL SHUTDOWN
   ===================================================== */

/**
 * Properly closes DB connection when app stops.
 * Prevents hanging connections in production.
 */
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB connection closed (app termination)");
  process.exit(0);
});

module.exports = connectToDB;