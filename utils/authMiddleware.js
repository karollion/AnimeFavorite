/* =====================================================
   AUTHENTICATION MIDDLEWARE
   ===================================================== */

/**
 * Ensures that a user is authenticated.
 *
 * @middleware
 * @access Private
 *
 * Flow:
 * 1. Check if session contains authenticated user
 * 2. If not → return 401 Unauthorized
 * 3. Otherwise continue request
 *
 * Used for endpoints that require login.
 */
function authMiddleware(req, res, next) {

  console.log("AUTH CHECK SESSION:", req.session);

  /* ---------- AUTHENTICATION CHECK ---------- */

   if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  // attach user to request
  req.user = req.session.user;

  /* ---------- ACCESS GRANTED ---------- */

  next();
};

module.exports = authMiddleware;