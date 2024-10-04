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
    const {products : orderProducts, shipping_address, paymentMethod} = req.body
    if(!shipping_address && !paymentMethod){
      res.status(400).send("Shipping details and payment method is required")
    }
    let products = []
    for(let index = 0; index < orderProducts.length; index++){
        let element = orderProducts[index]
        
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
        createdBy: req.user._id,
        shipping_address,
        paymentMethod
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
