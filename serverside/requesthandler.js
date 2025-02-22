import userSchema from './model/user.js'
import chatMemberSchema from './model/Chat.js'
import messageSchema from './model/Message.js'
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const {sign}= jwt
const SECRET_KEY = "your_secret_key";
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
  user:"usmanchusman606@gmail.com",
  pass:"kobm upne reiz mryv"
},
})


export async function signUp(req,res){
    const {username,email,password,cpassword,phone,profile}=req.body
    if(!(username&&email&&password&&cpassword&&phone&&profile))
        return res.status(400).send({msg:"Fields are empty"})
    const userEmail=await userSchema.findOne({email})
    if(userEmail){
        return res.status(400).send({msg:"Email already exists"})
    }
    if(password!=cpassword){
        return res.status(400).send({msg:"Passwords are not matching"})
    }
    bcrypt.hash(password,10).then(async(hashedPassword)=>{
        await userSchema.create({username,email,password:hashedPassword,profile,phone}).then(()=>{
        return res.status(201).send({msg:"Successfully registered"})
        }).catch((error)=>{
        return res.status(400).send(error)
        })
    })  
}

export async function signIn(req,res){
   try {
    const {email,password}=req.body
    if(!(email&&password))
        return res.status(400).send({msg:"Fields are empty"})
    const user=await userSchema.findOne({email})
    if(!user){
        return res.status(400).send({msg:"User doesnt exist"})
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res.status(400).send({msg:"Invalid password"})
    }
    const token = await sign({userId:user._id},process.env.JWT_KEY,{expiresIn:"24h"})
    res.status(200).send({msg:"Successfully logged in",token})
   } catch (error) {
        return res.status(400).send(error) 
   }  
}
export async function checkEmail(req, res) {
  try {
      const { email, type } = req.body; // Expecting 'type' to be either 'signup' or 'forgot-password'

      let subject, htmlContent, buttonText, buttonUrl;

      // Logic to handle different email types
      if (type === 'signup') {
          subject = "EMAIL VERIFICATION";
          buttonText = "Verify Your Account";
          buttonUrl = "http://localhost:5173/signup";
          htmlContent = `
             <html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }

    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .email-header {
      margin-bottom: 20px;
    }

    .email-header img {
      width: 80px;
      height: auto;
    }

    .email-header h1 {
      font-size: 24px;
      color: #2c7a7b;
      margin: 10px 0 0;
    }

    .email-body {
      margin: 20px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #555555;
    }

    .btn {
      display: inline-block;
      background-color: #38b2ac;
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 30px;
      margin-top: 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }

    .btn:hover {
      background-color: #2c7a7b;
      box-shadow: 0 4px 10px rgba(56, 178, 172, 0.4);
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
    }

    .footer a {
      color: #38b2ac;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <h1>Email Verification</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Hello,</p>
      <p>
        Thank you for signing up with us! To complete your registration,
        please verify your email address by clicking the button below:
      </p>
      <a href="${buttonUrl}" class="btn">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    </div>

  
  </div>
</body>
</html>

          `;
      } else if (type === 'forgot-password') {
          subject = "RESET PASSWORD";
          buttonText = "Reset Your Password";
          buttonUrl = "http://localhost:5173/confirmpassword"; // You may want to replace this with a dynamic reset link
          htmlContent = `
             <html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RESET PASSWORD</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }

    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .email-header {
      margin-bottom: 20px;
    }

    .email-header img {
      width: 80px;
      height: auto;
    }

    .email-header h1 {
      font-size: 24px;
      color: #2c7a7b;
      margin: 10px 0 0;
    }

    .email-body {
      margin: 20px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #555555;
    }

    .btn {
      display: inline-block;
      background-color: #38b2ac;
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 30px;
      margin-top: 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      transition: background-color 0.3s ease, box-shadow 0.3s ease;
    }
      a{
       color: #ffffff;
      text-decoration: none;
      }

    .btn:hover {
      background-color: #2c7a7b;
      box-shadow: 0 4px 10px rgba(56, 178, 172, 0.4);
    }

    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999999;
    }

    .footer a {
      color: #38b2ac;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
     
      <h1>RESET PASSWORD</h1>
    </div>

    <!-- Body -->
    <div class="email-body">
      <p>Hello,</p>
      <p>
        If you requested a password reset, please click the button below to reset your password.
      </p>
      <a href="${buttonUrl}" class="btn">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    </div>

  
  </div>
</body>
</html>

          `;
      } else {
          return res.status(400).send({ msg: "Invalid request type" });
      }

      // Send the email using the transporter
      const info = await transporter.sendMail({
          from: 'usmanchusman606@gmail.com.com',
          to: email, // list of receivers
          subject: subject,
          text: "Please verify your action.",
          html: htmlContent, // html body
      });

      res.status(200).send({ msg: `${type.charAt(0).toUpperCase() + type.slice(1)} email sent successfully` });

  } catch (error) {
      return res.status(400).send(error);
  }
}


