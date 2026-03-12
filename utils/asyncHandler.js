/* =====================================================
   ASYNC ERROR WRAPPER FOR EXPRESS
   ===================================================== */

/**
 * Wraps async route handlers and forwards errors
 * to Express global error middleware.
 *
 * Without this wrapper, async errors would require
 * try/catch in every controller.
 *
 * Example:
 *
 * router.get(
 *   "/animes",
 *   asyncHandler(animeController.getAll)
 * )
 *
 * @function asyncHandler
 * @param {Function} fn - async controller function
 * @returns {Function} Express middleware
 */
function asyncHandler(fn) {
  return function asyncMiddleware(req, res, next) {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};

module.exports = asyncHandler;