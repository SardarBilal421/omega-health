const express = require("express");
const Doctor = require("./../model/doctorModel");
const catchAsync = require("./../utilities/catchAsync");
const appError = require("./../utilities/appError");
const app = require("./../app");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("Not an image please uplaod an Image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: "public/img/hospital" });
exports.uploadDoctorPicDir = upload.array("picture");

exports.resizePicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  //  req.files.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
  req.body.picture = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `doctor-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;

      await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/doctor/${filename}`);

      req.body.picture.push(filename);
    })
  );
  next();
});

exports.getAllDoctor = catchAsync(async (req, res, next) => {
  const doctors = await Doctor.find();

  if (!doctors) {
    return next(new appError("no record found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      doctors,
    },
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.picture = req.file.filename;
  }

  const doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.picture = req.file.filename;
  }

  const doc = await Doctor.create(req.body);
  if (!doc) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const doc = await Doctor.findByIdAndUpdate(req.params.id, {
    isActive: false,
  });
  if (!doc) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: "deleted",
  });
});

exports.getOneDoctor = catchAsync(async (req, res, next) => {
  const doc = await Doctor.findById(req.params.id)
    .populate("department")
    .populate("hospital");

  if (!doc) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: doc,
  });
});
