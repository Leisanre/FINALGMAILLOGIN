const express = require("express");
const router = express.Router();
const { addBrand, getBrand, deleteBrand } = require("../../controllers/common/brand-controller");

router.post("/", addBrand);
router.get("/", getBrand);
router.delete("/", deleteBrand);

module.exports = router;
