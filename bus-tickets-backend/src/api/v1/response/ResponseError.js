const failCallBack = (error) => {
  return {
    status: false,
    code: 500,
    message: `Server error ${error}`,
    data: null,
  };
};

const err_email_valid = {
  status: false,
  code: 40001,
  message: "Vui lòng nhập email đúng định dạng",
  data: null,
};
const err_fullname_valid = {
  status: false,
  code: 40002,
  message: "Họ tên phải lớn hơn 5 và nhỏ hơn 50 ký tự",
  data: null,
};
const err_password_valid = {
  status: false,
  code: 40003,
  message: "Mật khẩu phải lơn hơn 5 và nhỏ hơn 30 ký tự",
  data: null,
};
const err_email_already_exists = {
  status: false,
  code: 40004,
  message: "Địa chỉ email đã được đăng ký",
  data: null,
};
const err_phone_already_exists = {
  status: false,
  code: 40005,
  message: "Số điện thoại đã được đăng ký",
  data: null,
};
const err_identity_already_exists = {
  status: false,
  code: 40006,
  message: "Số cmnd/cccd đã được đăng ký.",
  data: null,
};
const err_email_fail = {
  status: false,
  code: 40007,
  message: "Tài khoản chưa được đăng ký",
  data: null,
};
const err_password_fail = {
  status: false,
  code: 40008,
  message: "Sai mật khẩu",
  data: null,
};
const err_old_password_fail = {
  status: false,
  code: 40008,
  message: "Mật khẩu cũ không chính xác",
  data: null,
};
const err_new_password_fail = {
  status: false,
  code: 40008,
  message: "Mật khẩu mới phải lớn hơn 5 và nhỏ hơn 30 ký tự",
  data: null,
};
const err_new_password_not_match = {
  status: false,
  code: 40008,
  message: "Mật khẩu mới không khớp",
  data: null,
};
const err_otp_email_fail = {
  status: false,
  code: 40009,
  message: "Vui lòng lấy mã OTP để xác thực eamil trước khi đăng ký",
  data: null,
};
const err_otp_time_fail = {
  status: false,
  code: 40010,
  message: "Mã OTP đã hết hiệu lực",
  data: null,
};
const err_otp_fail = {
  status: false,
  code: 40011,
  message: "Mã OTP không chính xác",
  data: null,
};
const err_phone_valid = {
  status: false,
  code: 400012,
  message: "Số điện thoại không đúng định dạng",
  data: null,
};
const err_day_of_birth_valid = {
  status: false,
  code: 400013,
  message: "Ngày sinh không hợp lệ",
  data: null,
};
const err_address_valid = {
  status: false,
  code: 400014,
  message: "Địa chỉ không hợp lệ",
  data: null,
};

module.exports = {
  failCallBack,
  err_email_valid,
  err_fullname_valid,
  err_password_valid,
  err_email_already_exists,
  err_phone_already_exists,
  err_identity_already_exists,
  err_email_fail,
  err_password_fail,
  err_old_password_fail,
  err_otp_email_fail,
  err_otp_time_fail,
  err_otp_fail,
  err_phone_valid,
  err_day_of_birth_valid,
  err_address_valid,
  err_new_password_fail,
  err_new_password_not_match,
};
