const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    fullName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    phoneNumber: {
      type: String,
      minlength: 10,
      maxlength: 15,
      default: null,
    },
    sex: {
      type: String,
      maxlength: 50,
      default: "",
    },
    money: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      maxlength: 50,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
      maxlength: 200,
    },
    dateOfBirth: {
      type: Date, //ngày sinh
      default: null,
      minlength: 10,
      maxlength: 11,
    },
    identityNumber: {
      type: String, //Số cmnnd
      minlength: 9,
      maxlength: 15,
      default: null,
    },
    vehicleType: {
      type: String, //Loại phương tiện shipper sử dụng (ví dụ: xe máy, xe hơi).
      enum: ["motorbike", "car"],
      default: null,
    },
    vehicleNumber: {
      type: String, //Biển số xe
      default: null,
    },
    availability: {
      type: Boolean, //Trạng thái sẵn sàng làm việc (ví dụ: online/offline).
      default: false,
    },
    currentLocation: {
      type: {
        type: String,
        default: "Point",
      }, //Vị trí hiện tại của shipper (kinh độ, vĩ độ), hiển thị cho người dùng thấy
      coordinates: [Number],
    },
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId, //Các đơn hàng đang được giao cho shipper(shiper đang giao)
        ref: "Order",
      },
    ],
    rating: {
      type: Number, //Đánh giá trung bình từ khách hàng.
      default: 5,
    },
    completedDeliveries: {
      type: Number, //Số lượng đơn hàng đã giao thành công.
      default: 0,
    },
    verified: {
      type: Boolean, //Trạng thái xác minh tài khoản (nếu cần).
      default: false,
    },
    deliveryHistory: [
      // Lịch sử các đơn hàng đã giao, bao gồm các thông tin như ngày, giờ, địa chỉ giao hàng, và trạng thái giao hàng.
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        deliveryDate: { type: Date, required: true },
        deliveryAddress: { type: String, required: true },
        status: {
          type: String,
          enum: ["delivered", "failed", "pending"],
          default: "pending",
        },
      },
    ],
    earnings: {
      //Tổng số tiền kiếm được qua các đơn giao hàng.
      totalEarnings: { type: Number, default: 0 },
      earningsByOrder: [
        {
          orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
          amount: { type: Number, required: true },
        },
      ],
    },
    refreshToken: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user", "shipper"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
