const express = require("express");
const router = express.Router();
const { getLowStockProducts } = require("../../controllers/common/low-stock-controller");

router.get("/", getLowStockProducts);

module.exports = router;