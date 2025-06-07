const express = require("express");
const router = express.Router();
const { getTopCategoriesByStats } = require("../../controllers/common/category-stats-controller");

router.get("/", getTopCategoriesByStats);

module.exports = router;