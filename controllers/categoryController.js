const async = require("async");
const Category = require("../models/category");
const Item = require("../models/item");

// get all categories
exports.categoriesList = function (req, res, next) {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list) {
      if (err) {
        return next(err);
      }
      // successful so render
      res.render("categoriesList", {
        title: "Tater's General Store",
        categoriesList: list,
      });
    });
};

// get category detail page
exports.categoryDetail = function (req, res, next) {
  async.parallel(
    {
      category(callback) {
        Category.find({ name: req.params.category }).exec(callback);
      },
      item(callback) {
        Item.find({ category: req.params.category }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // successful so render
      res.render("categoryDetail", {
        title: "Taters General Store",
        category: results.category,
        items: results.item,
      });
    }
  );
};
