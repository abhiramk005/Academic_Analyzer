import { errorHandler } from "../middleware/error.js";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { registerid, password } = req.body;
  const newUser = new User({ registerid, password });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { registerid, password } = req.body;

  try {
    const validUser = await User.findOne({ registerid });
    if (!validUser) return next(errorHandler(404, "user not found"));
    const validPassword = await User.findOne({ password });
    if (!validPassword) return next(errorHandler(401, "invalid password"));

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
