const Order = require("../model/Order");
const Product = require("../model/Product");

const getOrders = async (req, res, next) => {
  try {
    let orders = await Order.find().populate("createdBy", "name email");
    res.send(orders);
  } catch (err) {
    next(err);
  }
};

const storeOrder = async (req, res, next) => {
  try {
    let products = []
    for(let index = 0; index < req.body.products.length; index++){
        let element = req.body.products[index]
        
        let db_product = await Product.findOne({_id : element._id})
        // console.log(db_product);
        
        products.push({
            ...db_product.toObject(),
            quantity: element.quantity
        })
    }
    console.log(products);
    let orders = await Order.create({
        products,
        createdBy: req.user._id
    })
    
    
    res.send(orders)
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  storeOrder
};
