const jwt = require("jsonwebtoken");

const helper = {
  generateOTP: async () => {
    let randomNumber = "";
    while (randomNumber.length !== 6) {
      randomNumber = `${Math.floor(Math.random() * 1000000)}`;
    }
    return randomNumber;
  },
  generateAccessToken: (id, email, role) => {
    return jwt.sign(
      {
        id: id,
        admin: email,
        role: role,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30m" }
    );
  },
  generateRefreshToken: (id, email, role) => {
    return jwt.sign(
      {
        id: id,
        admin: email,
        role: role,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  },
};

module.exports = helper;
