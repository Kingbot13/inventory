const { retry } = require('async');
const Category = require('../models/category');

// get all categories
exports.categoriesList = function(req, res, next) {
    Category.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list) {
        if (err) {
            return next(err);
        }
        // successful so render
        res.render('categoriesList', {
            title: "Tater's General Store",
            categoriesList: list
        });
    })
}