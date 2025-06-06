const express = require("express");
const router = express.Router();
const { addBrand, getBrands, deleteBrand } = require("../../controllers/common/brand-controller");

router.post("/", addBrand);
router.get("/", getBrands);
router.delete("/:id", deleteBrand);

module.exports = router;
