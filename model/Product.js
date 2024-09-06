const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  createdBy: {
    ref : "User",
    type : ObjectId
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
