const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
 
  createdBy: {
    ref : "User",
    type : ObjectId
  }
});

const Product = mongoose.model("Product", OrderSchema);

module.exports = Product;
