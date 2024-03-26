// Load mongoose since we need it to define a model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the product model
const ProductSchema = new Schema({
    asin: String,
    title: String,
    imgUrl: String,
    stars: Number,
    reviews: Number,
    price: Number,
    listPrice: Number,
    categoryName: String,
    isBestSeller: String,
    boughtInLastMonth: Number
});

// Export the product model
module.exports = mongoose.model('Product', ProductSchema);
