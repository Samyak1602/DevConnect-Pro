const { cloudinary } = require('../config/cloudinary');
const Message = require('../models/Message');
const User = require('../models/User');
const { getSocketId } = require('../config/socket');
const ErrorResponse = require('../utils/errorResponse');


exports.getUsersForSidebar = async (req, res, next) => {
    try {
        // Use req.user.id from authMiddleware (decoded JWT contains 'id', not '_id')
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.find({_id:{ $ne : loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req,res,next) => {
    try{
        const {id : userToChatId} = req.params;
        const myId = req.user.id; // Use req.user.id from JWT

        const messages = await Message.find({
            $or:[
                { senderId : myId , receiverId : userToChatId},
                { senderId: userToChatId , receiverId : myId},
            ],
        })

        res.status(200).json(messages);

    }catch(err){
        next(err);
    }
}

exports.sendMessages = async(req,res,next) =>{
    try{
        const {text,image} = req.body;
        const { id : receiverId} = req.params;
        const senderId = req.user.id; // Use req.user.id from JWT

        // Validate that either text or image is provided
        if (!text && !image) {
            return next(new ErrorResponse('Message must contain text or image', 400));
        }

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl,
        })

        await newMessage.save();

        // Populate sender and receiver info for the real-time event
        await newMessage.populate('senderId', 'username avatar');
        await newMessage.populate('receiverId', 'username avatar');

        // Real-time functionality: emit the new message to the receiver ONLY
        const io = req.app.get('io');
        const receiverSocketId = getSocketId(receiverId);
        
        if (receiverSocketId) {
            // Send the message to the specific receiver
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // Don't send to sender - they already have optimistic update

        res.status(201).json(newMessage);
    }catch(err){
        next(err);
    }
}