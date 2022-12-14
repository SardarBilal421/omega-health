const express = require("express");
const router = express.Router();
const departmentController = require("./../Controller/departmentController");

router
  .route("/")
  .get(departmentController.getAllDepartment)
  .post(departmentController.createOne);

router
  .route("/:id")
  .get(departmentController.getById)
  .patch(departmentController.updateDepartment)
  .delete(departmentController.deleteDepartment);

module.exports = router;
