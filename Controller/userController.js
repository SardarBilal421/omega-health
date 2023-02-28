const express = require("express");
const User = require("./../model/userModel");
const catchAsync = require("./../utilities/catchAsync");
const appError = require("./../utilities/appError");
<<<<<<< HEAD
const app = require("./../app");
=======
const app = require("../app");
>>>>>>> origin/main
const jwt = require("jsonwebtoken");

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.createOne = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  if (!user) {
    return next(new appError("Error Cant ADD user", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please Provide Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect Email or passowrd", 401));
  }

  const token = signtoken(user._id);

  res.status(201).json({
    status: "success",
    token,
  });
});

<<<<<<< HEAD
exports.protect = catchAsync(async (req, res, next) => {
  //Getting tokken and check if its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError("User is not Logged In please Log in!!!!"));
  }
  // Verification Tokennn
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exits
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new appError("the user belonging to this token doesnot exisit", 401)
    );
  }
  // chec if user change password after logging in
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(new appError("Please Logged in again", 401));
  }
  req.user = currentUser;
  //GRAND ACCESS TO PROTEXTED ROUTE
  next();
});
=======
// exports.protect = catchAsync(async (req, res, next) => {
//     //Getting tokken and check if its there or not
//     let token;
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//     }
//     if (!token) {
//       return next(new appError('User is not Logged In please Log in!!!!'));
//     }
//     // Verification Tokennn
//     const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//     // check if user still exits
//     const currentUser = await User.findById(decode.id);
//     if (!currentUser) {
//       return next(
//         new appError('the user belonging to this token doesnot exisit', 401)
//       );
//     }
//     // chec if user change password after logging in
//     if (currentUser.changePasswordAfter(decode.iat)) {
//       return next(new appError('Please Logged in again', 401));
//     }
//     req.user = currentUser;
//     //GRAND ACCESS TO PROTEXTED ROUTE
//     next();
//   });
>>>>>>> origin/main
