const Product = require("../model/Product");

const getProducts = async (req, res) => {
  let products = await Product.find();
  res.status(200).send(products);
};

const storeProduct = async (req, res, next) => {
  try {
    let product = await Product.create({
      ...req.body,
      createdBy: req.user,
    });
    console.log(product);
    res.send(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try{
    let product = await Product.findOne({ _id: req.params.id });

    if (product) {
      if (req.user._id !== product.createdBy.toString()) {
        return res.status(403).send({ msg: "Permission denied" });
      }
      let updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
      });
      return res.status(200).send({
        msg: "Product updated",
        updatedProduct
      });
    }
  
    res.status(400).send({ msg: "Product not found" });
  }catch(err){
    next(err)
  }
 
};

const deleteProduct = async (req, res, next) => {
  try{
    let product = await Product.findOne({ _id: req.params.id });

    if (product) {
      if (req.user._id !== product.createdBy.toString()) {
        return res.status(403).send({ msg: "Permission denied" });
      }
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).send({
        msg: "Product deleted",
      });
    }
  }catch (err){
    next(err)
  }
 

  res.status(400).send({ msg: "Product not found" });
};

module.exports = {
  getProducts,
  storeProduct,
  updateProduct,
  deleteProduct,
};
