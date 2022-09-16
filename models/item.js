const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,
});

ItemSchema.virtual('url').get(function() {
    return `/categories/${this.category}/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema)