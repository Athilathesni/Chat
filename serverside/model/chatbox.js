import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type:String},
    receiverId: { type: String },
    message: { type: String},
    time: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
});

export default mongoose.model.chatbox|| mongoose.model("chatbox", messageSchema);

