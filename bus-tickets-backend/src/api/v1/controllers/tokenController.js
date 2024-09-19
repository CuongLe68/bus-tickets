const { generateAccessToken, generateRefreshToken } = require("../helpers/helper");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { successCallBack } = require("../response/ResponseSuccess");

const tokencontroller = {
  //khi lộ token, hacker sẽ lợi dụng token gắn vào tài khoản họ để thực hiện các thao tác vượt quyền
  //vd: tài khoản "user", gắn token của admin vào và thực hiện các thao tác hoặc call các api có yêu cầu quyền của admin
  //thông tin của người dùng đang đăng nhập để lấy lại token mới để khi thực hiện thao tác thì server sẽ lấy token ra để check quyền
  //khi hết thời gian token, người dùng thực hiện thao tác gì thì nó sẽ gửi kèm thông tin lên để lấy token mới và thực hiện thao tác
  requestRefreshToken: async (req, res) => {
    try {
      const user = await User.findById(req.body.id);
      const refreshToken = user.refreshToken;

      if (!user) {
        return res.status(202).json({
          status: false,
          code: 401,
          message: "Tài khoản không tồn tại hoặc phiên đăng nhập đã kết thúc",
          data: null,
        });
      } else {
        jwt.verify(user.refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
          if (err) {
            return res.status(403).json(err);
          }
        });
        let newAccessToken = generateAccessToken(user.id, user.email, user.role);
        let newRefreshToken = generateRefreshToken(user.id, user.email, user.role);

        await User.findOneAndUpdate(
          {
            refreshToken: refreshToken,
          },
          { refreshToken: newRefreshToken }
        );

        //trả dữ liệu về
        return res.status(200).json(successCallBack({ accessToken: newAccessToken }));
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = tokencontroller;
