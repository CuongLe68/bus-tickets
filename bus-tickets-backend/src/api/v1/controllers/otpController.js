const Otp = require("../models/Otp");
const nodemailer = require("nodemailer");
const { generateOTP } = require("../helpers/helper");
const { successCallBack } = require("../response/ResponseSuccess");
const { failCallBack } = require("../response/ResponseError");
const User = require("../models/User");

const otpController = {
  sendOtp: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(201).json({
          status: true,
          code: 403,
          message: `Tài khoản này đã được đăng ký`,
          data: null,
        });
      }
      let email = null;
      let currentOtp = null;
      email = await Otp.findOne({ email: req.body.email });
      const otp = await generateOTP();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(req.body.email)) {
        return res.status(201).json({
          status: true,
          code: 403,
          message: `email không đúng định dạng`,
          data: null,
        });
      } else if (!email) {
        email = await new Otp({
          email: req.body.email,
          otp: otp,
        });
        currentOtp = await email.save();
        sendMail(60);
      } else {
        let currentTime = new Date();
        let timeCreateOtp = new Date(email.updatedAt);
        let time = Math.floor((currentTime - timeCreateOtp) / 1000);
        let delay = 0;

        if (email.verifyCount / 5 === 1) {
          delay = 300 - time;
        } else if (email.verifyCount / 5 === 2) {
          delay = 900 - time;
        } else if (email.verifyCount / 5 === 3) {
          delay = 3600 - time;
        } else if (email.verifyCount / 5 === 4) {
          delay = 28800 - time;
        } else if (email.verifyCount / 5 > 4 && email.verifyCount % 5 === 0) {
          delay = 864070 - time;
        } else {
          delay = 60 - time;
        }

        if (delay <= 0) {
          // update otp vào kết quả tìm được
          currentOtp = await Otp.findOneAndUpdate(
            { email: req.body.email },
            { otp: otp, verifyCount: email.verifyCount + 1 },
            { new: true }
          );
          sendMail(60);
        } else {
          return res.status(200).json({
            status: true,
            code: 200,
            message: `Mã OTP đã được gửi trước đó, vui lòng gửi lại yêu cầu sau ${delay} giây`,
            data: delay,
          });
        }
      }

      async function sendMail(time) {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
          },
        });
        await transporter.sendMail(
          {
            from: `"Bus Tickets" <${process.env.EMAIL}>`,
            to: `${req.body.email}`,
            subject: "CÔNG TY CỔ PHẦN BUSTICKETS",
            text: `Mã otp đăng ký tài khoản của bạn là: ${currentOtp.otp}, mã có hiệu lực 1 phút, tuyệt đối không cung cấp mã otp cho bất kỳ ai.`,
            html: ``,
          },
          (error) => {
            if (error) {
              return res.status(500).json(failCallBack(error));
            }
            return res.status(200).json(successCallBack(time));
          }
        );
      }
    } catch (error) {
      return res.status(500).json(failCallBack(error));
    }
  },
};

module.exports = otpController;
