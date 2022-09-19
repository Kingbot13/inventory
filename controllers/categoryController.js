const async = require("async");
const { body, validationResult } = require("express-validator");
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
        Category.findOne({ name: req.params.category }).exec(callback);
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

// display category form
exports.categoryCreateGet = function (req, res, next) {
  res.render("categoryForm", { title: "Create category" });
};

// handle category form on post
exports.categoryCreatePost = [
  // validate and sanitize
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Category name must be specified"),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Create category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ name: req.body.name }).exec((err, foundCategory) => {
        if (err) {
          return next(err);
        }
        if (foundCategory) {
          res.redirect(foundCategory.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

exports.categoryDeleteGet = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.find({ name: req.params.name }).exec(callback);
      },
      categoryItems(callback) {
        Item.find({ category: req.params.name }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category === null) {
        // no results
        res.redirect("/categories");
      }
      // successful
      res.render("categoryDelete", {
        title: "Delete category",
        category: results.category,
        categoryItems: results.categoryItems,
      });
    }
  );
};

exports.categoryDeletePost = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.find({ name: req.params.name }).exec(callback);
      },
      categoryItems(callback) {
        Item.find({ category: req.params.name }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.categoryItems.length > 0) {
        res.render("categoryDelete", {
          title: "Delete category",
          category: results.category,
          categoryItems: results.categoryItems,
        });
        return;
      }
      // category has no items so delete
      Category.findOneAndRemove({ name: req.params.name }, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/categories");
      });
    }
  );
};

exports.categoryUpdateGet = (req, res, next) => {
  Category.findOne({ name: req.params.name }).exec((err, foundCategory) => {
    if (err) {
      return next(err);
    }
    if (!foundCategory) {
      res.redirect("/categories");
    }
    res.render("categoryForm", {
      title: "Update item",
      category: foundCategory,
    });
  });
};

exports.categoryUpdatePost = [
  body("name", "name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    Category.findOne({ name: req.params.name }).exec((err, foundCategory) => {
      if (err) {
        return next(err);
      }
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: foundCategory._id,
      });

      Category.findOneAndUpdate(
        { name: foundCategory.name },
        category,
        {},
        (err, theCategory) => {
          if (err) {
            return next(err);
          }
          res.redirect(theCategory.url);
        }
      );
    });
  },
];
