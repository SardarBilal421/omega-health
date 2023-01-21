const express = require("express");
const appError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");
const Hospital = require("./../model/hospitalModel");
const Department = require("./../model/departmentModel");
const Doctor = require("./../model/doctorModel");
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

exports.uploadHospitalPicDir = upload.array("picture");

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
    const filename = `user-hospital-${req.body.name}-${Date.now()}-${
      1 + i
    }.jpeg`;

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

exports.updateHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body);

  if (!hospital) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      hospital,
    },
  });
});

exports.getAllHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.find();

  if (!hospital) {
    return next(new appError("No doc found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: hospital,
    },
  });
});

exports.getOneHospital = catchAsync(async (req, res, next) => {
  let dep;
  const hospital = await Hospital.findById(req.params.id).populate(
    "department"
  );
  // .select((dep = await Department.find({ hospital: req.params.id })));
  dep = await Department.find({ hospital: req.params.id });
  // hospital.map((el) => console.log(el.department));

  if (!hospital && !dep) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      hospital,
      dep,
    },
  });
});

exports.deleteHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, {
    isActive: false,
  });
  if (!hospital) {
    return next(new appError("No doc found by this ID", 404));
  }
  let dep;
  dep = await Department.findOneAndUpdate(
    { hospital: hospital._id },
    { isActive: false }
  );
  let doc;
  doc = await Doctor.findOneAndUpdate(
    { department: dep._id },
    { isActive: false }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: "success",
    },
  });
});

exports.addHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.create(req.body);

  if (!hospital) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: hospital,
    },
  });
});

exports.imageUpload = catchAsync(async (req, res, next) => {
  const hospital1 = await Hospital.findById(req.params.id);
  let respo;
  if (req.files) {
    respo = req.body.picture;
    req.body.picture = req.body.picture.concat(hospital1.picture);
  }

  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body);

  if (!hospital) {
    return next(new appError("No doc found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      picture: respo || "No image uploaded",
    },
  });
});

// https://omega-health.sfo3.cdn.digitaloceanspaces.com/ doctor/user-hospital-1674301429400-1.jpeg
