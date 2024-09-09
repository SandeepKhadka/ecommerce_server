const { required } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
  products: {
    type: [
      {
        title: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    validate: {
      validator: function (products) {
        if (products.length == 0) {
          return false;
        }
      },
      message: "atleast one product is required",
    },
  },
  createdBy: {
    ref: "User",
    type: ObjectId,
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
