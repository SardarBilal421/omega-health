const express = require("express");
const appError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");
const Hospital = require("./../model/hospitalModel");
const Department = require("./../model/departmentModel");
const Doctor = require("./../model/doctorModel");
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

exports.uploadHospitalPicDir = upload.array("picture");

exports.resizePicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  let pathname = `${__filename}`
  pathname = pathname.split("OmigaHealth-main")

  //  req.files.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
  req.body.picture = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;
      // const f = require('./../../Project2/public/assets/public/img/hospital/')
      await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        // .toFile(`public/img/hospital/${filename}`);
        .toFile(`${pathname[0]}/Project2/public/assets/public/img/hospital/${filename}`);
      req.body.picture.push(filename);
    })
  );
  next();
});

exports.updateHospital = catchAsync(async (req, res, next) => {
  console.log(req.file);

  // if (req.file) {
  //   req.body.picture = req.file.filename;
  // }
  //  else {
  //   return next(new appError("Nass KAPII NIYA", 404));
  // }
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
  if (req.file) {
    req.body.picture = req.file.filename;
  }

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
  const hospital1 = await Hospital.findOne({_id:req.params.id});
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