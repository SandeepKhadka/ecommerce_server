const Product = require("../model/Product");

const getProducts = async (req, res) => {
  let products = await Product.find();
  res.status(200).send(products);
};

const storeProduct = async (req, res, next) => {
  try {
    let product = await Product.create({
      title: req.body.title,
      price: req.body.price,
      createdBy: req.user,
    });
    console.log(product);
    res.send(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getProducts,
  storeProduct,
};
