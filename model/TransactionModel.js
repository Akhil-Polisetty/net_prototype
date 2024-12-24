import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    sender:String,
    sender_name:String,
    receiver:String,
    receiver_name:String,
    time:Date,
    Transaction_id:String,
    amount:Number
})

export default mongoose.models.Transaction || mongoose.model("Transaction", UserSchema);
