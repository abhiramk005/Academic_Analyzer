const {errorHandler} = require("../middleware/error");
const User = require("../models/user.model.js");
const admins = require("../models/admin.model.js")
const jwt = require("jsonwebtoken");

// const signup = async (req, res, next) => {
//   const { registerid, password } = req.body;
//   const newUser = new User({ registerid, password });
//   try {
//     await newUser.save();
//     res.status(201).json("User created successfully");
//   } catch (error) {
//     next(error);
//   }
// };

const signin = async (req, res, next) => {
  const {role, userId, password} = req.body;
  console.log(role,userId,password);
  try {
    let validUser=null;
    //const validUser = await User.find();
    //console.log("huh",validUser)
    if (role==="student"){
      validUser = await User.findOne({ registerid: userId , password});
      if (!validUser) return next(errorHandler(404, "user not found"));
    }
    else if(role==="admin"){
      validUser = await admins.findOne({ registerid: userId , password});
      console.log("huh",validUser)
      if (!validUser) return next(errorHandler(404, "user not found"));
    }
    // const validPassword = await User.findOne({ password });
    // if (!validPassword) return next(errorHandler(401, "invalid password"));

    const age = 1000 * 60 * 60 * 24 * 2;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: age,
    });

    const { password: pass, ...rest } = validUser._doc;
    console.log("User signed in successfully:", rest);

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: age,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  //signup,
  signin
};