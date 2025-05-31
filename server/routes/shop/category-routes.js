const express = require("express");
const router = express.Router();
const { addCategory, getCategories, deleteCategory } = require("../../controllers/common/category-controller");

router.post("/", addCategory);
router.get("/", getCategories);
router.delete("/", deleteCategory);

module.exports = router;
