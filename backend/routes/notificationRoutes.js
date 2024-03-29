const { protect } = require('../middlewares/auth');
const { Notification, NotificationUser } = require('../models');

const router = require('express').Router()



router.route('/').get(protect, async(req,res,next)=>{
    try {

        const notifications = await Notification.findAll({
            where:{
                receiver_id:req.user.id
            },
            order:[['createdAt','DESC']]  
        })

        res.json({notifications})
        
    } catch (error) {
        next(error)
    }
})

router.route('/:notifId/delete').delete(protect,async (req,res,next)=>{
    try {

        await Notification.destroy({
            where:{
                id:req.params.notifId
            }
        })
        
         res.send('notif deleted')
    } catch (error) {
        next(error)
    }
})
module.exports = router