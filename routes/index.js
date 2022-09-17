var express = require("express");
var router = express.Router();
const itemController = require("../controllers/itemController");

/* GET home page. */
router.get("/", itemController.itemsList);

// item form on get
router.get("/create-item", itemController.itemCreateGet);

// item form on post
router.post("/create-item", itemController.itemCreatePost);

module.exports = router;