export async function changePassword(req,res) {

    const {password,email}=req.body
    //update the new password (hash before updating)
    bcrypt.hash(password,10).then((hashedPassword)=>{
        userSchema.updateOne({email},{$set:{password:hashedPassword}}).then(()=>{
               res.status(200).send({msg:"Your password has been succesfully updated"})
             }).catch((error)=>{
                console.log(error);
             })
    })

}

export async function getUser(req,res) {
    try {
        const id = req.user; // Current user's ID
        const { _id } = req.params;
    
        // Fetch all chat members where the user is either the sender or receiver
        const receivers = await chatMemberSchema.find({
            $or: [{ senderId: id }, { receiverId: id }]
        });
        // console.log(receivers);
    
        // Fetch details for each chat member, including the last message and unread count
        const chatMemberPromises = receivers.map(async (receiver) => {
            const partnerId = receiver.senderId === id ? receiver.receiverId : receiver.senderId;
    
            // Fetch partner's details
            const partnerDetails = await userSchema.findOne({ _id: partnerId }, { username: 1, profile: 1 });
    
            // Fetch the last message between the current user and the partner
            const lastMessage = await messageSchema
                .findOne({
                    $or: [
                        { senderId: id, receiverId: partnerId },
                        { senderId: partnerId, receiverId: id }
                    ]
                })
                .sort({ timestamp:-1 }); // Sort by latest time and date
                // console.log(lastMessage);
                
            // Count unread messages sent by the partner to the current user
            const unreadCount = await messageSchema.countDocuments({
                senderId: partnerId,
                receiverId: id,
                isRead: false // Assuming `isRead` field exists in messageSchema
            });
            // console.log(unreadCount);
            
    
            return {
                ...partnerDetails._doc, // Spread partner details
                lastMessage: lastMessage ? lastMessage.message : null,
                lastMessageTime: lastMessage ? lastMessage.time : null,
                lastMessageDate: lastMessage ? lastMessage.date : null,
                unreadCount
            };
        });
    
        // Wait for all chat members to be processed
        const chatMembers = await Promise.all(chatMemberPromises);
    
        // Fetch the current user's details
        const user = await userSchema.findOne({ _id: id });
        // console.log(chatMembers);
        
        // Send the response with user and chat members' details
        return res.status(200).send({ user, chatMembers });
    } catch (error) {
        console.error(error);
        return res.status(404).send(error);
    }
    
    
}
export async function openChat(req,res) {
    try {
        const id = req.user; // Current user's ID
        const { _id } = req.params;
         await messageSchema.updateMany({senderId:_id,receiverId:id,isRead:false},{$set:{isRead:true}}).then(()=>{
         return res.status(201).send({msg:"Successfully Updated"})

        }).catch((error)=>{
            console.log(error);
            return res.status(404).send(error)

        })
        

    } catch (error) {
        return res.status(404).send(error);
        
    }
    
}



export async function getReceiver(req,res) {
    try {
        const id=req.user
        const{_id}=req.params
        const user= await userSchema.findOne({_id:id})
        const ruser=await userSchema.findOne({_id})
        // console.log(user);
        return res.status(200).send({ruser,username:user.username})
    } catch (error) {
        return res.status(404).send(error)

        
    }
    
}

