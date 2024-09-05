var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const User = require("../model/User");

const loginSchema = Joi.object({
  password: Joi.string().alphanum().min(8).max(30).required(),
  email: Joi.string().email().required(),
});

const login = async (req, res, next) => {
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

  let user = await User.findOne({ email: req.body.email }).select({"+password" : 1});
  if (!user) {
    return res.status(400).send({ msg: "User not found" });
  }
  console.log(user);
  

  let matched = await bcrypt.compare(req.body.password, user.password);
  if (matched) {
    user = user.toObject()
    delete user.password
    var token = jwt.sign(user, "shhhhh");
   
    res.send({
      user,
      token,
    });
  } else {
    res.status(401).send({ msg: "Invalid credentials" });
  }
};

const signSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
  email: Joi.string().email().required(),
});

const signup = async (req, res, next) => {
  try {
    const { error }  = signSchema.validate(req.body, {
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

    // let oldUser = await User.findOne({email : req.body.email})
    // if(oldUser){
    //   return res.status(400).send([{
    //     "msg": "\"email\" is required",
    //     "params": "email"
    // }])
    // }
    // let userData = req.body
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);

    let user = await User.create({ ...req.body, password: hashedPassword });
    let userObj = user.toObject()
    delete userObj.password
    console.log(userObj);
    res.send(userObj);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
    login,
    signup
}