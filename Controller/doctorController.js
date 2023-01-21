const express = require("express");
const Doctor = require("./../model/doctorModel");
const catchAsync = require("./../utilities/catchAsync");
const appError = require("./../utilities/appError");
const app = require("./../app");
const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");

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

exports.uploadDoctorPicDir = upload.array("picture");

exports.getImage = catchAsync(async (req, res, next) => {
  const [SPACE_NAME, SPACE_REGION, ACCESS_KEY, SECRET_KEY] = [
    `omega-health`,
    "sfo3.digitaloceanspaces.com",
    "DO004U2MCNCWB8L2JXVV",
    "VXn0UnQvQEzW1VxL+f3b6dX6WH7rKlnSur/S48okXAc",
  ];

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  });
  const spacesEndpoint = new AWS.Endpoint(SPACE_REGION);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
  });

  const params = {
    Bucket: SPACE_NAME,
    Key: req.params.pictureName,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    data.ContentType = "image/jpeg";
    res.set("Content-Type", data.ContentType);
    console.log(data.Body);
    res.send(data.Body);
  });
});

exports.saveImage = catchAsync(async (req, res, next) => {
  const [SPACE_NAME, SPACE_REGION, ACCESS_KEY, SECRET_KEY] = [
    `omega-health`,
    "sfo3.digitaloceanspaces.com",
    "DO004U2MCNCWB8L2JXVV",
    "VXn0UnQvQEzW1VxL+f3b6dX6WH7rKlnSur/S48okXAc",
  ];

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  });
  const spacesEndpoint = new AWS.Endpoint(SPACE_REGION);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
  });

  req.body.picture = [];
  req.files.map(async (file, i) => {
    const filename = `user-dcotor-${req.body.name}-${Date.now()}-${1 + i}.jpeg`;

    const params = {
      Bucket: SPACE_NAME,
      Key: filename,
      Body: req.files[i].buffer,
    };

    s3.putObject(params, (err, data) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
    });
    req.body.picture.push(filename);
  });
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

exports.imageUpload = catchAsync(async (req, res, next) => {
  const doctor1 = await Doctor.findById(req.params.id);
  if (req.files) {
    req.body.picture = req.body.picture.concat(doctor1.picture);
  }

  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body);

  if (!doctor) {
    return next(new appError("No doc found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doctor,
    },
  });
});
