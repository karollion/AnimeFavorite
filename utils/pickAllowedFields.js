/* =====================================================
   PICK ALLOWED FIELDS UTILITY
   ===================================================== */

/**
 * Returns a new object containing only allowed fields.
 *
 * Used to protect controllers from mass assignment.
 *
 * Example:
 *
 * const allowed = ["title", "description"];
 * const data = pickAllowedFields(req.body, allowed);
 *
 * req.body:
 * {
 *   title: "Naruto",
 *   description: "...",
 *   is_admin: true
 * }
 *
 * result:
 * {
 *   title: "Naruto",
 *   description: "..."
 * }
 *
 * @function pickAllowedFields
 * @param {Object} obj - Source object (usually req.body)
 * @param {string[]} allowed - List of allowed keys
 * @returns {Object} Filtered object
 */
function pickAllowedFields(obj, allowed) {

  /* ---------- VALIDATION ---------- */

  if (!obj || typeof obj !== "object") {
    return {};
  }

  if (!Array.isArray(allowed)) {
    throw new Error("Allowed fields must be an array");
  }

  /* ---------- FILTER FIELDS ---------- */

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => allowed.includes(key))
  );
}

/* =====================================================
   EXPORT
   ===================================================== */

module.exports = pickAllowedFields;