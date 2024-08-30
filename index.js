const express = require("express");
const Product = require("./model/Product.js");
const User = require("./model/User.js");
require("./config/database.js");
const app = express();

app.use(express.json()); // global middleware, runs in every routes, sets up data in request.body

app.post("/api/signup", async (req, res) => {
    // console.log(req.body);
    // let {name, email, password} = req.body
    // console.log(name, email, password);
  try {
    // let userData = req.body
    let user = await User.create(req.body);
    // console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error.name);
    if(error.name === "ValidationError"){
        return res.status(400).send({
            "msg" : "Bad request",
            "error": error.errors
        })
    }
    res.status(500).send("server error");
  }
});

app.post("/api/products", async (req, res) => {
  try {
    let product = await Product.create({
      title: req.body.title,
      price: req.body.price,
    });
    console.log(product);
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("server error");
  }
});

app.get("/api/products", async (req, res) => {
  let products = await Product.find();
  res.status(200).send(products);
});

app.listen(8000, () => {
  console.log("server started....");
});
