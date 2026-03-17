const express = require("express");
const router = express.Router();

const home = require("../controllers/home.controller");

/*
=====================================================
HOME ROUTES
=====================================================
*/

/* ===============================
   GET HOME DATA
   =============================== */

/**
 * Homepage sections data
 *
 * @route   GET /api/home
 * @access  Public
 */
router.get("/", home.getHome);

module.exports = router;