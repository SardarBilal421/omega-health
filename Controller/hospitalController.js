const express = require("express");
const appError = require("./../utilities/appError");
const catchAsync = require("./../utilities/catchAsync");
const Hospital = require("./../model/hospitalModel");
const Department = require("./../model/departmentModel");
const Doctor = require("./../model/doctorModel");
// const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();
const multer = require("multer");
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const AWS = require("aws-sdk");

const fs = require("fs");

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

// let space = new AWS.S3({
//   //Get the endpoint from the DO website for your space
//   endpoint: "https://omega-health.sfo3.digitaloceanspaces.com",
//   useAccelerateEndpoint: false,
//   //Create a credential using DO Spaces API key (https://cloud.digitalocean.com/account/api/tokens)
//   credentials: new AWS.Credentials(
//     "DO008TZYATK7N93K6M3D",
//     "YVPYHzbSSdvwzqw3B44ezaOzyZk9euzS8TcHc7aFmmA",
//     null
//   ),
// });

//Name of your bucket here
// const BucketName = "omega-health";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `hospital-${req.params.id}-${Date.now()}.jpeg`);
  },
});

const upload = multer({ storage: storage });

exports.uploadHospitalPicDir = upload.single("picture");

/* Upload file */
// exports.resizePicture = catchAsync(async (req, res, next) => {
//   let uploadParameters = {
//     Body: req.file.buffer,
//     Bucket: BucketName,
//     ContentType: req.file.mimetype,
//     ACL: req.query.acl,
//     Key: req.query.file_name,
//   };
//   space.upload(uploadParameters, function (error, data) {
//     if (error) {
//       console.error(error);
//       res.sendStatus(500);
//       return next(new appError("Not Uploaded", 404));
//     }
//     res.sendStatus(200);
//   });
//   next();
// });

// exports.resizePicture = catchAsync(async (req, res, next) => {
//   if (!req.files) return next();

//   let pathname = `${__filename}`;
//   pathname = pathname.split("OmigaHealth-main");

//   //  req.files.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
//   req.body.picture = [];
//   await Promise.all(
//     req.files.map(async (file, i) => {
//       const filename = `user-${req.params.id}-${Date.now()}-${1 + i}.jpeg`;
//       // const f = require('./../../Project2/public/assets/public/img/hospital/')

//       await sharp(file.buffer)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         // .toFile(`public/img/hospital/${filename}`);
//         .toFile(
//           `${pathname[0]}/Project2/public/assets/public/img/hospital/${filename}`
//         );
//       req.body.picture.push(filename);
//       req.body.picture = file.buffer;
//       console.log(req.body.picture);
//     })
//   );
//   next();
// });

exports.updateHospital = catchAsync(async (req, res, next) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    department: req.body.department,
    picture: {
      data: fs.readFileSync("./uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });

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
    length: hospital.length,
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
  const hospital = await Hospital.create({
    name: req.body.name,
    department: req.body.department,
    picture: {
      data: fs.readFileSync("./uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });

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
  const hospital1 = await Hospital.findOne({ _id: req.params.id });
  console.log(req.body.picture);
  req.body.picture = { ...req.body.picture, ...hospital1.picture };

  // let respo;
  // if (req.files) {
  //   respo = req.body.picture;
  //   req.body.picture = req.body.picture.concat(hospital1.picture);
  // }

  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body);

  if (!hospital) {
    return next(new appError("No doc found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      picture: req.body.picture || "Uploaded",
    },
  });
});
