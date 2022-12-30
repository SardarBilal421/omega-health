const express = require("express");
const doctorRouter = require("./routers/doctorRouter");
const hospitalRouter = require("./routers/hospitalRouter");
const userRouter = require("./routers/userRouter");
const departmentRouter = require("./routers/departmentRouter");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dep", departmentRouter);

module.exports = app;
