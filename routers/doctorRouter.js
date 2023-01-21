const express = require("express");
const router = express.Router();
const doctorController = require("./../Controller/doctorController");

router.get("/getImage/:pictureName", doctorController.getImage);

router.patch(
  "/imageUpload/:id",
  doctorController.uploadDoctorPicDir,
  doctorController.saveImage,
  doctorController.imageUpload
);

router
  .route("/")
  .get(doctorController.getAllDoctor)
  .post(
    doctorController.uploadDoctorPicDir,
    doctorController.saveImage,
    doctorController.createOne
  );

router
  .route("/:id")
  .get(doctorController.getOneDoctor)
  .patch(doctorController.updateOne)
  .delete(doctorController.deleteOne);

module.exports = router;
