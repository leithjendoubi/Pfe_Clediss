import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: ""  },
  verifyOtp: { type: String, default: "" },
  cartData: { type: Object, default: {} },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  isLivreur: { type: Boolean, default: false },
  isVendeur: { type: Boolean, default: false },
  isProducteur: { type: Boolean, default: false },      
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
