const express = require("express");
const router = express.Router();
const category = require("../controllers/categoryController");
const item = require("../controllers/itemController");

router.get("/", category.categoriesList);

router.get("/:category", category.categoryDetail);

router.get("/:name/delete", category.categoryDeleteGet);

router.post("/:name/delete", category.categoryDeletePost);

router.get("/:category/:id", item.itemDetail);

module.exports = router;
