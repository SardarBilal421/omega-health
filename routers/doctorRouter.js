const express = require("express");
const router = express.Router();
const doctorController = require("./../Controller/doctorController");

router
  .route("/")
  .get(doctorController.getAllDoctor)
  .post(
    doctorController.uploadDoctorPicDir,
    doctorController.resizePicture,
    doctorController.createOne
  );

router
  .route("/:id")
  .get(doctorController.getOneDoctor)
  .patch(
    doctorController.uploadDoctorPicDir,
    doctorController.resizePicture,
    doctorController.updateOne
  )
  .delete(doctorController.deleteOne);

module.exports = router;
