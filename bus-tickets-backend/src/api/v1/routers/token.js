const { requestRefreshToken } = require("../controllers/tokenController");

const route = require("express").Router();

//Khi phiên đăng nhập hết hạn, có thể call api này để lấy token mới
route.post("/refresh-token", requestRefreshToken);

module.exports = route;
