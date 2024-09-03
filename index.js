const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Product = require("./model/Product.js");
const User = require("./model/User.js");
const handleServerError = require("./middleware/handleServerError.js");
require("./config/database.js");
const app = express();

app.use(express.json()); // global middleware, runs in every routes, sets up data in request.body

/* 

  Types of Validation

    1) Client side validation
    2) server side validation
    3) database validation

*/

const signSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().alphanum().min(8).max(30).required(),
  email: Joi.string().email().required(),
});

app.post("/api/login", async (req, res, next) => {
  const { error } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    let errors = error.details.map((el) => {
      return {
        msg: el.message,
        params: el.context.key,
      };
    });
    return res.send(errors);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ msg: "User not found" });
  }
  let matched = await bcrypt.compare(req.body.password, user.password)
  if(matched){
    res.send({msg : "logged in"});
  }else{
    res.status(401).send({msg : "Invalid credentials"})
  }
});

app.post("/api/signup", async (req, res, next) => {
  // console.log(req.body);
  // let {name, email, password} = req.body
  // console.log(name, email, password);
  try {
    // const value = await signSchema.validateAsync(req.body, {
    //   abortEarly: false,
    //   stripUnknown: true,
    // });
    // let userData = req.body
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    let user = await User.create({ ...req.body, password: hashedPassword });
    console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
    // let errors = error.details.map((el) => {
    //   return {
    //     msg: el.message,
    //     params: el.context.key,
    //   };
    // });

    // console.error(error.name);
    // if (error.name === "ValidationError") {
    //   return res.status(400).send({
    //     msg: "Bad request",
    //     error: error.errors,
    //   });
    // }
    next(error);
  }
});

app.post("/api/products", async (req, res, next) => {
  try {
    let product = await Productt.create({
      title: req.body.title,
      price: req.body.price,
    });
    console.log(product);
    res.send(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.get("/api/products", async (req, res) => {
  let products = await Product.find();
  res.status(200).send(products);
});

app.use((req, res) => {
  res.status(404).send({ msg: "Resource not found" });
});

app.use(handleServerError);

app.listen(8000, () => {
  console.log("server started....");
});
