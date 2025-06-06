const express = require("express");
const router = express.Router();
const { getTopSellingProducts } = require("../../controllers/common/top-products-controller");

router.get("/", getTopSellingProducts);

module.exports = router;