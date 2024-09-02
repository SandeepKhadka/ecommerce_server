const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Product = require("./model/Product.js");
const User = require("./model/User.js");
require("./config/database.js");
const app = express();

app.use(express.json()); // global middleware, runs in every routes, sets up data in request.body

/* 

  Types of Validation

    1) Client side validation
    2) server side validation
    3) database validation

*/

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
  email: Joi.string().email().required(),
});

app.post("/api/signup", async (req, res) => {
  // console.log(req.body);
  // let {name, email, password} = req.body
  // console.log(name, email, password);
  try {
    const value = await userSchema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    // let userData = req.body
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    
    let user = await User.create({...req.body, password: hashedPassword});
    console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
    let errors = error.details.map((el) => {
      return {
        msg: el.message,
        params: el.context.key,
      };
    });

    // console.error(error.name);
    if (error.name === "ValidationError") {
      return res.status(400).send({
        msg: "Bad request",
        error: errors,
      });
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
