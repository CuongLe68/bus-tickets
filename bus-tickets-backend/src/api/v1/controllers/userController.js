const User = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const {
  failCallBack,
  err_email_already_exists,
  err_email_valid,
  err_fullname_valid,
  err_password_valid,
  err_email_fail,
  err_password_fail,
  err_otp_email_fail,
  err_otp_time_fail,
  err_otp_fail,
  err_identity_already_exists,
  err_phone_valid,
  err_day_of_birth_valid,
  err_address_valid,
  err_old_password_fail,
  err_new_password_fail,
  err_new_password_not_match,
} = require("../response/ResponseError");
const { successCallBack } = require("../response/ResponseSuccess");
const Otp = require("../models/Otp");
const { generateAccessToken, generateRefreshToken } = require("../helpers/helper");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../../uploads")); // Đường dẫn đến thư mục uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const userController = {
  //register user
  registerUser: async (req, res) => {
    try {
      const checkMail = await User.findOne({ email: req.body.email }).exec();
      const currentOtp = await Otp.findOne({ email: req.body.email }).exec();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(req.body.email)) {
        return res.status(200).json(err_email_valid);
      } else if (checkMail) {
        return res.status(200).json(err_email_already_exists);
      } else if (!currentOtp) {
        return res.status(200).json(err_otp_email_fail);
      } else if (currentOtp) {
        let currentTime = new Date();
        let timeCreateOtp = new Date(currentOtp.updatedAt);
        const time = currentTime - timeCreateOtp;
        if (time > 60000) {
          return res.status(200).json(err_otp_time_fail);
        } else if (req.body.otp !== currentOtp.otp) {
          return res.status(200).json(err_otp_fail);
        } else {
          if (req.body.fullName.length < 5) {
            return res.status(200).json(err_fullname_valid);
          } else if (req.body.password.length < 5) {
            return res.status(200).json(err_password_valid);
          } else {
            //update otp
            await Otp.findOneAndUpdate({ email: req.body.email }, { verifyCount: 0 });
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
              email: req.body.email,
              fullName: req.body.fullName,
              password: hashed,
            });

            //save to database
            await newUser.save();

            return res.status(200).json(successCallBack());
          }
        }
      }
    } catch (error) {
      return res.status(500).json(failCallBack(error));
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      let newAccessToken = null;
      let newRefreshToken = null;

      if (!user) {
        return res.status(200).json(err_email_fail);
      } else {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
          return res.status(200).json(err_password_fail);
        } else if (user && validPassword) {
          //Xử lý lấy token
          newAccessToken = generateAccessToken(user.id, user.email, user.role);
          newRefreshToken = generateRefreshToken(user.id, user.email, user.role);

          //Lưu refesh lại để lần sau có thể lấy ra tạo lại accesstoken
          await User.findOneAndUpdate({ email: req.body.email }, { refreshToken: newRefreshToken });

          //trả dữ liệu về
          const { password, refreshToken, ...others } = user._doc;
          return res.status(200).json(successCallBack({ ...others, accessToken: newAccessToken }));
        }
      }
    } catch (error) {
      return res.status(500).json(failCallBack(error));
    }
  },
  //update user
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!user) {
        return res.status(403).json(err_email_fail); //tài khoản k tồn tại
      }
      if (req.body.fullName && (req.body.fullName.length < 5 || req.body.fullName.length > 50)) {
        return res.status(403).json(err_fullname_valid); // họ tên ngắn
      }
      if (req.body.phoneNumber && !phoneRegex.test(req.body.phoneNumber)) {
        return res.status(403).json(err_phone_valid); // Số điện thoại sai định dạng
      }
      if (req.body.email && !emailRegex.test(req.body.email)) {
        return res.status(403).json(err_email_valid); // email không đúng định dạng
      }
      if (req.body.dateOfBirth) {
        const date = new Date();
        const dateUser = new Date(req.body.dateOfBirth);
        if (date - dateUser <= 0) {
          return res.status(403).json(err_day_of_birth_valid); // Ngày sinh không hợp lệ
        }
      }
      if (req.body.address && (req.body.address.length < 5 || req.body.address.length > 50)) {
        return res.status(403).json(err_address_valid); //địa chỉ không hợp lệ
      }
      //thay đổi mật khẩu
      if (req.body.password) {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
          return res.status(403).json(err_old_password_fail);
        }
        if (!req.body.newPassword || req.body.newPassword.length < 5 || req.body.newPassword.length > 30) {
          return res.status(403).json(err_new_password_fail);
        }
        if (req.body.newPassword !== req.body.rePassword) {
          return res.status(403).json(err_new_password_not_match);
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newPassword, salt);
        const newUser = await User.findByIdAndUpdate(req.body.id, { password: hashed }, { new: true });
        const { password, refreshToken, ...userRes } = newUser._doc;
        return res.status(200).json(successCallBack(userRes));
      }

      const newUser = await User.findByIdAndUpdate(req.body.id, req.body, { new: true });
      const { password, refreshToken, ...userRes } = newUser._doc;

      return res.status(200).json(successCallBack(userRes));
    } catch (error) {
      return res.status(500).json(failCallBack(error));
    }
  },
  //upload ảnh đại diện
  uploadImage: async (req, res) => {
    // Sử dụng `upload.single('file')` để xử lý file upload
    upload.single("file")(req, res, async (error) => {
      if (error) {
        return res.status(500).json(failCallBack(error));
      }
      if (!req.file) {
        return res.status(203).json({ status: true, code: 200, message: "Không có file được tải lên", data: null });
      }

      // Đường dẫn ảnh được lưu trong req.file.path
      const newImageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

      try {
        const user = await User.findById(req.body.userId);
        if (!user) {
          return res.status(204).json({ message: "Người dùng không tồn tại" });
        }
        // Xóa ảnh cũ nếu có
        if (user.avatarUrl) {
          const oldImagePath = path.join(__dirname, "../../../../uploads", path.basename(user.avatarUrl));
          try {
            await fs.access(oldImagePath);
            await fs.unlink(oldImagePath);
          } catch (error) {
            console.error("Error handling old image:", error);
          }
        }

        // Cập nhật đường dẫn ảnh mới vào cơ sở dữ liệu
        const userUpdate = await User.findByIdAndUpdate(req.body.userId, { avatarUrl: newImageUrl }, { new: true });
        const { password, refreshToken, ...others } = userUpdate._doc;

        return res.status(200).json({
          status: true,
          code: 200,
          message: "Cập nhật ảnh thành công",
          data: { ...others },
        });
      } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lưu dữ liệu", error: error.message });
      }
    });
  },
  logout: async (req, res) => {
    try {
      const user = await User.findById(req.body.userId);

      if (!user) {
        return res.status(200).json({
          status: false,
          code: 200,
          message: "Tài khoản này không tồn tại",
          data: null,
        });
      }
      await User.findByIdAndUpdate(req.body.userId, { refreshToken: "" });
      return res.status(200).json({
        status: true,
        code: 200,
        message: "Đăng xuất thành công",
        data: null,
      });
    } catch (error) {
      return res.status(500).json(failCallBack(error));
    }
  },
};

module.exports = userController;
