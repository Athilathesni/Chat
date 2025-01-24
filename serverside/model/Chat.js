import mongoose from "mongoose";

const chatMemberSchema=new mongoose.Schema({
    senderId:{type:String},
    receiverId:{type:String}
});

export default mongoose.model.Chat || mongoose.model("Chat",chatMemberSchema);