export async function editUser(req,res) {
    const _id=req.user 
    const {username,email,phone,profile}=req.body
    // console.log(profile);
    
    await userSchema.updateOne({_id},{$set:{username,email,phone,profile}}).then(()=>{
        res.status(201).send({msg:"Successfully Updated"})
    }).catch ((error)=>{
        return res.status(404).send(error)

    })
    
}

export async function getContacts(req,res) {
    try {
        const _id=req.user
        const user=await userSchema.findOne({_id})
        const contacts= await userSchema.find({_id:{$ne:_id}})
        // console.log(contacts);
        return res.status(200).send({contacts,username:user.username})
    } catch (error) {
        return res.status(404).send(error)

        
    }
    
}

export async function getContact(req,res) {
    try {
        const sid=req.user
        const {rid}=req.params
        const receiver=await userSchema.findOne({_id:rid},{profile:1,username:1})
        const sender=await userSchema.findOne({_id:sid},{profile:1,username:1})

        // console.log(receiver);
        
        const chats=await messageSchema.find({$or:[{senderId:sid,receiverId:rid},{senderId:rid,receiverId:sid}]});
        // console.log(contacts);
        return res.status(200).send({receiver,chats,uid:sid,sender})
    } catch (error) {
        console.log(error);
        
        return res.status(404).send(error)

        
    }
    
}

// export async function addMessage(req,res) {
//     try {
//         const {rid}=req.params;
//         const sid=req.user;
//         const {message,date,time}=req.body;
//         const chatmember=await chatMemberSchema.findOne({senderId:sid,receiverId:rid});
//         if(!chatmember)
//            await chatMemberSchema.create({senderId:sid,receiverId:rid})
//         const chats=await messageSchema.create({senderId:sid,receiverId:rid,message,date,time});
//         return res.status(201).send({msg:"success"});
//     } catch (error) {
//         console.log(error);
        
//         return res.status(404).send({msg:"error"})
//     }
// }

// export async function deleteMessage(req,res) {
//     try {
//         const {_id}=req.params;
//         const senderId=req.user;
//         const msg=await messageSchema.findOne({_id,senderId});
        
//         if(!msg)
//            return res.status(404).send({msg:"Cannot delete others message"});
//         const deletemessage=await messageSchema.deleteOne({$and:[{_id},{senderId}]})
//         return res.status(201).send({msg:"Success"});
//     } catch (error) {
//         return res.status(404).send({msg:"Error"})
//     }
// }


// Encrypt function
function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

// Decrypt function
function decryptMessage(encryptedMessage) {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export async function addMessage(req, res) {
  try {
      const { rid } = req.params;
      const sid = req.user;
      let { message, date, time } = req.body;

      // Encrypt the message before storing it
      const encryptedMessage = encryptMessage(message);

      // Check if chat members exist
      const chatmember = await chatMemberSchema.findOne({ senderId: sid, receiverId: rid });
      if (!chatmember) {
          await chatMemberSchema.create({ senderId: sid, receiverId: rid });
      }

      // Save encrypted message
      await messageSchema.create({
          senderId: sid,
          receiverId: rid,
          message: encryptedMessage,
          date,
          time
      });

      return res.status(201).send({ msg: "success" });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "error" });
  }
}

export async function deleteMessage(req, res) {
  try {
      const { _id } = req.params;
      const senderId = req.user;

      const msg = await messageSchema.findOne({ _id, senderId });

      if (!msg) {
          return res.status(404).send({ msg: "Cannot delete others' message" });
      }

      await messageSchema.deleteOne({ _id, senderId });

      return res.status(200).send({ msg: "Success" });
  } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Error" });
  }
}

// Function to get messages with decryption
export async function getMessages(req, res) {
  try {
      const { rid } = req.params;
      const sid = req.user;

      const messages = await messageSchema.find({ 
          $or: [{ senderId: sid, receiverId: rid }, { senderId: rid, receiverId: sid }]
      });

      // Decrypt messages before sending them
      const decryptedMessages = messages.map(msg => ({
          ...msg._doc,
          message: decryptMessage(msg.message)
      }));

      return res.status(200).send(decryptedMessages);
  } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Error" });
  }
}
