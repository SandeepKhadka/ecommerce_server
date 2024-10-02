const Product = require("../model/Product");
const path = require("path");

const getProducts = async (req, res, next) => {
  console.log(req.query);
  let searchTerm = req.query.searchTerm;
  let priceFrom = parseFloat(req.query.priceFrom) || 0;
  // let priceFrom = parseFloat(req.query.priceFrom) || 0
  let priceTo = parseFloat(req.query.priceTo) || 9999999999999999;
  let pageProduct = parseInt(req.query.pageProduct) || 10;
  let page = parseInt(req.query.page) || 1;
  try {
    // let products = await Product.find({title : RegExp(searchTerm, "i")});
    // let products = await Product.find({price : {$gt : priceFrom}});
    // let products = await Product.find({price : {$lt : priceTo}});
    let filterOptions = {
      $and: [
        { price: { $gt: priceFrom } },
        { price: { $lt: priceTo } },
        { title: RegExp(searchTerm, "i") },
      ],
    };
    let total = await Product.find(filterOptions)
      .skip((page - 1) * pageProduct)
      .limit(pageProduct)
      .countDocuments();
    let products = await Product.find(filterOptions)
      .populate("createdBy", "name email")
      .skip((page - 1) * pageProduct)
      .limit(pageProduct);

    // let products = await Product.find();
    res.status(200).send({ total, products });
  } catch (err) {
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id }).populate(
      "createdBy",
      "name email"
    );
    res.send(product);
  } catch (err) {
    next(err);
  }
};

const storeProduct = async (req, res, next) => {
  try {
    if (req.files) {
      let destination = path.join(
        path.resolve(),
        "uploads",
        req.files.image.name
      );
      req.files.image.mv(destination);
    }

    let product = await Product.create({
      ...req.body,
      createdBy: req.user,
      image: req.files.image.name,
    });
    console.log(product);
    res.send(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id });

    if (product) {
      if (req.user._id !== product.createdBy.toString()) {
        return res.status(403).send({ msg: "Permission denied" });
      }

      let imageName = product.image;
      if (req.files && req.files.image) {
        let destination = path.join(
          path.resolve(),
          "uploads",
          req.files.image.name
        );
        await req.files.image.mv(destination);
        imageName = req.files.image.name;
      }
      let updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          image: imageName,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).send({
        msg: "Product updated",
        updatedProduct,
      });
    }

    res.status(400).send({ msg: "Product not found" });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }

  res.status(400).send({ msg: "Product not found" });
};

module.exports = {
  getProducts,
  storeProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};
