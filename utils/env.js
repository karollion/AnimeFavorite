/* =====================================================
   ENVIRONMENT VARIABLES VALIDATOR
   ===================================================== */

/**
 * Validates required environment variables at app startup.
 *
 * This file should be imported ONCE in server.js:
 *
 * require("./utils/env");
 *
 * If any required variable is missing,
 * the application will stop immediately.
 *
 * Prevents runtime crashes caused by missing config.
 */

/* =====================================================
   REQUIRED VARIABLES
   ===================================================== */

const REQUIRED_ENV = [
  "NODE_ENV",
  "SESSION_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MONGO_URI_DEV",
  "MONGO_URI_PROD"
];

/* =====================================================
   OPTIONAL VARIABLES WITH DEFAULTS
   ===================================================== */

const DEFAULTS = {
  PORT: "3030",
  LOGIN_RATE_LIMIT_MAX: "50",
  LOGIN_RATE_LIMIT_WINDOW: "900000",
  TRUST_PROXY: "false"
};

/* =====================================================
   VALIDATION
   ===================================================== */

/**
 * Throws error if required ENV variables are missing.
 */
function validateRequiredEnv() {
  const missing = REQUIRED_ENV.filter(
    key => !process.env[key]
  );

  if (missing.length > 0) {
    console.error("\n❌ Missing required ENV variables:\n");

    missing.forEach(key => {
      console.error(`   - ${key}`);
    });

    console.error("\nFix your .env file before starting the server.\n");

    process.exit(1);
  }
}

/**
 * Applies default values for optional ENV variables.
 */
function applyDefaults() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

/**
 * Normalizes boolean ENV variables.
 */
function normalizeBooleans() {
  process.env.TRUST_PROXY =
    process.env.TRUST_PROXY === "true" ? "true" : "false";
}

/* =====================================================
   RUN VALIDATION
   ===================================================== */

validateRequiredEnv();
applyDefaults();
normalizeBooleans();

/* =====================================================
   EXPORT (optional, for testing/debug)
   ===================================================== */

module.exports = {
  REQUIRED_ENV
};