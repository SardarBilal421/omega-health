const express = require("express");
const appError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");
const Hospital = require("./../model/hospitalModel");
const Department = require("./../model/departmentModel");
const Doctor = require("./../model/doctorModel");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();
//   destination: (req, file, cb) => {
//     cb(null, "public/img/hospital");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `user-${req.params.id}-${Date.now()}.${ext}`;
//     cb(null, filename);
//     req.file.filename = filename;
//   },
// });

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
exports.uploadHospitalPicDir = upload.array("picture");
// exports.uploadHospitalPicDir = upload.fields([
//   {
//     name: "picture",
//     maxCount: 3,
//   },
// ]);

exports.resizePicture = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  //  req.files.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
  req.body.picture = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `user-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;

      await sharp(file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/hospital/${filename}`);

      req.body.picture.push(filename);
    })
  );
  next();
});

exports.updateHospital = catchAsync(async (req, res, next) => {
  console.log(req.file);

  if (req.file) {
    req.body.picture = req.file.filename;
  }
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
