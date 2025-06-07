const express = require("express");
const { getAutocompleteResults } = require("../../controllers/shop/autocomplete-controller");

const router = express.Router();

router.get("/:keyword", getAutocompleteResults);

module.exports = router;