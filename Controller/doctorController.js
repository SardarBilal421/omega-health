const express = require("express");
const Doctor = require("./../model/doctorModel");
const catchAsync = require("./../utilities/catchAsync");
const appError = require("./../utilities/appError");
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main

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
<<<<<<< HEAD
  const doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
=======
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
>>>>>>> origin/main

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
<<<<<<< HEAD
  const doc = await Doctor.create(req.body);
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD

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
=======
>>>>>>> origin/main
