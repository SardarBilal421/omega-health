const express = require("express");
const router = express.Router();
const doctorController = require("./../Controller/doctorController");

<<<<<<< HEAD
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
=======
router.route("/").get(doctorController.getAllDoctor).post(
  doctorController.uploadDoctorPicDir,
  // doctorController.resizePicture,
  doctorController.createOne
);

router
  .route("/:id")
  .get(doctorController.getOneDoctor)
  .patch(
    doctorController.uploadDoctorPicDir,
    // doctorController.resizePicture,
    doctorController.updateOne
  )
>>>>>>> origin/main
  .delete(doctorController.deleteOne);

module.exports = router;
