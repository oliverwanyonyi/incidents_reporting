
const { protect } = require('../middlewares/auth')

const router = require('express').Router()
const db = require('../models')
const Message = db.Message
const Chat = db.Chat
const User = db.User
const sequelize =require('sequelize')


router.route('/').get(protect, async (req,res,next)=>{
    try {
        console.log(req.user.id);
        const chats = await Chat.findAll({
            where: {
                '$chat_users.user$': req.user.id // Filter chats for the logged-in user
              },
            include: [
              {
                model: db.ChatUser, // Include the associated ChatUser model
              },
         
            
              {
                model: Message, // Include the associated Message model
                include: [
                  { model: User, as: 'senderInfo' },
                  { model: User, as: 'receiverInfo' }
                ],
                order: [['createdAt', 'DESC']]
              }
            ],
            order: [['createdAt', 'DESC']]
          });
          
          const populatedChats = await Promise.all(chats.map(async chat => {
            const chatWithUsers = chat.toJSON(); // Convert chat to JSON object
            const chatUsers = await db.ChatUser.findAll({ where: { chat_id: chat.id }, include: [{ model: db.User ,as:'chatUser'}] });
            chatWithUsers.chat_users = chatUsers.map(chatUser => chatUser.toJSON());
            return chatWithUsers;
          }));
          res.json({chats:populatedChats});
    } catch (error) {
        next(error)
    }
})


module.exports = router