require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,
});

itemSchema.virtual('url').get(function() {
    return `/categories/${this.category}/${this._id}`;
});

module.exports = mongoose.model('item', itemSchema)