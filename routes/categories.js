const express = require("express");
const router = express.Router();
const category = require("../controllers/categoryController");
const item = require("../controllers/itemController");

router.get("/", category.categoriesList);

router.get("/:category", category.categoryDetail);

router.get("/:name/delete", category.categoryDeleteGet);

router.post("/:name/delete", category.categoryDeletePost);

router.get("/:name/update", category.categoryUpdateGet);

router.post("/:name/update", category.categoryUpdatePost);

router.get("/:category/:id", item.itemDetail);

router.get("/:category/:id/update", item.itemUpdateGet);

router.post("/:category/:id/update", item.itemUpdatePost);

router.get("/:category/:id/delete", item.itemDeleteGet);

router.post("/:category/:id/delete", item.itemDeletePost);

module.exports = router;
