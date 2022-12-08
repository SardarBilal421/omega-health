const express = require("express");
const router = express.Router();
const doctorController = require("./../Controller/doctorController");
const userController = require("./../Controller/userController");

router
  .route("/")
  .get(doctorController.getAllDoctor)
  .post(
    userController.protect,
    doctorController.uploadDoctorPicDir,
    doctorController.resizePicture,
    doctorController.createOne
  );

router
  .route("/:id")
  .get(doctorController.getOneDoctor)
  .patch(
    userController.protect,
    doctorController.uploadDoctorPicDir,
    doctorController.resizePicture,
    doctorController.updateOne
  )
  .delete(userController.protect, doctorController.deleteOne);

module.exports = router;
