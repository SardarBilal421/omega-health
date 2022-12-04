const express = require("express");
const router = express.Router();
const userController = require("./../Controller/userController");

router.post("/logIn", userController.loginUser);
router.route("/").post(userController.createOne);

// router
//   .route("/:id")
//   .patch(doctorController.updateOne)
//   .delete(doctorController.deleteOne);

module.exports = router;
