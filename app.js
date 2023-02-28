const express = require("express");
const doctorRouter = require("./routers/doctorRouter");
const hospitalRouter = require("./routers/hospitalRouter");
const userRouter = require("./routers/userRouter");
const departmentRouter = require("./routers/departmentRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
<<<<<<< HEAD
const serverless = require("serverless-http");
const router = express.Router();
=======
>>>>>>> origin/main

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
router.get("/", (req, res) => {
  res.json({
    hello: "hiii",
  });
});

app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/hospital", hospitalRouter);
// app.use("/.netlify/functions/api", router);
=======
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/hospital", hospitalRouter);
>>>>>>> origin/main
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dep", departmentRouter);

module.exports = app;
<<<<<<< HEAD
module.exports.handler = serverless(app);
=======
>>>>>>> origin/main
