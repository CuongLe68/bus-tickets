const jwt = require("jsonwebtoken");

const middlleware = {
  //kiểm tra phiên đăng nhập còn hiệu lực không
  verifyToken: async (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      const accesstoken = token.split(" ")[1];
      jwt.verify(accesstoken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(203).json({
            status: false,
            code: 401,
            message: "Phiên đăng nhập đã hết hạn",
            data: null,
          });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(204).json({
        status: false,
        code: 402,
        message: "Lỗi hệ thống",
        data: null,
      });
    }
  },

  //kiểm tra phiên đăng nhập còn hiệu lực không và tài khoản này có phải admin không
  verifyTokenAndAdmin: async (req, res, next) => {
    middlleware.verifyToken(req, res, () => {
      if (req.user.role === "admin") {
        next();
      } else {
        return res.status(203).json("Bạn không có quyền thực hiện thao tác này!");
      }
    });
  },
};

module.exports = middlleware;
