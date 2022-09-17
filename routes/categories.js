const express = require("express");
const router = express.Router();
const category = require("../controllers/categoryController");

router.get("/", category.categoriesList);

router.get("/:category", category.categoryDetail);

module.exports = router;
