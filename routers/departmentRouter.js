const express = require("express");
const router = express.Router();
const departmentController = require("./../Controller/departmentController");

router
  .route("/")
  .get(departmentController.getAllDepartment)
  .post(userController.protect, departmentController.createOne);

router
  .route("/:id")
  .get(departmentController.getById)
  .patch(userController.protect, departmentController.updateDepartment)
  .delete(userController.protect, departmentController.deleteDepartment);

module.exports = router;
