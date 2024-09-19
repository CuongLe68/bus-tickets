const otpController = require("../controllers/otpController");
const route = require("express").Router();

route.post("/send-otp", otpController.sendOtp);

module.exports = route;
