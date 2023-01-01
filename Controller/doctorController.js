const express = require("express");
const Doctor = require("./../model/doctorModel");
const catchAsync = require("./../utilities/catchAsync");
const appError = require("./../utilities/appError");
const app = require("../app");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const sharp = require("sharp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `doctor-${req.params.id}-${Date.now()}.jpeg`);
  },
});

const upload = multer({ storage: storage });

// exports.uploadHospitalPicDir = upload.single("picture");

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new appError("Not an image please uplaod an Image", 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// const upload = multer({ dest: "public/img/hospital" });
exports.uploadDoctorPicDir = upload.single("picture");

// exports.resizePicture = catchAsync(async (req, res, next) => {
//   if (!req.files) return next();

//   let pathname = `${__filename}`;
//   pathname = pathname.split("OmigaHealth-main");

//   //  req.files.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
//   req.body.picture = [];
//   await Promise.all(
//     req.files.map(async (file, i) => {
//       const filename = `user-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;
//       await sharp(file.buffer)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(
//           `${pathname[0]}/Project2/public/assets/public/img/doctor/${filename}`
//         );
//       req.body.picture.push(filename);
//     })
//   );
//   next();
// });

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
  const doc = await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      picture: {
        data: fs.readFileSync("./uploads/" + req.file.filename),
        contentType: "image/png",
      },
      department: req.body.department,
      experiance: req.body.experiance,
      qualification: req.body.qualification,
      hospital: req.body.hospital,
    },
    {
      new: true,
      runValidators: true,
    }
  );

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
  const doc = await Doctor.create({
    name: req.body.name,
    picture: {
      data: fs.readFileSync("./uploads/" + req.file.filename),
      contentType: "image/png",
    },
    department: req.body.department,
    experiance: req.body.experiance,
    qualification: req.body.qualification,
    hospital: req.body.hospital,
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
