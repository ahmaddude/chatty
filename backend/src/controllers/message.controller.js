import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers =await User.find({_id:{$ne:loggedInUserId} }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error);
        res.status(500).json({message: "Server Error"});
    }
};

export const getMessages = async (req, res) => {
    try {
       const{id:userToChatId} = req.params
       const myId= req.user._id;

       const messages=await Message.find({
        $or:[
            {senderId:myId, receiverId:userToChatId},
            {senderId:userToChatId, receiverId:myId}
        ]
       })
       
       res.status(200).json(messages)
    } catch (error) {
        console.log("error in getMessages controller",error);
        res.status(500).json({error:"Internal server error"});
    }
};


export const sendMessage=async(req,res)=>{
    cloudinary.config({ 
        cloud_name: 'dzycjab1i', 
        api_key: '626133734785613', 
        api_secret: 'dR1Ywvmg4kKwgKXZqS0YRuB4Ufw' // Click 'View API Keys' above to copy your API secret
    });
    try {
        const{ Text, Image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(Image){
            //upload base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(Image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId,
            receiverId,
            Text,
            Image:imageUrl 
        });
        await newMessage.save();


//todo: realtime functionality goes here => socket.io
const receiverSocketId=getReceiverSocketId(receiverId)
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)
}

console.log("new message",newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendMessage controller",error.message);
        res.status(500).json({error:"Internal server error"});
    }
};