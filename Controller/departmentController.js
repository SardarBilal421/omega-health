const express = require("express");
<<<<<<< HEAD
const Department = require("../model/departmentModel");
const Doctor = require("../model/doctorModel");
const catchAsync = require("../utilities/catchAsync");
const appError = require("../utilities/appError");
=======
const Department = require("./../model/departmentModel");
const Doctor = require("./../model/doctorModel");
const catchAsync = require("./../utilities/catchAsync");
const appError = require("./../utilities/appError");
>>>>>>> origin/main

exports.getAllDepartment = catchAsync(async (req, res, next) => {
  const department = await Department.find();

  if (!department) {
    return next(new appError("no record found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      department,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const dep = await Department.create(req.body);
  if (!dep) {
    return next(new appError("No dep found by this ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      dep,
    },
  });
});

exports.deleteDepartment = catchAsync(async (req, res, next) => {
  const department = await Department.findByIdAndUpdate(req.params.id, {
    isActive: false,
  });

  if (!department) {
    return next(new appError("No doc found by this ID", 404));
  }

  let doc;
  doc = await Doctor.findOneAndUpdate(
    { department: department._id },
    { isActive: false }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: "success",
    },
  });
});

exports.updateDepartment = catchAsync(async (req, res, next) => {
  const department = await Department.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  if (!department) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: department,
    },
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const dep = await Department.findById(req.params.id)
    .populate({
      path: "doctor",
      select: "-__v",
    })
    .populate({
      path: "hospital",
      select: "-__v",
    });

  doc = await Doctor.find({ department: req.params.id });

  if (!dep) {
    return next(new appError("No dep found by this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: dep,
<<<<<<< HEAD
      doctor: doc,
=======
      doctor:doc,
>>>>>>> origin/main
    },
  });
});
