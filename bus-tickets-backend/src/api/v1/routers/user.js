const route = require("express").Router();
const userControllers = require("../controllers/userController");
const middlleware = require("../middlewares/middleware");

//create user
route.post("/register-user", userControllers.registerUser);
//login user
route.post("/login-user", userControllers.loginUser);
route.put("/update-user", middlleware.verifyToken, userControllers.updateUser);
//upload image
route.post("/upload-image", middlleware.verifyToken, userControllers.uploadImage);
route.post("/logout", middlleware.verifyToken, userControllers.logout);

module.exports = route;
