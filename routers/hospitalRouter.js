const express = require("express");
const router = express.Router();
const hospitalController = require("./../Controller/hospitalController");

router.get("/getImage/:pictureName", hospitalController.getImage);
router.patch(
  "/uploadImage/:id",
  hospitalController.uploadHospitalPicDir,
  hospitalController.saveImage,
  hospitalController.imageUpload
);

router
  .route("/")
  .get(hospitalController.getAllHospital)
  .post(
    hospitalController.uploadHospitalPicDir,
    hospitalController.saveImage,
    hospitalController.addHospital
  );
router
  .route("/:id")
  .get(hospitalController.getOneHospital)
  .patch(hospitalController.updateHospital)
  .delete(hospitalController.deleteHospital);

module.exports = router;
