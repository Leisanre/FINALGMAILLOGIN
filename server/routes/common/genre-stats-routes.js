const express = require("express");
const router = express.Router();
const { getTopGenresByStats } = require("../../controllers/common/genre-stats-controller");

router.get("/", getTopGenresByStats);

module.exports = router;