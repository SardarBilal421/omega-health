const express = require("express");
const router = express.Router();
const hospitalController = require("./../Controller/hospitalController");
<<<<<<< HEAD

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
=======
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
>>>>>>> origin/main
  .delete(hospitalController.deleteHospital);

module.exports = router;
