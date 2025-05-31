const express = require("express");
const router = express.Router();
const { addGenre, getGenre, deleteGenre } = require("../../controllers/common/genre-controller");

router.post("/", addGenre);
router.get("/", getGenre);
router.delete("/", deleteGenre);

module.exports = router;
