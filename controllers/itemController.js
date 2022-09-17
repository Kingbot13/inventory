const Item = require("../models/item");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");

// get all items
exports.itemsList = function (req, res, next) {
  Item.find()
    .sort([["name", "ascending"]])
    .exec(function (err, listItems) {
      if (err) {
        return next(err);
      }
      // successful so render
      res.render("index", {
        title: "Tater's General Store",
        itemsList: listItems,
      });
    });
};

// item detail page
exports.itemDetail = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) {
      return next(err);
    }
    // successful so render
    res.render("itemDetail", {
      title: "Tater's General Store",
      item: item,
    });
  });
};

// display item form
exports.itemCreateGet = function (req, res, next) {
  Category.find().exec(function (err, categories) {
    if (err) {
      return next(err);
    }
    res.render("itemForm", { title: "Create Item", categories: categories });
  });
};

// handle item form on post
exports.itemCreatePost = [
  // validate and sanitize
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Item name must be specified")
    .isAlphanumeric()
    .withMessage("Must have alphanumeric characters"),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          items(callback) {
            Item.find(callback);
          },
          categories(callback) {
            Category.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          for (const category of results.categories) {
            if (item.category.includes(category.name)) {
              category.checked = "true";
            }
          }
          res.render("itemForm", {
            title: "Create item",
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    }
    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
];
