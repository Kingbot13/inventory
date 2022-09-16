const Item = require('../models/item');

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