var express = require("express");
var router = express.Router();
const itemController = require("../controllers/itemController");
const categoryController = require("../controllers/categoryController");

/* GET home page. */
router.get("/", itemController.itemsList);

// item form on get
router.get("/create-item", itemController.itemCreateGet);

// item form on post
router.post("/create-item", itemController.itemCreatePost);

// category form on get
router.get("/create-category", categoryController.categoryCreateGet);

// category form on post
router.post("/create-category", categoryController.categoryCreatePost);

module.exports = router;
