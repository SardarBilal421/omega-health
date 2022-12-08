const express = require("express");
const router = express.Router();
const hospitalController = require("./../Controller/hospitalController");
const userController = require("./../Controller/userController");

router
  .route("/")
  .get(hospitalController.getAllHospital)
  .post(
    userController.protect,
    hospitalController.uploadHospitalPicDir,
    hospitalController.resizePicture,
    hospitalController.addHospital
  );
router
  .route("/:id")
  .get(hospitalController.getOneHospital)
  .patch(
    userController.protect,
    hospitalController.uploadHospitalPicDir,
    hospitalController.resizePicture,
    hospitalController.updateHospital
  )
  .delete(userController.protect, hospitalController.deleteHospital);

module.exports = router;
