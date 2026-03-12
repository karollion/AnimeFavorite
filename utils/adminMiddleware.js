/* =====================================================
   ADMIN AUTHORIZATION MIDDLEWARE
   ===================================================== */

/**
 * Restricts access to admin users only.
 *
 * @middleware
 * @access Admin
 *
 * Flow:
 * 1. Verify user is authenticated
 * 2. Verify user role is "admin"
 * 3. Continue request if authorized
 *
 * Security:
 * Prevents unauthorized access to
 * admin-only endpoints.
 */
function adminMiddleware(req, res, next) {

  /* ---------- AUTHENTICATION CHECK ---------- */

  if (!req.session?.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  /* ---------- ROLE AUTHORIZATION ---------- */

  if (req.session.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  /* ---------- ACCESS GRANTED ---------- */

  next();
};

module.exports = adminMiddleware;