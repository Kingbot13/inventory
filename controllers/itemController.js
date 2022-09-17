const Item = require('../models/item');
const {body, validationResult} = require('express-validator');

// get all items
exports.itemsList = function (req, res, next) {
    Item.find()
    .sort([['name', 'ascending']])
    .exec(function (err, listItems) {
        if (err) {
            return next(err);
        }
        // successful so render
        res.render('index', {
            title: "Tater's General Store",
            itemsList: listItems
        });
    })
}

// item detail page
exports.itemDetail = function (req, res, next) {
    Item.findById(req.params.id)
    .exec(function (err, item) {
        if (err) {
            return next(err);
        }
        // successful so render
        res.render('itemDetail', {
            title: "Tater's General Store",
            item: item
        });
    })
}

// display item form
exports.itemCreateGet = function(req, res, next) {
    res.render('itemForm', {title: 'Create Item'});
}

// handle item form on post