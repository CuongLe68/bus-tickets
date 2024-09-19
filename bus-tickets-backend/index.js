const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./src/api/v1/routers/user");
const otpRoute = require("./src/api/v1/routers/otp");
const tokenRoute = require("./src/api/v1/routers/token");

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
const baseURL = process.env.BASEURL;
const mongooseDBUrl = process.env.MONGOOSEDB_URL;

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

mongoose
  .connect(mongooseDBUrl)
  .then(() => {
    console.log("CONNECT SUCCESS MONGGODB!");
  })
  .catch((error) => {
    console.error("CONNECT FAIL MONGGODB!", error);
  });

app.use(cookieParser());
app.use(express.json());

//Routes
app.use(`${baseURL}/user`, userRoute);
app.use(`${baseURL}/otp`, otpRoute);
app.use(`${baseURL}/token`, tokenRoute);

//get ảnh
const path = require("path");
const uploadsDir = path.join(__dirname, "uploads");
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).send("Image not found");
    }
  });
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING! http://localhost:${port}`);
});
