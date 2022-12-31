const express = require("express");
const router = express.Router();
const hospitalController = require("./../Controller/hospitalController");
router.patch(
  "/imageUpload/:id",
  hospitalController.uploadHospitalPicDir,
  hospitalController.imageUpload
);
router.route("/").get(hospitalController.getAllHospital).post(
  hospitalController.uploadHospitalPicDir,
  // hospitalController.resizePicture,
  hospitalController.addHospital
);
router
  .route("/:id")
  .get(hospitalController.getOneHospital)
  .patch(
    hospitalController.uploadHospitalPicDir,
    // hospitalController.resizePicture,
    hospitalController.updateHospital
  )
  .delete(hospitalController.deleteHospital);

module.exports = router;
