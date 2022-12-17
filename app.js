const express = require("express");
const doctorRouter = require("./routers/doctorRouter");
const hospitalRouter = require("./routers/hospitalRouter");
const userRouter = require("./routers/userRouter");
const departmentRouter = require("./routers/departmentRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const router = express.Router();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.json({
    hello: "hiii",
  });
});

app.use("/.netlify/functions/api/v1/doctor", doctorRouter);
app.use("/.netlify/functions/api/v1/hospital", hospitalRouter);
app.use("/.netlify/functions/api", router);
app.use("/.netlify/functions/api/v1/user", userRouter);
app.use("/.netlify/functions/api/v1/dep", departmentRouter);

module.exports = app;
module.exports.handler = serverless(app);
