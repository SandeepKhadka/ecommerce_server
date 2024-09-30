const mongoose = require("mongoose");
const { SELLER, BUYER, ADMIN } = require("../constants/product");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // custom validation
    validate: {
      validator : async function(value){
        console.log({value});
        
        let oldUser = await mongoose.models.User.findOne({email : value})
        if(oldUser){
          return false
        }
        return true
      },
      message : "email already used"
    }
    
  },
  password: {
    type: String,
    required: true,
    select : false
  },
  role:{
    type: String,
    required:true,
    enum: [SELLER, BUYER],
    default: BUYER
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
