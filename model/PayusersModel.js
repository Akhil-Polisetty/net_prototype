import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uname: String,
  email: String,
  phone: String,
  city: String,
  password: String,
  amount: Number,
  loan_amount: {
    type: Number,
    default: 0,
  },
  loan_duration: Number,
  loan_s_date: {
    type: Date,
    default: Date.now,
  },
  interest: Number,
});

export default mongoose.models.Payuser || mongoose.model("Payuser", UserSchema);
