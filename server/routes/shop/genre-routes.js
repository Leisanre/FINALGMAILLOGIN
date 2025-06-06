const express = require("express");
const router = express.Router();
const { addGenre, getGenres, deleteGenre } = require("../../controllers/common/genre-controller");

router.post("/", addGenre);
router.get("/", getGenres);
router.delete("/:id", deleteGenre);

module.exports = router;
