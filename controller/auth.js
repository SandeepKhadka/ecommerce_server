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

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ msg: "User not found" });
  }
  let matched = await bcrypt.compare(req.body.password, user.password);
  if (matched) {
    var token = jwt.sign(user.toObject(), "shhhhh");
    res.send({
      user,
      token,
    });
  } else {
    res.status(401).send({ msg: "Invalid credentials" });
  }
};

module.exports = {
    login
}